import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CheckoutForm from "./CheckoutForm"
import Image from "next/image"
import { Suspense } from "react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from("products").select("name").eq("slug", slug).eq("is_active", true).single()
  
  return {
    title: product ? `Comprar ${product.name} | Ceramina` : "Producto no encontrado",
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !product) return notFound()

  const now = new Date().toISOString()
  const { data: discount } = await supabase
    .from('discounts')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .maybeSingle()

  const finalPrice = discount 
    ? (discount.discount_type === 'percentage' 
        ? product.price * (1 - discount.discount_value / 100) 
        : Math.max(0, product.price - discount.discount_value))
    : product.price

  const productWithDiscount = {
    ...product,
    price: finalPrice
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-sm border border-[#E6B9B3]/30 overflow-hidden">

        <div className="bg-[#F8F4ED]/50 pt-26 p-8 md:p-12 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[#E6B9B3]/20">
          <div className="relative w-full aspect-square max-w-[320px] group">
            {discount && (
              <div className="absolute top-4 right-4 bg-[#A7B39B] text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-20 shadow-sm animate-in fade-in zoom-in duration-300">
                {discount.name}
              </div>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-3xl shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          <div className="text-center mt-8 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7B39B] font-bold">
              Colección Artesanal
            </span>
            <h2 className="text-3xl font-serif text-[#756C64]">{product.name}</h2>
            <p className="text-[#A7B39B] text-sm leading-relaxed max-w-xs mx-auto">
              {product.description}
            </p>
            
            <div className="pt-4 flex flex-col items-center gap-1">
              {discount ? (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price.toLocaleString("es-CL")}
                  </span>
                  <p className="text-4xl font-bold text-[#FFA195]">
                    ${finalPrice.toLocaleString("es-CL")}
                  </p>
                </>
              ) : (
                <p className="text-4xl font-light text-[#756C64]">
                  ${product.price.toLocaleString("es-CL")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-2xl font-serif text-[#756C64] mb-2">Finalizar Compra</h1>
            <div className="h-1 w-12 bg-[#FFA195] mb-4 mx-auto md:mx-0 rounded-full" />
            <p className="text-[#A7B39B] text-sm italic">
              Estás a un paso de tener esta pieza única en tus manos.
            </p>
          </div>
          
          <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-2xl" />}>
            <CheckoutForm product={productWithDiscount} />
          </Suspense>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Image src="/webpay-icon.svg" alt="Webpay" width={80} height={20} className="object-contain" />
          </div>
        </div>

      </div>
    </div>
  )
}