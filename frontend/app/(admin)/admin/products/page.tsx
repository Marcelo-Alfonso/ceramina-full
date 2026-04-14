import { createClient } from "@/lib/supabase/server"
import {createProduct,updateProduct,deleteProduct,} from "./actions"

export default async function Page() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  const labelStyles = "text-[10px] uppercase tracking-widest font-bold text-[#756C64]/70 mb-1 block"
  const inputStyles = "w-full bg-[#F8F4ED] border border-[#E6B9B3] rounded-lg px-3 py-2 text-[#756C64] focus:outline-none focus:ring-2 focus:ring-[#A7B39B] focus:border-transparent transition-all placeholder:text-[#756C64]/30 text-sm"

  return (
    <div className="min-h-screen bg-[#F8F4ED] p-4 md:p-10 font-sans text-[#756C64]">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center space-y-2">
          <div className="bg-[#A7B39B] text-[#F8F4ED] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
            Admin Panel
          </div>
          <h1 className="text-4xl font-light tracking-tight">
            Gestión de <span className="font-semibold text-[#756C64]">Productos</span>
          </h1>
          <div className="w-24 h-1 bg-[#E6B9B3] rounded-full"></div>
        </header>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6B9B3]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#A7B39B]"></div>
          <h2 className="text-xl font-medium mb-8 flex items-center gap-2">
            Nuevo Producto Artesanal
          </h2>
          <form
            action={createProduct}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className={labelStyles}>Nombre del Producto</label>
                <input name="name" placeholder="Ej: Tetera de Porcelana" required className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Descripción Detallada</label>
                <textarea name="description" rows={3} placeholder="Describe los materiales y el acabado..." className={inputStyles} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelStyles}>Precio (CLP)</label>
                <input name="price" type="number" placeholder="0" required className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Slug / URL</label>
                <input name="slug" placeholder="tetera-porcelana" required className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Imagen del Producto</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  className={inputStyles}
                />
              </div>
            </div>

            <button className="md:col-span-3 mt-4 bg-[#756C64] hover:bg-[#5d564f] text-[#F8F4ED] font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs">
              Publicar Producto
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6B9B3] pb-4">
            <h2 className="text-lg font-medium uppercase tracking-tighter">Inventario Activo</h2>
            <span className="bg-[#E6B9B3] text-white px-3 py-1 rounded-full text-xs font-bold">
              {products?.length || 0} Items
            </span>
          </div>
          
          <div className="grid gap-6">
            {products?.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-[#E6B9B3] transition-all group relative"
              >
                <form action={updateProduct} className="flex flex-col lg:flex-row gap-8">
                  <input type="hidden" name="id" value={p.id} />
                  
                  <div className="w-full lg:w-48 space-y-4">
                    <div className="aspect-square bg-[#F8F4ED] rounded-xl border border-[#E6B9B3]/40 flex items-center justify-center overflow-hidden group-hover:shadow-inner transition-all">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-[#E6B9B3] text-[10px] font-bold uppercase tracking-widest">Sin imagen</span>
                      )}
                    </div>
                    <div>
                      <label className={labelStyles}>Slug Actual</label>
                      <input name="slug" defaultValue={p.slug} className="w-full bg-transparent text-[11px] text-[#A7B39B] font-mono border-none p-0 focus:ring-0" />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="md:col-span-2">
                      <label className={labelStyles}>Nombre</label>
                      <input name="name" defaultValue={p.name} className={inputStyles} />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className={labelStyles}>Descripción</label>
                      <textarea name="description" defaultValue={p.description} rows={2} className={inputStyles} />
                    </div>

                    <div>
                      <label className={labelStyles}>Precio</label>
                      <input name="price" type="number" defaultValue={p.price} className={inputStyles} />
                    </div>

                    <div>
                      <label className={labelStyles}>URL Imagen</label>
                      <input name="image" defaultValue={p.image} className={inputStyles} />
                    </div>
                  </div>

                  <div className="flex lg:flex-col justify-end gap-3 min-w-[140px]">
                    <button className="flex-1 bg-[#A7B39B] hover:bg-[#8e9c81] text-white text-[10px] font-black py-3 px-4 rounded-lg transition-all shadow-sm uppercase tracking-widest">
                      Guardar
                    </button>
                    <button 
                      formAction={deleteProduct}
                      className="flex-1 bg-white hover:bg-[#FFA195] border border-[#FFA195] text-[#FFA195] hover:text-white text-[10px] font-black py-3 px-4 rounded-lg transition-all uppercase tracking-widest"
                    >
                      Eliminar
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}