"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCLP } from "@/lib/format";
import { CartItem } from "@/types/cart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQty = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (id: number) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-full mb-6 shadow-sm border border-[#E6B9B3]/30">
          <ShoppingBag size={48} className="text-[#E6B9B3]" />
        </div>
        <h1 className="text-3xl font-serif text-[#756C64] mb-2">Tu carrito está vacío</h1>
        <p className="text-[#A7B39B] mb-8 max-w-xs">Parece que aún no has añadido ninguna pieza de cerámica a tu colección.</p>
        <Link
          href="/productos"
          className="bg-[#756C64] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#5d564f] transition-all shadow-lg shadow-gray-200"
        >
          Explorar Colección
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-[#756C64] mb-10">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 md:p-6 rounded-3xl flex gap-6 items-center border border-[#E6B9B3]/20 shadow-sm transition-all hover:shadow-md"
              >
                <Link 
                  href={`/productos/${item.slug}`} 
                  className="flex flex-1 gap-6 items-center min-w-0 group"
                >
                  <div className="relative w-24 h-24 bg-[#F8F4ED] rounded-2xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-[#756C64] truncate group-hover:text-[#E6B9B3] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[#A7B39B] font-medium">
                      {formatCLP(item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-3 md:hidden" onClick={(e) => e.preventDefault()}>
                      <button onClick={() => decreaseQty(item.id)} className="p-1.5 rounded-lg border border-[#E6B9B3] text-[#756C64] hover:bg-[#F8F4ED]"><Minus size={14}/></button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} className="p-1.5 rounded-lg border border-[#E6B9B3] text-[#756C64] hover:bg-[#F8F4ED]"><Plus size={14}/></button>
                    </div>
                  </div>
                </Link>

                <div className="hidden md:flex items-center gap-4 bg-[#F8F4ED] p-2 rounded-xl border border-[#E6B9B3]/30">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="p-1 hover:text-[#FFA195] transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold min-w-[20px] text-center text-[#756C64]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="p-1 hover:text-[#FFA195] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="text-right flex flex-col justify-between h-24 py-1">
                  <p className="font-bold text-[#756C64] text-lg">
                    {formatCLP(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#E6B9B3] hover:text-red-400 transition-colors self-end p-2"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-[#E6B9B3]/40 shadow-sm sticky top-28">
              <h2 className="text-xl font-serif text-[#756C64] mb-6">Resumen de compra</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#756C64]">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCLP(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#A7B39B]">
                  <span>Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
                <div className="border-t border-[#E6B9B3]/20 pt-4 flex justify-between text-xl font-bold text-[#756C64]">
                  <span>Total</span>
                  <span>{formatCLP(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout/cart" className="block">
                  <button className="w-full bg-[#756C64] hover:bg-[#5d564f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group">
                    Proceder al pago
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link
                  href="/productos"
                  className="block text-center text-sm text-[#A7B39B] hover:text-[#756C64] transition-colors"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}