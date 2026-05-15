from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Literal, Optional
import uuid
import re


class CartItem(BaseModel):
    productId: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0, le=10)


class CreatePaymentRequest(BaseModel):
    email: EmailStr
    
    name: str = Field(
        ..., 
        min_length=3, 
        max_length=100, 
        description="Nombre completo del cliente"
    )
    
    rut: str = Field(
        ..., 
        min_length=7, 
        max_length=15, 
        description="RUT del cliente (ej: 12345678-9)"
    )

    address: str = Field(
        ..., 
        min_length=5, 
        max_length=255, 
        description="Dirección completa (Calle, número y comuna)"
    )

    phone: str = Field(
        ...,
        description="Número de teléfono móvil"
    )

    region: Literal["arica", "santiago"] = Field(
        ..., 
        description="Región de destino para el cálculo de envío"
    )

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
        description="UUID para evitar pagos duplicados"
    )


    @field_validator("rut")
    @classmethod
    def validate_rut(cls, value: str):
        value = value.strip().replace(".", "")
        pattern = r"^[0-9]{7,8}-?[0-9kK]{1}$"
        if not re.match(pattern, value):
            raise ValueError("Formato de RUT inválido (ej: 12345678-9)")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str):
        clean_phone = value.replace(" ", "").strip()
        pattern = r"^\+?56?9\d{8}$"
        if not re.match(pattern, clean_phone):
            raise ValueError("Teléfono inválido. Use formato +56912345678")
        return clean_phone

    @field_validator("idempotencyKey")
    @classmethod
    def validate_uuid(cls, value: str):
        try:
            uuid.UUID(value)
        except ValueError:
            raise ValueError("idempotencyKey debe ser un UUID válido")
        return value

    @field_validator("acceptedTerms")
    @classmethod
    def validate_terms(cls, value: bool):
        if value is not True:
            raise ValueError("Debes aceptar los términos y condiciones")
        return value

    @field_validator("address", "name")
    @classmethod
    def clean_text(cls, value: str):
        return value.strip()


class CreatePaymentResponse(BaseModel):
    url: str = Field(..., min_length=1)