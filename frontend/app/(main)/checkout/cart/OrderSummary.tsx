import Image from "next/image";
import { formatCLP } from "@/lib/format";
import { CartItem } from "@/types/cart";
import { ShoppingBag, Truck, ReceiptText } from "lucide-react";

export function OrderSummary({
  cart,
  shippingCost,
  region,
}: {
  cart: CartItem[];
  shippingCost: number;
  region: "arica" | "santiago";
}) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingCost;

  return (
    <div className="bg-white rounded-3xl border border-[#E6B9B3]/50 sticky top-28 shadow-xl shadow-[#756C64]/5 overflow-hidden">
      <div className="p-6 pb-4 flex items-center gap-2 border-b border-gray-50">
        <ShoppingBag className="w-5 h-5 text-[#756C64]" />
        <h2 className="font-bold text-[#756C64] text-lg">Tu Pedido</h2>
        <span className="ml-auto bg-[#F8F4ED] text-[#756C64] text-xs px-2.5 py-1 rounded-full font-bold">
          {cart.length}
        </span>
      </div>

      <div className="p-6">
        <div className={`mb-6 p-3 rounded-2xl flex items-center gap-3 ${
          region === "arica" ? "bg-green-50 text-green-700" : "bg-[#F8F4ED] text-[#756C64]"
        }`}>
          <Truck className="w-4 h-4" />
          <p className="text-xs font-medium">
            {region === "arica" 
              ? "Envío Gratis a Arica Urbano" 
              : "Despacho a Santiago: " + formatCLP(6000)}
          </p>
        </div>

        <div className="max-h-[35vh] overflow-y-auto pr-2 -mr-2 space-y-4 mb-6 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="group flex gap-4 items-center">
              <div className="relative w-14 h-14 bg-[#F8F4ED] rounded-2xl overflow-hidden flex-shrink-0 border border-transparent group-hover:border-[#E6B9B3] transition-colors">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#E6B9B3] transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  CANTIDAD: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-[#756C64]">
                {formatCLP(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#F8F4ED]/50 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium">{formatCLP(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Envío ({region === "arica" ? "Arica" : "Santiago"})</span>
            <span className={region === "arica" ? "text-green-600 font-bold" : "font-medium"}>
              {region === "arica" ? "Gratis" : formatCLP(6000)}
            </span>
          </div>

          <div className="pt-3 border-t border-[#E6B9B3]/30 flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total a pagar</p>
              <p className="text-2xl font-black text-[#756C64] leading-none mt-1">
                {formatCLP(total)}
              </p>
            </div>
            <ReceiptText className="w-8 h-8 text-[#E6B9B3]/40" />
          </div>
        </div>
      </div>
    </div>
  );
}