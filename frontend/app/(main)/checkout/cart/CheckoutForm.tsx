"use client";

import { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Loader2, CreditCard, Truck, Store } from "lucide-react";
import { formatCLP } from "@/lib/format";

const ARICA_BOUNDS = {
  north: -18.42,
  south: -18.53,
  east: -70.26,
  west: -70.35,
};

type ShippingMethod = "pickup" | "standard";

interface CheckoutFormProps {
  onSubmit: (formData: FormData, address: string, method: ShippingMethod) => Promise<void>;
  isLoaded: boolean;
  total: number;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
}

export function CheckoutForm({
  onSubmit,
  isLoaded,
  total,
  shippingMethod,
  setShippingMethod,
}: CheckoutFormProps) {
  const [address, setAddress] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) return;

    if (shippingMethod === "standard" && !address) {
      alert("Debes ingresar una dirección válida en Arica");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    formData.set("shippingMethod", shippingMethod);
    formData.set("address", address);
    formData.set("acceptedTerms", acceptedTerms ? "true" : "false");

    await onSubmit(formData, address, shippingMethod);

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLocalSubmit}
      className="bg-white p-6 rounded-3xl border border-[#E6B9B3] space-y-6 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Teléfono
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="+56912345678"
            className="w-full border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
          Método de entrega
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShippingMethod("standard")}
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              shippingMethod === "standard"
                ? "border-[#FFA195] bg-[#FFF1EF]"
                : "border-[#E6B9B3]"
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-sm font-bold">Envío</span>
          </button>

          <button
            type="button"
            onClick={() => setShippingMethod("pickup")}
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              shippingMethod === "pickup"
                ? "border-[#FFA195] bg-[#FFF1EF]"
                : "border-[#E6B9B3]"
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-sm font-bold">Retiro</span>
          </button>
        </div>
      </div>

      {shippingMethod === "standard" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Dirección (Arica Urbano)
          </label>

          {isLoaded ? (
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={onPlaceChanged}
              options={{
                bounds: ARICA_BOUNDS,
                strictBounds: true,
                componentRestrictions: { country: "cl" },
              }}
            >
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle y número..."
                className="w-full border border-[#E6B9B3] p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FFA195]"
              />
            </Autocomplete>
          ) : (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          )}
        </div>
      )}

      {shippingMethod === "pickup" && (
        <p className="text-sm text-[#756C64] bg-[#F8F4ED] p-3 rounded-xl">
          Retiro en: <strong>Agustín Edwards 1961</strong>
        </p>
      )}

      <div className="flex items-start gap-3">
      <input
        id="terms"
        name="acceptedTerms"
        type="checkbox"
        value="true"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        className="mt-1 w-4 h-4"
        required
      />

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
        disabled={loading || !acceptedTerms}
        className="w-full bg-[#756C64] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard />
            Pagar {formatCLP(total)}
          </>
        )}
      </button>
    </form>
  );
}