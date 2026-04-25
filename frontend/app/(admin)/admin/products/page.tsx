import { createClient } from "@/lib/supabase/server"
import {
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "./actions"

export default async function Page() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  const labelStyles =
    "text-[10px] uppercase tracking-widest font-bold text-[#756C64]/70 mb-1 block"

  const inputStyles =
    "w-full bg-[#F8F4ED] border border-[#E6B9B3] rounded-lg px-3 py-2 text-[#756C64] focus:outline-none focus:ring-2 focus:ring-[#A7B39B] focus:border-transparent transition-all placeholder:text-[#756C64]/30 text-sm disabled:opacity-50"

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

          <h2 className="text-xl font-medium mb-8">
            Nuevo Producto Artesanal
          </h2>

          <form
            action={createProduct}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className={labelStyles}>Nombre del Producto</label>
                <input name="name" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Descripción</label>
                <textarea name="description" rows={3} className={inputStyles} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelStyles}>Precio</label>
                <input name="price" type="number" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Slug</label>
                <input name="slug" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Imagen</label>
                <input type="file" name="file" accept="image/*" className={inputStyles} />
              </div>
            </div>

            <button className="md:col-span-3 mt-4 bg-[#756C64] hover:bg-[#5d564f] text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest">
              Crear Producto
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <div className="flex justify-between border-b pb-4">
            <h2 className="uppercase text-lg">Inventario Total</h2>
            <span className="text-xs">{products?.length || 0} items</span>
          </div>

          <div className="grid gap-6">
            {products
              ?.sort((a, b) => Number(b.is_active) - Number(a.is_active))
              .map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border relative ${
                    p.is_active ? "" : "opacity-50 border-red-200"
                  }`}
                >

                  {!p.is_active && (
                    <div className="absolute top-4 right-4 text-xs text-red-500 font-bold">
                      Inactivo
                    </div>
                  )}

                  <form action={updateProduct} className="flex flex-col lg:flex-row gap-6">
                    <input type="hidden" name="id" value={p.id} />

                    <div className="w-40">
                      {p.image && (
                        <img src={p.image} className="rounded-lg" />
                      )}
                    </div>

                    <div className="flex-1 grid gap-3">
                      <input name="name" defaultValue={p.name} disabled={!p.is_active} className={inputStyles} />
                      <input name="price" type="number" defaultValue={p.price} disabled={!p.is_active} className={inputStyles} />
                      <input name="slug" defaultValue={p.slug} disabled={!p.is_active} className={inputStyles} />
                      <textarea name="description" defaultValue={p.description} disabled={!p.is_active} className={inputStyles} />
                    </div>

                    <div className="flex flex-col gap-2 justify-end">

                      <button className="bg-green-600 text-white px-4 py-2 rounded text-xs">
                        Guardar
                      </button>

                      {p.is_active ? (
                        <button
                          formAction={deleteProduct}
                          className="bg-red-500 text-white px-4 py-2 rounded text-xs"
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          formAction={restoreProduct}
                          className="bg-blue-500 text-white px-4 py-2 rounded text-xs"
                        >
                          Reactivar
                        </button>
                      )}
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