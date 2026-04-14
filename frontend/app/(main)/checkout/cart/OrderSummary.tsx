import Image from "next/image";
import { formatCLP } from "@/lib/format";
import { CartItem } from "@/types/cart";


export function OrderSummary({ cart, shippingCost }: { cart: CartItem[], shippingCost: number }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3] sticky top-28 shadow-sm">
      <h2 className="font-bold text-[#756C64] mb-6 border-b pb-4">Tu Pedido</h2>
      
      <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="relative w-16 h-16 bg-[#F8F4ED] rounded-xl overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-[#756C64]">{formatCLP(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed pt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Envío</span>
          <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
            {shippingCost === 0 ? "Gratis" : formatCLP(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-[#756C64] pt-2 border-t">
          <span>Total</span>
          <span>{formatCLP(total)}</span>
        </div>
      </div>
    </div>
  );
}