import logging
from fastapi import APIRouter, Request, HTTPException

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
        form = await request.form()
        data = dict(form)

        signature = data.pop("s", None)

        if not signature:
            logger.warning("Missing signature in webhook - continuing")

        if signature and not validate_webhook_signature(data, signature):
            logger.warning("Invalid webhook signature")
            return {"status": "ok"}

        token = data.get("token")

        if not token:
            logger.warning("Missing token in webhook")
            return {"status": "ok"}

        logger.info("Webhook received", extra={"token": token})

        flow_status = await get_flow_status(token)

        if not flow_status or "status" not in flow_status:
            logger.error("Invalid Flow response", extra={"token": token})
            return {"status": "ok"}

        status = flow_status["status"]

        if status == 2:
            new_status = "paid"
        elif status == 3:
            new_status = "rejected"
        elif status == 1:
            new_status = "pending"
        elif status == 4:
            new_status = "canceled"
        else:
            new_status = "failed"

        order = await get_order_by_token(token)

        if not order:
            logger.error("Order not found", extra={"token": token})
            return {"status": "ok"} 

        current_status = order["status"]

        if current_status == "paid":
            logger.info("Order already paid (idempotent)", extra={"token": token})
            return {"status": "ok"}

        await update_order_by_token(token, {
            "status": new_status
        })

        logger.info("Order updated", extra={
            "token": token,
            "status": new_status
        })

        return {"status": "ok"}

    except Exception:
        logger.error("Webhook error", exc_info=True)
        return {"status": "ok"} 