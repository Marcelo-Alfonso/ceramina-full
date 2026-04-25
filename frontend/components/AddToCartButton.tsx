"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
};

export default function AddToCartButton({
  product,
  onAdded,
}: {
  product: Product;
  onAdded?: () => void;
}) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    onAdded?.();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      title="Añadir al carrito"
      className={`flex-1 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-sm active:scale-90 ${
        added 
          ? "bg-green-500 text-white" 
          : "bg-white border-2 border-[#E6B9B3]/40 text-[#756C64] hover:bg-[#F8F4ED]"
      }`}
    >
      {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
    </button>
  );
}