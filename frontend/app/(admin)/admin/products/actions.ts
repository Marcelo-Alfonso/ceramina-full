"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod" 

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!

const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  slug: z.string().min(1),
  description: z.string().optional(),
})

const getPathFromUrl = (url: string) => {
  const parts = url.split(`${BUCKET}/`)
  return parts.length > 1 ? parts[1] : null
}
export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const rawData = Object.fromEntries(formData.entries())
  const validatedFields = ProductSchema.safeParse(rawData)
  const fileName = `products/${crypto.randomUUID()}`

  if (!validatedFields.success) {
    throw new Error("Datos del formulario inválidos")
  }

  const file = formData.get("file") as File
  let imageUrl: string | null = null

  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen")
    if (file.size > 2_000_000) throw new Error("La imagen no puede superar 2MB")    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`)

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
    imageUrl = data.publicUrl
  }

  const { error: dbError } = await supabase.from("products").insert({
    ...validatedFields.data,
    image: imageUrl,
    is_active: true,
  })

  if (dbError) {
    await supabase.storage.from(BUCKET).remove([fileName]) 
    throw new Error(`Error al guardar producto: ${dbError.message}`)
  }

  revalidatePath("/admin/products")
}
export async function updateProduct(formData: FormData) {
  const supabase = await createClient()
  const validated = ProductSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!validated.success) throw new Error("Datos inválidos")

  const id = formData.get("id")
  const file = formData.get("file") as File
  let updateData: any = { ...validated.data }

  if (file && file.size > 0) {
    const fileName = `products/${crypto.randomUUID()}`
    
    const [uploadResult, existingResult] = await Promise.all([
      supabase.storage.from(BUCKET).upload(fileName, file),
      supabase.from("products").select("image").eq("id", id).single()
    ])

    if (uploadResult.error) throw new Error("Error al subir nueva imagen")

    const newImageUrl = supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl
    updateData.image = newImageUrl

    const oldUrl = existingResult.data?.image
    if (oldUrl) {
      const oldPath = getPathFromUrl(oldUrl)
      if (oldPath) supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  const { error } = await supabase.from("products").update(updateData).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
}
export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()

  const id = Number(formData.get("id"))

  if (!id) throw new Error("ID inválido")

  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
}
export async function restoreProduct(formData: FormData) {
  const supabase = await createClient()

  const id = Number(formData.get("id"))

  const { error } = await supabase
    .from("products")
    .update({ is_active: true })

    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
}