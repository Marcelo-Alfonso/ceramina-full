import CardClient from "./CardClient";
import { createClient } from "@/lib/supabase/server";
import Link from 'next/link';

export const revalidate = 6000;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  slug: string;
}

export default async function ProductsSectionHero() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, image, slug")
    .eq("is_active", true)
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<Product[]>();

  if (error) {
    console.error("Error cargando productos:", error.message);
    return (
      <div className="py-24 text-center">
        <p className="text-[#756C64]/60 font-serif italic">Hubo un problema al cargar la colección. Por favor, intenta de nuevo.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-serif text-[#756C64]/50 tracking-widest uppercase">Próximamente nuevas creaciones...</p>
      </div>
    );
  }

  return (
    <section
      id="productos_destacados"
      className="py-14 px-6 md:px-6 lg:px-12 bg-[#f6f3f4]"
    >
      <div className="max-w-9xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          {/* Ante titulo productos destacados */}
          <p className="text-[10px] font-bold text-[#c54c74] uppercase tracking-[0.4em]">Piezas únicas hechas a mano</p>
          {/* Titulo productos destacados */}
          <h3 className="text-4xl md:text-5xl font-serif text-[#370630] tracking-tight">
            Productos Destacados
          </h3>
          {/* separador */}
          <div className="w-50 h-[1px] bg-[#370630] mx-auto mt-6" />
        </div>
        {/* Contenedor de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 gap-x-4 gap-y-2">
          {products.map((product) => (
            <CardClient key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 justify-center flex">
            {/* Botón principal */}
            <Link
                href={"/productos"}
                className="w-55 px-6 py-3.5 bg-[#c54c74]/95 hover:bg-[#c54c74]/70 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-[#2c221e]/30 flex items-center justify-center text-sm md:text-base"
            >
                Ver todos los productos
            </Link>
        </div>
      </div>
    </section>
  );
}