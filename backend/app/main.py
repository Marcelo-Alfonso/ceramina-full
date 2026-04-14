from fastapi import FastAPI
from app.routers.payment import router as payment_router
from app.routers.webhook import router as webhook_router
from app.routers.order import router as order_router
from app.routers.health import router as health_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router)

app.include_router(payment_router)

app.include_router(order_router)

app.include_router(health_router)