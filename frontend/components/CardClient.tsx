'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCLP } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";
import AddToCartButton from "./AddToCartButton";
import { Sparkles } from "lucide-react";

interface Discount {
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  slug: string;
}

export default function CardClient({ product }: { product: Product }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchDiscount = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('discounts')
        .select('name, discount_type, discount_value')
        .eq('product_id', product.id)
        .eq('is_active', true)
        .lte('starts_at', now)
        .gte('ends_at', now)
        .maybeSingle();

      if (data && !error) setDiscount(data as Discount);
    };
    fetchDiscount();
  }, [product.id, supabase]);

  const discountedPrice = discount 
    ? (discount.discount_type === 'percentage' 
        ? product.price * (1 - discount.discount_value / 100) 
        : Math.max(0, product.price - discount.discount_value))
    : product.price;

  const hasDiscount = discount !== null;

  return (
    <div className="group bg-white p-4 rounded-[2.5rem] shadow-sm border border-[#E6B9B3]/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">

      <div className="relative w-full h-80 mb-5 rounded-[2rem] overflow-hidden bg-[#F8F4ED]">
        {!isLoaded && <div className="absolute inset-0 bg-[#E6B9B3]/10 animate-pulse z-10" />}
        
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-[#FFA195] text-white text-[10px] font-black px-3 py-2 rounded-xl z-30 shadow-lg">
            ¡OFERTA!
          </div>
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className={`object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="flex flex-col flex-grow items-center text-center px-2 space-y-3">
        {hasDiscount && (
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#A7B39B] to-[#8E9A82] text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md animate-bounce-subtle">
            <Sparkles className="w-3 h-3" />
            {discount.name.toUpperCase()}
          </div>
        )}

        <h4 className="text-2xl font-serif text-[#756C64] group-hover:text-[#FFA195] transition-colors duration-300">
          {product.name}
        </h4>

        <div className="flex flex-col items-center">
          {hasDiscount ? (
            <>
              <span className="text-sm text-gray-400 line-through decoration-[#FFA195]/60 font-medium">
                {formatCLP(product.price)}
              </span>
              <span className="text-3xl font-black text-[#756C64] tracking-tighter">
                {formatCLP(discountedPrice)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-light text-[#756C64]/80">
              {formatCLP(product.price)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3 w-full h-14">
        <Link
          href={`/productos/${product.slug}`}
          className="flex-[2.5] flex items-center justify-center gap-2 bg-[#756C64] text-white rounded-2xl font-bold text-sm hover:bg-[#5e5650] transition-all shadow-md active:scale-[0.97]"
        >
          Ver Detalles
        </Link>

        <AddToCartButton product={{...product, price: discountedPrice}} />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-[#FFA195]/20 via-transparent to-transparent transition-opacity duration-700"></div>
    </div>
  );
}