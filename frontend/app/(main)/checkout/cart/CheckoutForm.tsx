"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Loader2, CreditCard, Truck, User, 
  MapPin, Phone, Mail, Building2, Binary 
} from "lucide-react";
import { formatCLP } from "@/lib/format";

type Region = "arica" | "santiago";

interface CheckoutFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  total: number;
  region: Region;
  setRegion: (region: Region) => void;
}

export function CheckoutForm({
  onSubmit,
  total,
  region,
  setRegion,
}: CheckoutFormProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    formData.set("region", region);
    formData.set("acceptedTerms", "true");

    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLocalSubmit}
      className="bg-white p-6 rounded-3xl border border-[#E6B9B3] space-y-6 shadow-sm max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-[#756C64] border-b border-gray-100 pb-2">
          Datos de Identificación
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="name"
              required
              placeholder="Nombre completo"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-[14px] text-[10px] font-black text-gray-400">RUT</span>
            <input
              name="rut"
              required
              placeholder="ej: 12345678-9"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="phone"
              type="tel"
              required
              placeholder="+56912345678"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-[#756C64] border-b border-gray-100 pb-2">
          Dirección de Envío
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="street"
              required
              placeholder="Calle / Avenida"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>
          
          <div className="relative">
            <Binary className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="number"
              required
              placeholder="N°"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>

          <div className="md:col-span-3 relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="comuna"
              required
              placeholder="Comuna"
              className="w-full pl-11 border border-[#E6B9B3] p-3 rounded-xl focus:ring-2 focus:ring-[#FFA195] outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase text-[#756C64] block text-center">
          Región de Despacho
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setRegion("arica")}
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-1 transition ${
              region === "arica"
                ? "border-[#FFA195] bg-[#FFF1EF] shadow-inner"
                : "border-[#E6B9B3] hover:bg-gray-50"
            }`}
          >
            <span className={`text-sm font-bold ${region === "arica" ? "text-[#756C64]" : "text-gray-400"}`}>Arica</span>
            <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Envío Gratis</span>
          </button>

          <button
            type="button"
            onClick={() => setRegion("santiago")}
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-1 transition ${
              region === "santiago"
                ? "border-[#FFA195] bg-[#FFF1EF] shadow-inner"
                : "border-[#E6B9B3] hover:bg-gray-50"
            }`}
          >
            <span className={`text-sm font-bold ${region === "santiago" ? "text-[#756C64]" : "text-gray-400"}`}>Santiago</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">+ $6.000</span>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
        <input
          id="terms"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#756C64]"
          required
        />
        <label htmlFor="terms" className="text-xs text-[#756C64] leading-tight">
          Acepto los{" "}
          <Link href="/terminos" target="_blank" className="font-bold underline decoration-[#E6B9B3]">
            términos
          </Link>{" "}
          y las políticas de{" "}
          <Link href="/privacidad" target="_blank" className="font-bold underline decoration-[#E6B9B3]">
            privacidad
          </Link>
        </label>
      </div>

      <button
        disabled={loading || !acceptedTerms}
        className="w-full bg-[#756C64] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-[#5e5650] transition-all shadow-md active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pagar {formatCLP(total)}
          </>
        )}
      </button>
      
      <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
        <Truck size={12} /> Despacho seguro a todo Chile
      </p>
    </form>
  );
}