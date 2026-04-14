"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { startPayment } from "./actions";
import { Loader2, CreditCard } from "lucide-react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const ARICA_BOUNDS = {
  north: -18.42,
  south: -18.53,
  east: -70.26,
  west: -70.35,
};

const libraries: ("places")[] = ["places"];
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const initialState = {
  url: null,
  error: null,
};

export default function CheckoutForm({ product }: { product: any }) {
  const [address, setAddress] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "standard">("standard");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  const [state, formAction, isPending] = useActionState(startPayment as any, initialState);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkout_idempotency", idempotencyKey.current);
    }
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  return (
    <form action={formAction} className="space-y-6">

      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey.current} />
      <input type="hidden" name="shippingMethod" value={shippingMethod} />
      <input type="hidden" name="acceptedTerms" value={acceptedTerms ? "true" : "false"} />
      <input type="hidden" name="address" value={shippingMethod === "pickup" ? "" : address} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Cantidad
          </label>
          <input
            name="quantity"
            type="number"
            min="1"
            max="10"
            defaultValue="1"
            required
            className="w-full border border-[#E6B9B3] p-3 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full border border-[#E6B9B3] p-3 rounded-xl"
          />
        </div>

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
          className="w-full border border-[#E6B9B3] p-3 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
          Método de entrega
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShippingMethod("standard")}
            className={`flex-1 p-3 rounded-xl border ${
              shippingMethod === "standard"
                ? "border-[#FFA195] bg-[#FFF1EF]"
                : "border-[#E6B9B3]"
            }`}
          >
            🚚 Envío
          </button>

          <button
            type="button"
            onClick={() => setShippingMethod("pickup")}
            className={`flex-1 p-3 rounded-xl border ${
              shippingMethod === "pickup"
                ? "border-[#FFA195] bg-[#FFF1EF]"
                : "border-[#E6B9B3]"
            }`}
          >
            🏪 Retiro
          </button>
        </div>
      </div>

      {shippingMethod === "standard" && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#756C64] ml-1">
            Dirección (Arica)
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle y número..."
                className="w-full border border-[#E6B9B3] p-3 rounded-xl"
              />
            </Autocomplete>
          ) : (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 w-4 h-4"
          required
        />
        <label className="text-sm text-[#756C64]">
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

      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600 text-center">
            {state.error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !acceptedTerms}
        className="w-full bg-[#756C64] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirigiendo...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar con Flow
          </>
        )}
      </button>
    </form>
  );
}