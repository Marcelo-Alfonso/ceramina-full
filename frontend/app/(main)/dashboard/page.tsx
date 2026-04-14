import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import OrdersList, { OrdersSkeleton } from "./OrdersList"

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const email = user.email
  if (!email) redirect("/login")

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  const isAdmin = userData?.role === "admin"

  return (
    <div className="max-w-5xl mx-auto p-6 pt-28 space-y-10 animate-in fade-in duration-500 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6B9B3]/20 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#A7B39B] font-bold mb-1">
            Mi Cuenta
          </p>
          <h1 className="text-2xl font-serif text-[#756C64]">
            Hola,{" "}
            <span className="text-[#FFA195]">
              {email.split("@")[0]}
            </span>
          </h1>
        </div>

        {isAdmin && (
          <Link
            href="/admin"
            className="bg-[#756C64] text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-[#5e5650] transition-all active:scale-95 shadow-sm"
          >
            Panel de Control
          </Link>
        )}
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-[#756C64]">
            Mis Pedidos Recientes
          </h2>
          <Link href="/shop" className="text-sm text-[#FFA195] hover:underline">
            Continuar comprando
          </Link>
        </div>

        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersList email={email} />
        </Suspense>
      </section>
    </div>
  )
}