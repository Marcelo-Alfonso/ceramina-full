"use server";

import { CartItem } from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function startCartPayment({
  email,
  phone,
  address,
  shippingMethod,
  cart,
  idempotencyKey,
  acceptedTerms,
}: {
  email: string;
  phone: string;
  address: string | null;
  shippingMethod: "pickup" | "standard";
  cart: CartItem[];
  idempotencyKey: string;
  acceptedTerms: boolean;
}) {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email inválido" };
  }

  if (!phone || !/^\+?56?9\d{8}$/.test(phone)) {
    return { error: "Teléfono inválido (ej: +56912345678)" };
  }

  if (!["pickup", "standard"].includes(shippingMethod)) {
    return { error: "Método de envío inválido" };
  }

  if (!acceptedTerms) {
    return { error: "Debes aceptar los términos y condiciones" };
  }
  let finalAddress: string | null = null;

  if (shippingMethod === "standard") {
    if (!address || address.trim().length < 5) {
      return { error: "Dirección inválida" };
    }

    finalAddress = address.trim();
  }

  if (!cart || cart.length === 0) {
    return { error: "Carrito vacío" };
  }

  for (const item of cart) {
    if (!item.id || item.id <= 0) {
      return { error: "Producto inválido en carrito" };
    }

    if (!item.quantity || item.quantity <= 0 || item.quantity > 10) {
      return { error: "Cantidad inválida en carrito" };
    }
  }

  if (!idempotencyKey) {
    return { error: "Error interno (idempotency)" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_URL}/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.INTERNAL_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        phone,
        address: finalAddress,
        shippingMethod,
        acceptedTerms,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        idempotencyKey,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Cart payment error:", err);

      return {
        error: "La pasarela de pago no respondió correctamente",
      };
    }

    const data = await res.json();

    if (!data?.url) {
      return { error: "No se pudo generar el pago" };
    }

    return { url: data.url };

  } catch (err: any) {
    if (err.name === "AbortError") {
      return { error: "La conexión tardó demasiado. Intenta nuevamente." };
    }

    console.error("Cart payment exception:", err);
    return { error: "Error inesperado" };
  }
}