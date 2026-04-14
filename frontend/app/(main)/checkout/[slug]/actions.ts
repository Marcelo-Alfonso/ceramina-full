"use server";

import { createClient } from "@/lib/supabase/server";

const EXTERNAL_API_URL = process.env.PAYMENT_API_URL;

export async function startPayment(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email")?.toString().trim();
  const address = formData.get("address")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim();
  const shippingMethod = formData.get("shippingMethod")?.toString();
  const productId = Number(formData.get("productId"));
  const rawQuantity = Number(formData.get("quantity"));
  const idempotencyKey = formData.get("idempotencyKey")?.toString();

  const acceptedTerms = formData.get("acceptedTerms") === "true";

  const quantity =
    Number.isFinite(rawQuantity) && rawQuantity > 0 && rawQuantity <= 10
      ? rawQuantity
      : 1;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email inválido" };
  }

  if (!phone || !/^\+?56?9\d{8}$/.test(phone)) {
    return { error: "Teléfono inválido (ej: +56912345678)" };
  }

  if (!shippingMethod || !["pickup", "standard"].includes(shippingMethod)) {
    return { error: "Método de envío inválido" };
  }

  if (!acceptedTerms) {
    return { error: "Debes aceptar los términos y condiciones" };
  }

  if (shippingMethod === "standard") {
    if (!address || address.length < 5) {
      return { error: "Dirección de envío inválida" };
    }
  }

  if (!idempotencyKey) {
    return { error: "Error interno: falta idempotency key" };
  }

  if (!productId || productId <= 0) {
    return { error: "Producto inválido" };
  }

  const { data: product, error: dbError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (dbError || !product) {
    return { error: "El producto ya no está disponible" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${EXTERNAL_API_URL}/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.INTERNAL_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        address,
        phone,
        shippingMethod,
        acceptedTerms,
        items: [
          {
            productId,
            quantity,
          },
        ],
        idempotencyKey,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Gateway Error:", errorData);

      return {
        error: "La pasarela de pago no responde. Intenta de nuevo.",
      };
    }

    const data = await res.json();

    if (!data.url) {
      return { error: "Error al generar la sesión de pago" };
    }

    return { url: data.url };

  } catch (err: any) {
    if (err.name === "AbortError") {
      return { error: "La conexión tardó demasiado. Revisa tu internet." };
    }

    console.error("Payment Action Exception:", err);

    return {
      error: "Ocurrió un error inesperado al procesar el pago",
    };
  }
}