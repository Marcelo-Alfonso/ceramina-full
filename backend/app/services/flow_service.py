import hashlib
import hmac
import httpx
import logging
from app.core.config import settings
from app.core.logging import mask_secret
import urllib.parse

logger = logging.getLogger(__name__)



def sign_params(params: dict, is_webhook: bool = False) -> str:
    filtered = {k: v for k, v in params.items() if v is not None}

    sorted_keys = sorted(filtered.keys())
    
    if is_webhook:

        to_sign = "".join(f"{k}{urllib.parse.unquote_plus(str(filtered[k]))}" for k in sorted_keys)
    else:
        to_sign = "&".join(f"{k}={filtered[k]}" for k in sorted_keys)

    signature = hmac.new(
        settings.flow_secret_key.encode(),
        to_sign.encode(),
        hashlib.sha256
    ).hexdigest()

    return signature

def validate_webhook_signature(params: dict, received_signature: str) -> bool:
    expected_signature = sign_params(params, is_webhook=True)
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
            "token": mask_secret(data.get("token") or ""),
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
            "token": mask_secret(token),
            "status": data.get("status")
        })

        return data

    except Exception:
        logger.error("Exception in get_flow_status", exc_info=True)
        raise