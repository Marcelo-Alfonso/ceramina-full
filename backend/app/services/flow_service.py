import hashlib
import hmac
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


def sign_params(params: dict) -> str:
    filtered = {k: v for k, v in params.items() if v is not None}

    sorted_items = sorted(filtered.items())
    to_sign = "&".join(f"{k}={v}" for k, v in sorted_items)

    signature = hmac.new(
        settings.flow_secret_key.encode(),
        to_sign.encode(),
        hashlib.sha256
    ).hexdigest()

    return signature

def validate_webhook_signature(params: dict, received_signature: str) -> bool:
    expected_signature = sign_params(params)

    return hmac.compare_digest(expected_signature, received_signature)


async def create_flow_payment(params: dict):
    try:
        params["s"] = sign_params(params)

        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"{settings.flow_base_url}/payment/create",
                data=params
            )

        if res.status_code != 200:
            logger.error("Flow create payment failed", extra={
                "status_code": res.status_code,
                "response": res.text
            })
            raise Exception("Error creating Flow payment")

        data = res.json()

        logger.info("Flow payment created", extra={
            "token": data.get("token"),
            "flow_order": data.get("flowOrder")
        })

        return data

    except Exception:
        logger.error("Exception in create_flow_payment", exc_info=True)
        raise


async def get_flow_status(token: str):
    try:
        params = {
            "apiKey": settings.flow_api_key,
            "token": token,
        }

        params["s"] = sign_params(params)

        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{settings.flow_base_url}/payment/getStatus",
                params=params
            )

        if res.status_code != 200:
            logger.error("Flow status failed", extra={
                "status_code": res.status_code,
                "response": res.text
            })
            raise Exception("Error getting Flow status")

        data = res.json()

        logger.info("Flow status retrieved", extra={
            "token": token,
            "status": data.get("status")
        })

        return data

    except Exception:
        logger.error("Exception in get_flow_status", exc_info=True)
        raise