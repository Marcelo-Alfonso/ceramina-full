import { createClient } from "@/lib/supabase/server"
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react"

type Order = {
  id: string
  created_at: string
  amount: number
  status: "pending" | "processing" | "paid" | "failed" | "cancelled"
}

export default async function OrdersList({ email }: { email: string }) {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, created_at, amount, status")
    .eq("email", email) 
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error loading orders:", error)

    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 text-sm">
          Error cargando pedidos. Intenta nuevamente.
        </p>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#F8F4ED]/30 border-2 border-dashed border-[#E6B9B3]/30 rounded-3xl p-12 text-center">
        <p className="text-[#A7B39B] italic">
          Aún no has realizado pedidos.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {orders.map((order: Order) => {
        const statusConfig = getStatusConfig(order.status)

        return (
          <div
            key={order.id}
            className="group bg-white border border-[#E6B9B3]/30 p-5 rounded-2xl flex items-center justify-between hover:shadow-md hover:border-[#FFA195]/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F8F4ED] rounded-xl flex items-center justify-center text-[#FFA195]">
                <Package size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#756C64]">
                  Pedido #{order.id.slice(0, 8)}
                </p>

                <p className="text-xs text-[#A7B39B]">
                  {new Date(order.created_at).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <p className="font-bold text-[#756C64]">
                ${order.amount.toLocaleString("es-CL")}
              </p>

              <span
                className={`text-[10px] uppercase tracking-tight px-2 py-1 rounded-full font-bold flex items-center gap-1 ${statusConfig.className}`}
              >
                <statusConfig.icon size={10} />
                {statusConfig.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStatusConfig(status: Order["status"]) {
  switch (status) {
    case "paid":
      return {
        label: "Pagado",
        className: "bg-green-50 text-green-600",
        icon: CheckCircle2,
      }

    case "processing":
    case "pending":
      return {
        label: "Procesando",
        className: "bg-orange-50 text-orange-600",
        icon: Clock,
      }

    case "failed":
    case "cancelled":
      return {
        label: "Fallido",
        className: "bg-red-50 text-red-600",
        icon: XCircle,
      }

    default:
      return {
        label: "Desconocido",
        className: "bg-gray-50 text-gray-600",
        icon: Clock,
      }
  }
}

export function OrdersSkeleton() {
  return (
    <div className="grid gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-2xl w-full" />
      ))}
    </div>
  )
}