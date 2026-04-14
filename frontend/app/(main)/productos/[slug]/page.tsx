import Image from "next/image";
import { createStaticClient } from "@/lib/supabase/server";
import { formatCLP } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import Prewarm from "@/components/Prewarm";
import AddToCartButton from "@/components/AddToCartButton";
import { ShoppingBag, ArrowLeft, MapPin, Truck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient(); 

  const { data: product } = await supabase
    .from("products")
    .select("name, description, image")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Ceramina`,
    description: product.description || "Pieza única de porcelana fría hecha a mano.",
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export async function generateStaticParams() {
  const supabase = createStaticClient(); 
  
  const { data: products } = await supabase
    .from("products")
    .select("slug");

  if (!products) return [];
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient(); 

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) return notFound();

  const phone = "56940090207";

  const message = encodeURIComponent(
    `Hola! Me interesa la pieza: ${product.name} (${formatCLP(product.price)}).`
  );

  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="min-h-screen bg-[#F8F4ED] px-4 py-8 md:px-10 md:py-16">
      <Prewarm />

      <div className="pt-15 max-w-6xl mx-auto">
        <Link 
          href="/productos" 
          className="inline-flex items-center gap-2 text-[#756C64] hover:text-[#A7B39B] mb-8 transition-all group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a la colección
        </Link>

        <main className="bg-white rounded-[2.5rem] shadow-sm border border-[#E6B9B3]/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="relative aspect-square bg-[#FDFBF7] flex items-center justify-center p-6 md:p-10">
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-xl transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">

              <header className="space-y-4">
                <span className="inline-block bg-[#E6B9B3]/15 text-[#E6B9B3] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                  Pieza única artesanal
                </span>

                <h1 className="text-4xl md:text-5xl font-serif text-[#756C64] leading-tight">
                  {product.name}
                </h1>

                <p className="text-3xl font-semibold text-[#FFA195]">
                  {formatCLP(product.price)}
                </p>
              </header>

              <p className="text-[#756C64]/80 leading-relaxed text-lg whitespace-pre-line">
                {product.description || 
                  "Esta pieza ha sido modelada a mano con porcelana fría de alta calidad, asegurando un acabado suave y detallado."}
              </p>

              <div className="bg-[#FDF7F5] border border-[#E6B9B3]/30 rounded-2xl p-5 space-y-3">

                <div className="flex items-start gap-3 text-sm text-[#756C64]">
                  <Truck className="w-5 h-5 mt-0.5 text-[#FFA195]" />
                  <p>
                    Envíos disponibles <strong>solo dentro del sector urbano de Arica</strong>.  
                    Para envíos fuera de esta zona, por favor consultar vía WhatsApp.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#756C64]">
                  <MapPin className="w-5 h-5 mt-0.5 text-[#FFA195]" />
                  <p>
                    Retiro disponible en:{" "}
                    <strong>Agustín Edwards 1961</strong>
                  </p>
                </div>

              </div>

              <div className="flex flex-col gap-4 pt-2">

                <Link href={`/checkout/${product.slug}`}>
                  <button className="w-full bg-[#756C64] hover:bg-[#5d564f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#756C64]/10 transition-all active:scale-[0.98]">
                    Comprar ahora
                  </button>
                </Link>

                <div className="flex gap-3">

                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      slug: product.slug,
                    }}
                  />

                  <Link href="/cart" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[#756C64]/40 hover:bg-[#756C64]/5 transition-all font-semibold text-[#756C64]">
                      <ShoppingBag className="w-5 h-5" />
                      Ver carrito
                    </button>
                  </Link>

                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border-2 border-[#A7B39B]/40 hover:bg-[#A7B39B]/5 text-[#A7B39B] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
                >
                  <Image src="/whatsapp-icon.svg" alt="" width={22} height={22} />
                  Consultar por WhatsApp
                </a>
              </div>

              <footer className="pt-8 border-t border-[#F8F4ED] flex justify-between items-center text-[10px] text-[#A7B39B] uppercase tracking-[0.15em] font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FFA195] rounded-full"></span>
                  Envío en Arica urbano
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FFA195] rounded-full"></span>
                  Hecho a mano
                </div>
              </footer>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}