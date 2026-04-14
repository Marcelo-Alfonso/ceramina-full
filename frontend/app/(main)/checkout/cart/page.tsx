"use client";

import { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { OrderSummary } from "./OrderSummary";
import { CheckoutForm } from "./CheckoutForm";
import { startCartPayment } from "./actions";
import { CartItem } from "@/types/cart";

const libraries: ("places")[] = ["places"];
type ShippingMethod = "pickup" | "standard";

export default function CheckoutCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [error, setError] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const existing = localStorage.getItem("checkout_idempotency");

    if (existing) {
      setIdempotencyKey(existing);
    } else {
      const newKey = crypto.randomUUID();
      localStorage.setItem("checkout_idempotency", newKey);
      setIdempotencyKey(newKey);
    }
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCost = shippingMethod === "pickup" ? 0 : 3000;

  const handlePayment = async (
    formData: FormData,
    address: string,
    method: ShippingMethod
  ) => {
    setError("");

    const acceptedTerms = formData.get("acceptedTerms") === "true";

    const res = await startCartPayment({
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: method === "pickup" ? null : address,
      shippingMethod: method,
      cart,
      idempotencyKey,
      acceptedTerms,
    });

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.url) {
      localStorage.removeItem("cart");
      localStorage.removeItem("checkout_idempotency");
      window.location.href = res.url;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#756C64]">
        Tu carrito está vacío
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-20 pt-24 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-7 space-y-6">
          <Link
            href="/cart"
            className="flex items-center text-[#756C64] text-sm hover:opacity-70"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Link>

          <h1 className="text-3xl font-serif text-[#756C64]">
            Finalizar Compra
          </h1>

          <CheckoutForm
            isLoaded={isLoaded}
            onSubmit={handlePayment}
            total={subtotal + shippingCost}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <OrderSummary cart={cart} shippingCost={shippingCost} />
        </div>
      </div>
    </div>
  );
}