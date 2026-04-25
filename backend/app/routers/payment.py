import logging
from fastapi import APIRouter, HTTPException, Depends

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
async def create_payment(data: CreatePaymentRequest,_: None =Depends(verify_api_key)):

    try:
        if not data.acceptedTerms:
            raise HTTPException(400, "Debes aceptar los términos y condiciones")
        logger.info("New payment request", extra={
            "email": data.email,
            "items": [i.productId for i in data.items],
            "shipping_method": data.shippingMethod
        })

        idempotency_key = data.idempotencyKey

        existing_order = await get_order_by_idempotency_key(idempotency_key)

        if existing_order:
            logger.info("Existing order found", extra={
                "order_id": existing_order["id"],
                "status": existing_order["status"]
            })

            if existing_order["status"] == "pending" and existing_order.get("flow_token"):
                return {
                    "url": f"{settings.flow_base_url}/payment/pay?token={existing_order['flow_token']}"
                }

            if existing_order["status"] == "paid":
                raise HTTPException(400, "Esta orden ya fue pagada")

        product_ids = [item.productId for item in data.items]
        products = await get_products_by_ids(product_ids)
        if not products:
            raise HTTPException(404, "No se encontraron productos")
        if len(products) != len(product_ids):
            raise HTTPException(400, "Uno o más productos no están disponibles")


        product_map = {p["id"]: p for p in products}

        total_amount = 0
        order_items_payload = []

        for item in data.items:
            product = product_map.get(item.productId)

            if not product:
                raise HTTPException(400, "Producto inválido en la orden")

            subtotal = product["final_price"] * item.quantity
            total_amount += subtotal

            order_items_payload.append({
                "product_id": product["id"],
                "quantity": item.quantity,
                "price": product["final_price"],
                "original_price": product["original_price"],
            })

        if total_amount <= 0:
            raise HTTPException(400, "Monto inválido")

        try:
            shipping_cost = calculate_shipping(data.shippingMethod)
        except ValueError:
            raise HTTPException(400, "Método de envío inválido")
        FREE_SHIPPING_THRESHOLD = 20000

        if total_amount >= FREE_SHIPPING_THRESHOLD:
            shipping_cost = 0

        total_amount += shipping_cost

        order_payload = {
            "email": data.email,
            "address": data.address,
            "phone": data.phone,
            "shipping_method": data.shippingMethod,
            "shipping_cost": shipping_cost,
            "amount": total_amount,
            "status": "pending",
            "idempotency_key": idempotency_key
        }

        order = await create_order(order_payload)

        if not order:
            raise HTTPException(500, "Error creando orden")

        for item in order_items_payload:
            item["order_id"] = order["id"]

        await create_order_items(order_items_payload)

        flow_params = {
            "apiKey": settings.flow_api_key,
            "commerceOrder": order["id"],
            "subject": f"Compra en {settings.app_name}",
            "currency": "CLP",
            "amount": total_amount,
            "email": data.email,
            "urlConfirmation": settings.flow_confirmation_url,
            "urlReturn": settings.flow_return_url,
        }

        flow_res = await create_flow_payment(flow_params)

        if "url" not in flow_res or "token" not in flow_res:
            logger.error("Invalid Flow response", extra={"response": flow_res})
            raise HTTPException(500, "Error en Flow")

        await update_order(order["id"], {
            "flow_token": flow_res["token"],
            "flow_order": flow_res.get("flowOrder")
        })

        logger.info("Payment created", extra={
            "order_id": order["id"],
            "amount": total_amount,
            "shipping_cost": shipping_cost,
            "shipping_method": data.shippingMethod
        })

        return {
            "url": f"{flow_res['url']}?token={flow_res['token']}"
        }

    except HTTPException:
        raise

    except Exception:
        logger.error("Error in create_payment", exc_info=True)
        raise HTTPException(500, "Internal server error")