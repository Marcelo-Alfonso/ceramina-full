from fastapi import APIRouter, HTTPException, Query
import logging

from app.services.supabase_service import (
    get_order_by_token,
    update_order_by_token,
    get_order_items_by_order_id
)
from app.services.flow_service import get_flow_status

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/order-status")
async def order_status(token: str = Query(...)):
    try:
        order = await get_order_by_token(token)

        if not order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")

        current_status = order["status"]

        flow_status = await get_flow_status(token)

        if not flow_status or "status" not in flow_status:
            logger.error("Invalid Flow response", extra={"token": token})
            return {"status": current_status}

        flow_state = flow_status["status"]

        if flow_state == 2:
            new_status = "paid"
        elif flow_state == 3:
            new_status = "rejected"
        elif flow_state == 1:
            new_status = "pending"
        else:
            new_status = "failed"

        if new_status != current_status:
            await update_order_by_token(token, {
                "status": new_status
            })

            logger.info("Order status synced", extra={
                "token": token,
                "old": current_status,
                "new": new_status
            })

        return {
            "status": new_status
        }

    except HTTPException:
        raise

    except Exception:
        logger.error("Error getting order status", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/order/by-token/items")
async def get_order_items_by_token(token: str = Query(...)):
    try:
        order = await get_order_by_token(token)

        if not order:
            raise HTTPException(404, "Orden no encontrada")

        items = await get_order_items_by_order_id(order["id"])

        return {
            "order_id": order["id"],
            "status": order["status"],
            "shipping_method": order["shipping_method"],
            "shipping_cost": order["shipping_cost"],
            "address": order["address"],
            "phone": order["phone"],
            "amount": order["amount"],
            "items": items
        }

    except Exception:
        logger.error("Error fetching order items by token", exc_info=True)
        raise HTTPException(500, "Internal server error")