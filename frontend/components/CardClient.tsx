'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCLP } from "@/lib/format";

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

  return (
    <div className="group bg-white p-5 rounded-[2rem] shadow-sm border border-[#E6B9B3]/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out relative overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-72 mb-6 rounded-2xl overflow-hidden bg-[#F8F4ED]">
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#E6B9B3]/10 animate-pulse z-10" />
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#756C64] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-sm">
          Único
        </div>
      </div>
      <div className="flex flex-col flex-grow items-center text-center space-y-2">
        <h4 className="text-xl font-serif text-[#756C64] group-hover:text-[#FFA195] transition-colors duration-300 line-clamp-1">
          {product.name}
        </h4>

        <p className="text-2xl font-light text-[#756C64]/80">
          {formatCLP(product.price)}
        </p>
      </div>
      <div className="mt-6">
        <Link
          href={`/productos/${product.slug}`}
          prefetch={true}
          className="w-full bg-[#756C64] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#5e5650] hover:shadow-lg active:scale-[0.97] transition-all duration-300 flex justify-center items-center gap-2"
        >
          Ver Detalles
        </Link>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 bg-gradient-to-br from-[#FFA195] via-transparent to-[#A7B39B] transition-opacity duration-700"></div>
    </div>
  );
}