"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { startPayment } from "./actions";
import { 
  Loader2, CreditCard, Mail, Phone, Truck, 
  Store, MapPin, Hash, ShieldCheck, ChevronRight,
  Info, CheckCircle2
} from "lucide-react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { formatCLP } from "@/lib/format"; 

const ARICA_BOUNDS = { north: -18.42, south: -18.53, east: -70.26, west: -70.35 };
const libraries: ("places")[] = ["places"];
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const initialState = { url: null, error: null };

export default function CheckoutForm({ product }: { product: any }) {
  const [address, setAddress] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "standard">("standard");
  const [quantity, setQuantity] = useState(1);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  const [state, formAction, isPending] = useActionState(startPayment as any, initialState);

  const FREE_SHIPPING_THRESHOLD = 20000;
  const SHIPPING_COST = 3000;
  const subtotal = product.price * quantity;
  const hasFreeShipping = shippingMethod === "pickup" || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCostFinal = shippingMethod === "pickup" ? 0 : hasFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCostFinal;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  useEffect(() => {
    if (state?.url) {
      localStorage.removeItem("checkout_idempotency");
      window.location.href = state.url;
    }
  }, [state?.url]);

  const idempotencyKey = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("checkout_idempotency") || crypto.randomUUID()
      : ""
  );

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey.current} />
      <input type="hidden" name="shippingMethod" value={shippingMethod} />
      <input type="hidden" name="acceptedTerms" value={acceptedTerms ? "true" : "false"} />
      <input type="hidden" name="address" value={shippingMethod === "pickup" ? "" : address} />
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#756C64] flex items-center gap-2">
          <Hash className="w-4 h-4" /> 1. Datos de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-[#A7B39B] uppercase z-10">Cantidad</label>
            <input name="quantity" type="number" min="1" max="10" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required className="w-full bg-white border border-[#E6B9B3] p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#E6B9B3]/50 transition-all text-[#756C64] font-medium" />
          </div>
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-[#A7B39B] uppercase z-10">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-[#E6B9B3]" />
              <input name="email" type="email" required placeholder="tu@email.com" className="w-full bg-white border border-[#E6B9B3] p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-[#E6B9B3]/50 transition-all text-[#756C64]" />
            </div>
          </div>
        </div>
        <div className="relative group">
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-[#A7B39B] uppercase z-10">Teléfono</label>
          <div className="relative flex items-center">
            <Phone className="absolute left-4 w-4 h-4 text-[#E6B9B3]" />
            <input name="phone" type="tel" required placeholder="+56 9 1234 5678" className="w-full bg-white border border-[#E6B9B3] p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-[#E6B9B3]/50 transition-all text-[#756C64]" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#756C64] flex items-center gap-2">
          <Truck className="w-4 h-4" /> 2. Método de Entrega
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setShippingMethod("standard")} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${shippingMethod === "standard" ? "border-[#E6B9B3] bg-[#F8F4ED]" : "border-gray-100 bg-white"}`}>
            <Truck className={`w-6 h-6 ${shippingMethod === "standard" ? "text-[#756C64]" : "text-gray-300"}`} />
            <span className="text-[10px] font-bold">DOMICILIO</span>
          </button>
          <button type="button" onClick={() => setShippingMethod("pickup")} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${shippingMethod === "pickup" ? "border-[#E6B9B3] bg-[#F8F4ED]" : "border-gray-100 bg-white"}`}>
            <Store className={`w-6 h-6 ${shippingMethod === "pickup" ? "text-[#756C64]" : "text-gray-300"}`} />
            <span className="text-[10px] font-bold">RETIRO</span>
          </button>
        </div>

        {shippingMethod === "standard" && (
          <div className="relative animate-in fade-in slide-in-from-top-2">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-[#A7B39B] uppercase z-10">Dirección en Arica</label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 w-4 h-4 text-[#E6B9B3]" />
              {isLoaded ? (
                <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged} className="w-full" options={{ bounds: ARICA_BOUNDS, strictBounds: true, componentRestrictions: { country: "cl" } }}>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle y número..." className="w-full bg-white border border-[#E6B9B3] p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-[#E6B9B3]/50 transition-all text-[#756C64]" />
                </Autocomplete>
              ) : (
                <div className="w-full h-[54px] bg-gray-50 rounded-2xl animate-pulse" />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#756C64] flex items-center gap-2">
          <Info className="w-4 h-4" /> 3. Resumen de Pago
        </h3>
        
        <div className="bg-[#F8F4ED]/50 border border-[#E6B9B3]/30 rounded-3xl p-6 space-y-5">
          {shippingMethod === "standard" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#A7B39B] uppercase tracking-tighter">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? "¡Envío Gratis Activado!" : "Envío Gratis"}
                </span>
                <span className="text-gray-400">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? "🎉" : `Faltan ${formatCLP(remainingForFreeShipping)}`}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#E6B9B3]/20">
                <div 
                  className={`h-full transition-all duration-500 ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-green-500' : 'bg-[#A7B39B]'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm text-[#756C64]">
              <span>Subtotal ({quantity} {quantity === 1 ? 'unidad' : 'unidades'})</span>
              <span className="font-semibold">{formatCLP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#756C64]">
              <span className="flex items-center gap-1">
                {shippingMethod === "standard" ? <Truck className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                {shippingMethod === "standard" ? "Envío a domicilio" : "Retiro en Agustín Edwards 1961"}
              </span>
              <span className={hasFreeShipping ? "text-green-600 font-bold" : "font-semibold"}>
                {hasFreeShipping ? "Gratis" : formatCLP(SHIPPING_COST)}
              </span>
            </div>
            
            <div className="border-t border-[#E6B9B3]/40 pt-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-[#A7B39B] uppercase tracking-widest">Total Final</p>
                <p className="text-3xl font-black text-[#756C64] leading-none tracking-tighter mt-1">
                  {formatCLP(total)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  PRECIO FINAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-3 px-2">
          <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#A7B39B]" required />
        <label htmlFor="terms" className="text-sm text-[#756C64]">
          Acepto los{" "}
          <a href="/terminos" target="_blank" className="underline">
            términos y condiciones
          </a>{" "}
          y la{" "}
          <a href="/privacidad" target="_blank" className="underline">
            política de privacidad
          </a>
        </label>
        </div>

        <button
          type="submit"
          disabled={isPending || !acceptedTerms}
          className="group relative w-full bg-[#756C64] hover:bg-[#5e5650] disabled:bg-gray-200 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-[#756C64]/20 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>PAGAR AHORA · {formatCLP(total)}</span>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>

        <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
           <ShieldCheck className="w-4 h-4" />
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Secure Checkout by Flow</span>
        </div>
      </div>
    </form>
  );
}