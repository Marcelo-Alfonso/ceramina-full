"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { startPayment } from "./actions";
import {
  Loader2, CreditCard, Mail, Phone,
  Truck, MapPin, User,
  ShieldCheck, ChevronRight, ShoppingBag, Building2, Binary
} from "lucide-react";
import { formatCLP } from "@/lib/format";

const initialState = { url: null, error: null };

export default function CheckoutForm({ product }: { product: any }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [region, setRegion] = useState<"arica" | "santiago">("arica");
  const [quantity, setQuantity] = useState(1);

  const [state, formAction, isPending] = useActionState(startPayment as any, initialState);

  const SHIPPING_ARICA = 0;
  const SHIPPING_SANTIAGO = 6000;

  const subtotal = product.price * quantity;
  const shippingCost = region === "arica" ? SHIPPING_ARICA : SHIPPING_SANTIAGO;
  const total = subtotal + shippingCost;

  const idempotencyKey = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("checkout_idempotency") || crypto.randomUUID()
      : ""
  );

  useEffect(() => {
    if (state?.url) {
      localStorage.removeItem("checkout_idempotency");
      window.location.href = state.url;
    }
  }, [state?.url]);

  return (
    <form action={formAction} className="max-w-2xl mx-auto space-y-8 bg-white p-2 md:p-6 rounded-3xl">
      
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey.current} />
      <input type="hidden" name="region" value={region} />
      <input type="hidden" name="acceptedTerms" value={acceptedTerms ? "true" : "false"} />

      <div className="bg-[#F8F4ED] p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#756C64] w-5 h-5" />
            <span className="font-medium text-[#756C64]">Cantidad</span>
        </div>
        <input 
            name="quantity" 
            type="number" 
            min="1" 
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 bg-white border-none rounded-xl text-center font-bold text-[#756C64] focus:ring-2 focus:ring-[#E6B9B3]" 
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <User className="w-4 h-4 text-[#756C64]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#756C64]">Identificación</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="name" required placeholder="Nombre completo" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-[13px] text-[10px] font-black text-gray-400 leading-none">RUT</span>
            <input name="rut" required placeholder="ej: 12345678-9" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="email" type="email" required placeholder="Email" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="phone" required placeholder="Teléfono" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Truck className="w-4 h-4 text-[#756C64]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#756C64]">Despacho</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="street" required placeholder="Calle / Av. Principal" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>
          
          <div className="relative">
            <Binary className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="number" required placeholder="N°" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>

          <div className="relative md:col-span-3">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input name="comuna" required placeholder="Comuna" className="input pl-11 w-full py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#E6B9B3] transition-all" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-[#756C64] tracking-widest text-center">Selecciona tu Región</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRegion("arica")}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              region === "arica" ? "border-[#E6B9B3] bg-[#F8F4ED]" : "border-gray-100 bg-white"
            }`}
          >
            <span className={`font-bold ${region === "arica" ? "text-[#756C64]" : "text-gray-500"}`}>Arica</span>
            <span className="text-xs text-green-600 font-medium font-mono tracking-tighter">GRATIS</span>
          </button>

          <button
            type="button"
            onClick={() => setRegion("santiago")}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              region === "santiago" ? "border-[#E6B9B3] bg-[#F8F4ED]" : "border-gray-100 bg-white"
            }`}
          >
            <span className={`font-bold ${region === "santiago" ? "text-[#756C64]" : "text-gray-500"}`}>Santiago</span>
            <span className="text-xs text-gray-500 font-medium font-mono tracking-tighter">+$6.000</span>
          </button>
        </div>
      </div>

      <div className="bg-[#756C64] text-white p-6 rounded-2xl shadow-lg space-y-3">
        <div className="flex justify-between opacity-80 text-sm">
          <span>Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        <div className="flex justify-between opacity-80 text-sm">
          <span>Envío</span>
          <span>{shippingCost === 0 ? "Gratis" : formatCLP(shippingCost)}</span>
        </div>
        <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>{formatCLP(total)}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 px-2">
        <input
          id="terms"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          required
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#756C64] focus:ring-[#E6B9B3]"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
          Acepto los{" "}
          <Link href="/terminos" target="_blank" className="text-[#756C64] font-bold underline decoration-[#E6B9B3] underline-offset-4">
            términos
          </Link>{" "}
          y las políticas de{" "}
          <Link href="/privacidad" target="_blank" className="text-[#756C64] font-bold underline decoration-[#E6B9B3] underline-offset-4">
            privacidad
          </Link>
        </label>
      </div>

      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-medium">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !acceptedTerms}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all ${
          isPending || !acceptedTerms
            ? "bg-gray-200 text-gray-400"
            : "bg-[#756C64] text-white hover:bg-[#5e5650] active:scale-[0.98]"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Pagar {formatCLP(total)}
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
        <ShieldCheck className="w-3 h-3 text-green-600" />
        Pago seguro con Flow
      </p>
    </form>
  );
}