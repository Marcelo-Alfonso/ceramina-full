"use client";

import { useState } from "react";

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
      className="flex-1 bg-white border-2 border-[#756C64]/40 hover:bg-[#756C64]/5 text-[#756C64] py-4 rounded-2xl font-bold text-lg transition-all"
    >
      {added ? "Añadido ✓" : "Añadir al carrito"}
    </button>
  );
}