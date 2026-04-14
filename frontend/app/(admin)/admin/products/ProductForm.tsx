"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  slug: string
}
export default function ProductForm({ products }: { products: Product[] }) {
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState<Partial<Product>>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (editingId) {
      await supabase
        .from("products")
        .update(form)
        .eq("id", editingId)
    } else {
      await supabase.from("products").insert({
        ...form,
        price: Number(form.price),
      })
    }

    setForm({})
    setEditingId(null)
    setLoading(false)
    router.refresh()
  }

  const handleEdit = (product: Product) => {
    setForm(product)
    setEditingId(product.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return

    await supabase.from("products").delete().eq("id", id)
    router.refresh()
  }

  return (
    <div className="space-y-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-3"
      >
        <h2 className="font-semibold">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>

        <input
          name="name"
          placeholder="Nombre"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price"
          placeholder="Precio (CLP)"
          type="number"
          value={form.price || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="image"
          placeholder="URL imagen"
          value={form.image || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="description"
          placeholder="Descripción"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading
            ? "Guardando..."
            : editingId
            ? "Actualizar"
            : "Crear"}
        </button>
      </form>

      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">
                ${p.price.toLocaleString("es-CL")}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="text-blue-500"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}