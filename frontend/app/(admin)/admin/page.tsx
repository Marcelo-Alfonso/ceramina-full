import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single()

  return (
    <div className="min-h-screen bg-[#F8F4ED] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow border border-[#E6B9B3]">
          <h1 className="text-2xl font-serif text-[#756C64]">
            Panel de Administración
          </h1>
          <p className="text-sm text-[#A7B39B] mt-1">
            Bienvenido {user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rol: {userData?.role}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="bg-white p-6 rounded-2xl shadow border border-[#E6B9B3] hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-[#756C64]">
              Productos
            </h2>
            <p className="text-sm text-[#A7B39B] mt-1">
              Crear, editar y eliminar productos
            </p>
          </Link>

        </div>
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-[#FFA195] hover:underline"
          >
            ← Volver al dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}