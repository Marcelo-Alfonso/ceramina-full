"use server";

import { createClient } from "@/lib/supabase/server";

const EXTERNAL_API_URL = process.env.PAYMENT_API_URL;

export async function startPayment(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email")?.toString().trim();
  const name = formData.get("name")?.toString().trim();
  const rut = formData.get("rut")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const street = formData.get("street")?.toString().trim();
  const number = formData.get("number")?.toString().trim();
  const comuna = formData.get("comuna")?.toString().trim();
  const region = formData.get("region")?.toString();
  
  const productId = Number(formData.get("productId"));
  const rawQuantity = Number(formData.get("quantity"));
  const idempotencyKey = formData.get("idempotencyKey")?.toString();
  const acceptedTerms = formData.get("acceptedTerms") === "true";

  if (!name || name.length < 3) {
    return { error: "El nombre es demasiado corto" };
  }

  const rutRegex = /^[0-9]{1,2}(\.?[0-9]{3}){2}-?[0-9kK]{1}$/;
  if (!rut || !rutRegex.test(rut)) {
    return { error: "RUT inválido (ej: 12345678-9)" };
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email inválido" };
  }

  if (!phone || !/^(\+?56)?9\d{8}$/.test(phone.replace(/\s/g, ""))) {
    return { error: "Teléfono inválido (ej: +56912345678)" };
  }

  if (!street || !number || !comuna) {
    return { error: "Faltan datos en la dirección (Calle, Número o Comuna)" };
  }

  if (!region || !["arica", "santiago"].includes(region)) {
    return { error: "Región de envío no válida" };
  }

  if (!acceptedTerms) {
    return { error: "Debes aceptar los términos y privacidad" };
  }

  const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 && rawQuantity <= 10
      ? rawQuantity
      : 1;

  if (!productId || productId <= 0) {
    return { error: "Producto inválido" };
  }

  if (!idempotencyKey) {
    return { error: "Error de sesión: falta llave de idempotencia" };
  }

  const { data: product, error: dbError } = await supabase
    .from("products")
    .select("id, price")
    .eq("id", productId)
    .single();

  if (dbError || !product) {
    return { error: "El producto ya no está disponible" };
  }

  const fullAddress = `${street} ${number}, ${comuna}. Región: ${region}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${EXTERNAL_API_URL}/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.INTERNAL_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        name,
        rut,
        phone,
        address: fullAddress,
        region,
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
      return { error: "La pasarela de pago tiene problemas. Intenta más tarde." };
    }

    const data = await res.json();

    if (!data.url) {
      return { error: "No se pudo generar el enlace de pago" };
    }

    return { url: data.url };

  } catch (err: any) {
    if (err.name === "AbortError") {
      return { error: "La conexión tardó demasiado. Revisa tu internet." };
    }
    console.error("Payment Action Exception:", err);
    return { error: "Error inesperado al procesar el pago" };
  }
}