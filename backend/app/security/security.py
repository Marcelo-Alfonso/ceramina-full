from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings


api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if not api_key or api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")