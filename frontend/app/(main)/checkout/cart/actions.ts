"use server";

import { CartItem } from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function startCartPayment({
  name,
  rut,
  email,
  phone,
  address,
  region,
  items,
  idempotencyKey,
  acceptedTerms,
}: {
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  region: "arica" | "santiago";
  items: CartItem[];
  idempotencyKey: string;
  acceptedTerms: boolean;
}) {
  if (!name || name.trim().length < 3) {
    return { error: "El nombre es demasiado corto" };
  }

  if (!rut || !/^[0-9]{7,8}-?[0-9kK]{1}$/.test(rut.replace(/\./g, ""))) {
    return { error: "RUT inválido (ej: 12345678-9)" };
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email inválido" };
  }

  if (!phone || !/^\+?56?9\d{8}$/.test(phone.replace(/\s/g, ""))) {
    return { error: "Teléfono inválido (ej: +56912345678)" };
  }

  if (!address || address.trim().length < 5) {
    return { error: "La dirección es obligatoria y debe ser válida" };
  }

  if (!["arica", "santiago"].includes(region)) {
    return { error: "Región de envío no válida" };
  }

  if (!acceptedTerms) {
    return { error: "Debes aceptar los términos y condiciones" };
  }

  if (!items || items.length === 0) {
    return { error: "El carrito está vacío" };
  }

  const formattedItems = items.map((item) => ({
    productId: Number(item.id),
    quantity: Math.min(Math.max(item.quantity, 1), 10),
  }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${API_URL}/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.INTERNAL_API_KEY || "",
      },
      body: JSON.stringify({
        name: name.trim(),
        rut: rut.trim(),
        email: email.trim(),
        phone: phone.trim().replace(/\s/g, ""),
        address: address.trim(),
        region,
        items: formattedItems,
        idempotencyKey,
        acceptedTerms,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Backend Error:", errData);
      
      return { 
        error: errData.detail || "Error al procesar el pago. Intenta nuevamente." 
      };
    }

    const data = await res.json();

    if (!data?.url) {
      return { error: "La pasarela de pago no devolvió una URL válida" };
    }

    return { url: data.url };

  } catch (err: any) {
    if (err.name === "AbortError") {
      return { error: "La conexión tardó demasiado. Revisa tu internet." };
    }

    console.error("Fetch Exception:", err);
    return { error: "Error de conexión con el servidor" };
  }
}