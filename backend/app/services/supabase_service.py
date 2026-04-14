import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key
)


async def get_products_by_ids(product_ids: list[int]):
    try:
        res = supabase.table("products") \
            .select("*") \
            .in_("id", product_ids) \
            .execute()

        return res.data or []

    except Exception:
        logger.error("Error fetching products", exc_info=True)
        return []


async def get_product(product_id: int):
    try:
        res = supabase.table("products") \
            .select("*") \
            .eq("id", product_id) \
            .maybe_single() \
            .execute()

        return res.data

    except Exception:
        logger.error(f"Error fetching product {product_id}", exc_info=True)
        return None


async def create_order(order_data: dict):
    try:
        res = supabase.table("orders").insert(order_data).execute()

        if res.data:
            order = res.data[0]
            logger.info("Order created", extra={"order_id": order.get("id")})
            return order

        return None

    except Exception:
        logger.error("Error creating order", exc_info=True)
        return None


async def get_order_by_token(token: str):
    try:
        res = supabase.table("orders") \
            .select("*") \
            .eq("flow_token", token) \
            .maybe_single() \
            .execute()

        return res.data

    except Exception:
        logger.error("Error fetching order by token", exc_info=True)
        return None


async def get_order_by_idempotency_key(key: str):
    try:
        res = supabase.table("orders") \
            .select("*") \
            .eq("idempotency_key", key) \
            .maybe_single() \
            .execute()

        if not res:
            logger.error("Supabase returned None", extra={"key": key})
            return None

        return res.data

    except Exception:
        logger.error("Error fetching order by idempotency key", exc_info=True)
        return None


async def update_order(order_id: str, new_data: dict):
    try:
        res = supabase.table("orders") \
            .update(new_data) \
            .eq("id", order_id) \
            .execute()

        if res.data:
            logger.info("Order updated", extra={"order_id": order_id})
            return res.data[0]

        return None

    except Exception:
        logger.error("Error updating order", exc_info=True)
        return None




async def create_order_items(items: list[dict]):
    try:
        res = supabase.table("order_items").insert(items).execute()

        if res.data:
            logger.info("Order items created", extra={
                "count": len(res.data)
            })
            return res.data

        return None

    except Exception:
        logger.error("Error creating order items", exc_info=True)
        return None


async def update_order_by_token(token: str, new_data: dict):
    try:
        current_order = supabase.table("orders") \
            .select("id, status") \
            .eq("flow_token", token) \
            .maybe_single() \
            .execute()

        if not current_order.data:
            logger.error("Order not found", extra={"token": token})
            return None

        current_status = current_order.data.get("status")

        if current_status == "paid":
            logger.info("Order already paid, skipping update", extra={"token": token})
            return current_order.data

        res = supabase.table("orders") \
            .update(new_data) \
            .eq("flow_token", token) \
            .execute()

        if res.data:
            logger.info("Order updated by token", extra={
                "token": token,
                "status": new_data.get("status")
            })
            return res.data[0]

        return None

    except Exception:
        logger.error("Critical error updating order by token", exc_info=True)
        return None
    

async def get_order_items_by_order_id(order_id: str):
    try:
        res = supabase.table("order_items") \
            .select("""
                id,
                quantity,
                price,
                products (
                    id,
                    name,
                    image
                )
            """) \
            .eq("order_id", order_id) \
            .execute()

        return res.data or []

    except Exception:
        logger.error("Error fetching order items", exc_info=True)
        return None