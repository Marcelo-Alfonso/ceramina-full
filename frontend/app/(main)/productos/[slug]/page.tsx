import Image from "next/image";
import { createStaticClient } from "@/lib/supabase/server";
import { formatCLP } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import Prewarm from "@/components/Prewarm";
import AddToCartButton from "@/components/AddToCartButton";
import { ArrowLeft, MapPin, Truck, Sparkles } from "lucide-react";

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
    .select("slug")
    .eq("is_active", true);

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

  const now = new Date().toISOString();
  const { data: discount } = await supabase
    .from('discounts')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .maybeSingle();

  const discountedPrice = discount 
    ? (discount.discount_type === 'percentage' 
        ? product.price * (1 - discount.discount_value / 100) 
        : Math.max(0, product.price - discount.discount_value))
    : product.price;

  const hasDiscount = !!discount;

  const phone = "56986813194";
  const message = encodeURIComponent(
    `Hola! Me interesa la pieza: ${product.name} (${formatCLP(discountedPrice)}).`
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

            <div className="bg-[#FDFBF7] p-6 md:p-10 flex flex-col items-center justify-center gap-4">
              <div className="relative w-full aspect-square">
                {hasDiscount && (
                  <div className="absolute top-0 right-0 bg-[#FFA195] text-white text-xs font-black px-4 py-2 rounded-2xl z-20 shadow-lg animate-pulse">
                    OFERTA
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-xl transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="text-center text-sm text-[#756C64]/80 max-w-xs">
                <p>
                  Esta figura de porcelana fría requiere cuidados especiales para mantener su calidad y duración.
                </p>
                <Link 
                  href="/cuidados"
                  className="text-[#FFA195] font-semibold underline hover:opacity-80 transition"
                >
                  Ver cuidados
                </Link>
              </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">
              <header className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-[#E6B9B3]/15 text-[#E6B9B3] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                    Pieza única artesanal
                  </span>
                  {hasDiscount && (
                    <span className="inline-flex items-center gap-1.5 bg-[#A7B39B] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3 h-3" /> {discount.name}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-serif text-[#756C64] leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-col">
                  {hasDiscount ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-lg text-gray-400 line-through decoration-[#FFA195]/40 font-medium">
                         Antes: {formatCLP(product.price)}
                      </span>
                      <p className="text-4xl font-black text-[#FFA195] tracking-tighter">
                        {formatCLP(discountedPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-3xl font-semibold text-[#FFA195]">
                      {formatCLP(product.price)}
                    </p>
                  )}
                </div>
              </header>

              <p className="text-[#756C64]/80 leading-relaxed text-lg whitespace-pre-line">
                {product.description || 
                  "Esta pieza ha sido modelada a mano con porcelana fría de alta calidad, asegurando un acabado suave y detallado."}
              </p>

              <div className="bg-[#FDF7F5] border border-[#E6B9B3]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3 text-sm text-[#756C64]">
                  <Truck className="w-5 h-5 mt-0.5 text-[#FFA195]" />
                  <p>
                    Envíos disponibles <strong>solo dentro del sector urbano de Arica (gratis) y Santiago (7000)</strong>.   
                    Para envíos fuera de esta zona, por favor consultar vía WhatsApp.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm text-[#756C64]">
                  <MapPin className="w-5 h-5 mt-0.5 text-[#FFA195]" />
                  <p>
                    Retiro disponible en:{" "}
                    <strong>Agustín Edwards 1961, Arica</strong>. Consultar por Whatsapp.
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
                      price: discountedPrice,
                      image: product.image,
                      slug: product.slug,
                    }}
                  />

                  <Link href="/cart" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[#756C64]/40 hover:bg-[#756C64]/5 transition-all font-semibold text-[#756C64]">
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