'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCLP } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";
import AddToCartButton from "./AddToCartButton";
import { Heart, ShoppingBag } from "lucide-react";

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
    <div className="group bg-[#ffffff] p-4 rounded-[2.5rem] shadow-sm border border-[#E6B9B3]/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full relative overflow-hidden">

      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-80 mb-5 rounded-[2rem] overflow-hidden bg-[#f8e3f5]">
        {!isLoaded && <div className="absolute inset-0 bg-[#E6B9B3]/10 animate-pulse z-10" />}
        

        {/* Botón de Favorito */}
        {/* <button 
          type="button"
          aria-label="Agregar a favoritos"
          className="absolute top-4 right-4 z-35 w-10 h-10 bg-white/90 hover:bg-white text-[#756C64] rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95"
        >
          <Heart className="w-4 h-4" />
        </button> */}

        {/* Sección Descuento */}
        {hasDiscount && (
          <div className="absolute top-16 right-4 bg-[#FFA195] text-white text-[10px] font-black px-3 py-1.5 rounded-xl z-30 shadow-lg">
            {discount.name.toUpperCase()}
          </div>
        )}

        {/* Imagen del producto */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className={`object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
        />

      </div>

      {/* Información del Producto */}
      <div className="flex flex-col flex-grow items-center text-center px-2 space-y-3 pb-2">

        {/* Nombre producto */}
        <h4 className="text-3xl font-serif text-[#22021c] group-hover:text-[#db70b7] transition-colors duration-300">
          {product.name}
        </h4>

        {/* Separador decorativo con flor */}
        <div className="flex items-center justify-center gap-2 w-full text-[#e6b3dd]">
          <div className="h-[1px] bg-[#E6B9B3]/40 flex-1" />
          <span className="text-xl">✿</span>
          <div className="h-[1px] bg-[#E6B9B3]/40 flex-1" />
        </div>

        {/* Precio en Cápsula Estilizada */}
        <div className="flex flex-col items-center justify-center w-full">
          {/* formato de precios en descuento */}
          {hasDiscount ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatCLP(product.price)}
              </span>
              <div className="bg-[#c54c74]/20 px-6 py-1.5 rounded-full inline-block shadow-inner">
                <span className="text-2xl font-black text-[#44081c] tracking-tighter">
                  {formatCLP(discountedPrice)}
                </span>
              </div>
            </div>
          ) : (
            // formato de precios normal
            <div className="bg-[#c54c74]/20 px-6 py-1.5 rounded-full inline-block shadow-inner">
              <span className="text-2xl font-black text-[#44081c] tracking-tighter">
                {formatCLP(product.price)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 flex gap-3 w-full h-14">
        {/* Boton para ver detalles */}
        <Link
          href={`/productos/${product.slug}`}
          className="flex-[2.5] flex items-center justify-center gap-2 bg-[#627c73] text-white rounded-2xl font-bold text-[16px] lg:text-[18px] hover:bg-[#627c73]/80 transition-all shadow-md active:scale-[0.97]"
        >
          <ShoppingBag className="w-4 h-4" />
          Ver Detalles
        </Link>

        {/* Boton para agregar al carrito */}
        <AddToCartButton product={{...product, price: discountedPrice}} />
      </div>

      {/* Gradiente sutil decorativo en hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-[#FFA195]/20 via-transparent to-transparent transition-opacity duration-700"></div>
    </div>
  );
}