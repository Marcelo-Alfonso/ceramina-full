import logging
from fastapi import APIRouter, HTTPException, Depends

from app.core.logging import mask_email, mask_secret
from app.schemas.payment import CreatePaymentRequest, CreatePaymentResponse
from app.services.supabase_service import (
    get_products_by_ids,
    create_order,
    create_order_items,
    update_order,
    get_order_by_idempotency_key
)
from app.services.shipping_service import calculate_shipping
from app.services.flow_service import create_flow_payment
from app.core.config import settings
from app.security.security import verify_api_key


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/create-payment", response_model=CreatePaymentResponse)
async def create_payment(data: CreatePaymentRequest, _: None = Depends(verify_api_key)):
    try:
        if not data.acceptedTerms:
            raise HTTPException(400, "Debes aceptar los términos y condiciones")

        idempotency_key = data.idempotencyKey
        logger.info("New payment request", extra={
            "email": mask_email(data.email),
            "region": data.region,
            "items_count": len(data.items),
            "idempotency_key": mask_secret(idempotency_key)
        })
        existing_order = await get_order_by_idempotency_key(idempotency_key)

        if existing_order:
            if existing_order["status"] == "pending" and existing_order.get("flow_token"):
                return {
                    "url": f"{settings.flow_base_url}/payment/pay?token={existing_order['flow_token']}"
                }
            if existing_order["status"] == "paid":
                raise HTTPException(400, "Esta orden ya fue pagada")

        product_ids = [item.productId for item in data.items]
        products = await get_products_by_ids(product_ids)
        
        if not products or len(products) != len(product_ids):
            raise HTTPException(400, "Uno o más productos no están disponibles")

        product_map = {p["id"]: p for p in products}
        subtotal_amount = 0
        order_items_payload = []

        for item in data.items:
            product = product_map.get(item.productId)
            if not product:
                raise HTTPException(400, "Producto inválido")

            price = product["final_price"]
            subtotal_amount += price * item.quantity

            order_items_payload.append({
                "product_id": product["id"],
                "quantity": item.quantity,
                "price": price,
                "original_price": product["original_price"],
            })

        region = data.region.lower()
        if region == "arica":
            shipping_cost = 0
        elif region == "santiago":
            shipping_cost = 6000
        else:
            raise HTTPException(400, f"Región '{region}' no soportada para envíos actualmente")

        total_amount = subtotal_amount + shipping_cost

        if total_amount <= 0:
            raise HTTPException(400, "Monto total inválido")

        order_payload = {
            "email": data.email,
            "name": data.name,
            "rut": data.rut,
            "address": data.address,
            "phone": data.phone,
            "region": data.region,
            "shipping_cost": shipping_cost,
            "amount": total_amount,
            "status": "pending",
            "idempotency_key": idempotency_key
        }

        order = await create_order(order_payload)
        if not order:
            raise HTTPException(500, "Error creando orden en base de datos")

        for item in order_items_payload:
            item["order_id"] = order["id"]
        
        await create_order_items(order_items_payload)

        flow_params = {
            "apiKey": settings.flow_api_key,
            "commerceOrder": order["id"],
            "subject": f"Compra de {data.name} - {settings.app_name}",
            "currency": "CLP",
            "amount": total_amount,
            "email": data.email,
            "urlConfirmation": settings.flow_confirmation_url,
            "urlReturn": settings.flow_return_url,
        }

        flow_res = await create_flow_payment(flow_params)

        if "url" not in flow_res or "token" not in flow_res:
            logger.error("Invalid Flow response", extra={"response": flow_res})
            raise HTTPException(500, "Error en la pasarela de pagos")

        await update_order(order["id"], {
            "flow_token": flow_res["token"],
            "flow_order": flow_res.get("flowOrder")
        })

        return {
            "url": f"{flow_res['url']}?token={flow_res['token']}"
        }

    except HTTPException:
        raise
    except Exception:
        logger.error("Error in create_payment", exc_info=True)
        raise HTTPException(500, "Internal server error")