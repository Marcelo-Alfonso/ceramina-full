import CardClient from "./CardClient";
import { createClient } from "@/lib/supabase/server";

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
    .order('created_at', { ascending: false })
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
      id="productos-seccion"
      className="py-14 px-6 md:px-12 bg-gradient-to-b from-[#FDFBF7] to-[#F8F4ED]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <p className="text-[10px] font-bold text-[#FFA195] uppercase tracking-[0.4em]">Hecho a mano en Arica</p>
          <h3 className="text-4xl md:text-5xl font-serif text-[#756C64] tracking-tight">
            Nuestra Colección
          </h3>
          <div className="w-12 h-[1px] bg-[#E6B9B3] mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <CardClient key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}