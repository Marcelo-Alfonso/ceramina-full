"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { OrderSummary } from "./OrderSummary";
import { CheckoutForm } from "./CheckoutForm";
import { startCartPayment } from "./actions";
import { CartItem } from "@/types/cart";

type Region = "arica" | "santiago";

export default function CheckoutCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [region, setRegion] = useState<Region>("arica");
  const [error, setError] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    
    const existing = localStorage.getItem("checkout_idempotency");
    if (existing) {
      setIdempotencyKey(existing);
    } else {
      const newKey = crypto.randomUUID();
      localStorage.setItem("checkout_idempotency", newKey);
      setIdempotencyKey(newKey);
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const shippingCost = (region === "arica") ? 0 : 6000;
  const total = subtotal + shippingCost;

  const handlePayment = async (formData: FormData) => {
    setError("");

    const fullAddress = `${formData.get("street")} ${formData.get("number")}, ${formData.get("comuna")}`;

    const res = await startCartPayment({
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      rut: formData.get("rut") as string,
      phone: formData.get("phone") as string,
      address: fullAddress,
      region: region,
      items: cart,
      idempotencyKey,
      acceptedTerms: formData.get("acceptedTerms") === "true",
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

  if (cart.length === 0) return <div className="p-20 text-center">Tu carrito está vacío</div>;

  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-20 pt-24 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Link href="/cart" className="flex items-center text-[#756C64] text-sm hover:opacity-70">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>

          <h1 className="text-3xl font-serif text-[#756C64]">Finalizar Compra</h1>

          <CheckoutForm
            onSubmit={handlePayment}
            total={total}
            region={region}
            setRegion={setRegion}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <OrderSummary 
            cart={cart} 
            shippingCost={shippingCost} 
            region={region}
          />
        </div>
      </div>
    </div>
  );
}