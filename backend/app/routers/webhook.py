import logging
from fastapi import APIRouter, Request, HTTPException
from app.core.config import settings
from app.core.logging import mask_secret
from app.services.flow_service import (
    get_flow_status,
    validate_webhook_signature
)
from app.services.supabase_service import (
    get_order_by_token,
    update_order_by_token
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/webhook/flow")
async def flow_webhook(request: Request):
    try:
        secret = request.query_params.get("secret")
        if not secret or secret != settings.flow_webhook_secret:
            logger.warning("Webhook rechazado por secreto inválido o ausente")
            raise HTTPException(status_code=401, detail="Unauthorized")

        form = await request.form()
        data = dict(form)
        
        token = data.get("token")
        if not token:
            logger.warning("Webhook recibido sin token")
            return {"status": "ok"}

        masked_token = mask_secret(token)
        logger.info(f"Procesando Webhook para token: {masked_token}")

        flow_status = await get_flow_status(token)
        
        if not flow_status or "status" not in flow_status:
            logger.error(f"No se pudo obtener el estado de Flow para el token: {masked_token}")
            return {"status": "ok"}

        status_mapping = {
            1: "pending",
            2: "paid",
            3: "rejected",
            4: "canceled"
        }
        
        flow_code = flow_status.get("status")
        new_status = status_mapping.get(flow_code, "failed")

        order = await get_order_by_token(token)
        if not order:
            logger.error(f"Orden no encontrada en DB para el token: {masked_token}")
            return {"status": "ok"}

        if order["status"] == "paid":
            return {"status": "ok"}

        await update_order_by_token(token, {"status": new_status})
        logger.info(f"Orden {masked_token} actualizada a {new_status} exitosamente")

        return {"status": "ok"}

    except Exception:
        logger.error("Error procesando Webhook", exc_info=True)
        return {"status": "ok"}