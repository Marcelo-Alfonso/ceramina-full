from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Literal, Optional
import uuid
import re


class CartItem(BaseModel):
    productId: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0, le=10)


class CreatePaymentRequest(BaseModel):
    email: EmailStr

    address: Optional[str] = Field(
        None,
        min_length=5,
        max_length=255,
        description="Dirección de envío"
    )

    phone: str = Field(
        ...,
        min_length=8,
        max_length=20,
        description="Número de teléfono"
    )

    shippingMethod: Literal["pickup", "standard"]

    acceptedTerms: bool = Field(
        ...,
        description="Aceptación de términos y condiciones"
    )

    items: List[CartItem] = Field(
        ...,
        min_length=1,
        description="Lista de productos"
    )

    idempotencyKey: str = Field(
        ...,
        min_length=10,
        max_length=100,
        description="UUID para evitar duplicados"
    )


    @field_validator("address")
    @classmethod
    def clean_address(cls, value):
        if value is None:
            return value

        value = value.strip()
        return value if value else None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str):
        value = value.strip()

        pattern = r"^\+?56?9\d{8}$"

        if not re.match(pattern, value):
            raise ValueError("Número de teléfono inválido (ej: +56912345678)")

        return value

    @field_validator("idempotencyKey")
    @classmethod
    def validate_uuid(cls, value: str):
        try:
            uuid.UUID(value)
        except ValueError:
            raise ValueError("idempotencyKey inválido")

        return value

    @field_validator("items")
    @classmethod
    def validate_items(cls, items):
        if not items:
            raise ValueError("Debe haber al menos un producto")
        return items

    @field_validator("acceptedTerms")
    @classmethod
    def validate_terms(cls, value: bool):
        if value is not True:
            raise ValueError("Debes aceptar los términos y condiciones")
        return value

    @field_validator("address")
    @classmethod
    def validate_address_logic(cls, value, info):
        shipping_method = info.data.get("shippingMethod")

        if shipping_method == "standard":
            if not value:
                raise ValueError("La dirección es obligatoria para envío")


        if shipping_method == "pickup":
            return None 

        return value


class CreatePaymentResponse(BaseModel):
    url: str = Field(..., min_length=1)