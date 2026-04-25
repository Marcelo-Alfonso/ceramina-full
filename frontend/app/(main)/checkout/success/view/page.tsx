"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, 
  Loader2, MapPin, Phone, Package, ArrowLeft, 
  ReceiptText, Store
} from "lucide-react"
import { formatCLP } from "@/lib/format"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type OrderItem = {
  id: number
  quantity: number
  price: number
  original_price: number
  products: {
    id: number
    name: string
    image: string
  }
}

function StatusContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "paid" | "rejected" | "pending" | "error">("loading")
  const [items, setItems] = useState<OrderItem[]>([])
  const [shippingMethod, setShippingMethod] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState(0)
  const [address, setAddress] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    const fetchData = async () => {
      try {
        const statusRes = await fetch(`${API_URL}/order-status?token=${token}`, { cache: "no-store" })
        if (!statusRes.ok) throw new Error()
        const statusData = await statusRes.json()
        setStatus(statusData.status)

        const itemsRes = await fetch(`${API_URL}/order/by-token/items?token=${token}`, { cache: "no-store" })
        if (itemsRes.ok) {
          const data = await itemsRes.json()
          setItems(data.items || [])
          setShippingMethod(data.shipping_method)
          setShippingCost(data.shipping_cost || 0)
          setAddress(data.address)
          setPhone(data.phone)
          setAmount(data.amount || 0)
        }
      } catch {
        setStatus("error")
      }
    }

    fetchData()
    localStorage.removeItem("checkout_idempotency")
  }, [token])

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const configs = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-[#756C64] animate-spin" />,
      bgIcon: "bg-gray-100",
      title: "Verificando pago",
      desc: "Estamos confirmando tu transacción...",
      color: "text-gray-600"
    },
    paid: {
      icon: <CheckCircle2 className="w-12 h-12 text-white" />,
      bgIcon: "bg-green-500",
      title: "¡Pago Exitoso!",
      desc: "Tu pedido ya está en camino a ser preparado.",
      color: "text-green-600"
    },
    rejected: {
      icon: <XCircle className="w-12 h-12 text-white" />,
      bgIcon: "bg-red-500",
      title: "Pago Rechazado",
      desc: "Hubo un problema con la transacción bancaria.",
      color: "text-red-600"
    },
    pending: {
      icon: <Clock className="w-12 h-12 text-white" />,
      bgIcon: "bg-amber-500",
      title: "Pago Pendiente",
      desc: "Tu pago está siendo procesado por Flow.",
      color: "text-amber-600"
    },
    error: {
      icon: <AlertCircle className="w-12 h-12 text-white" />,
      bgIcon: "bg-rose-500",
      title: "Algo salió mal",
      desc: "No pudimos encontrar los detalles del pedido.",
      color: "text-rose-600"
    }
  }

  const current = configs[status]

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 py-20">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#756C64]/5 border border-gray-100 overflow-hidden">
          <div className="pt-12 pb-8 px-6 text-center">
            <div className={`w-24 h-24 ${current.bgIcon} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-current/20`}>
              {current.icon}
            </div>
            <h1 className={`text-3xl font-black mb-2 tracking-tight ${current.color}`}>
              {current.title}
            </h1>
            <p className="text-gray-400 font-medium max-w-[280px] mx-auto leading-tight">
              {current.desc}
            </p>
          </div>

          {status === "paid" && items.length > 0 && (
            <div className="px-8 pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-[#F8F4ED] rounded-3xl p-5 flex gap-4 items-start border border-[#E6B9B3]/20">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  {shippingMethod === "pickup" ? <Store className="w-5 h-5 text-[#756C64]" /> : <MapPin className="w-5 h-5 text-[#756C64]" />}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#A7B39B] uppercase tracking-widest">
                    {shippingMethod === "pickup" ? "Punto de Retiro" : "Dirección de Envío"}
                  </p>
                  <p className="text-sm font-bold text-[#756C64] leading-snug">
                    {shippingMethod === "pickup" ? "Agustín Edwards 1961, Arica" : address}
                  </p>
                  {phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Package className="w-4 h-4" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">Resumen del Pedido</h2>
                </div>
                
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:border-[#E6B9B3] transition-colors">
                        <Image
                          src={item.products.image}
                          alt={item.products.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#756C64] truncate">
                          {item.products.name}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          Cant. {item.quantity} · {item.original_price !== item.price ? (
                            <>
                              <span className="line-through opacity-60 mr-1">{formatCLP(item.original_price)}</span>
                              <span>{formatCLP(item.price)}</span>
                            </>
                          ) : (
                            formatCLP(item.price)
                          )} c/u
                        </p>
                      </div>
                      <p className="text-sm font-black text-[#756C64]">
                        {formatCLP(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200 space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "Gratis" : formatCLP(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pagado</span>
                    <span className="text-3xl font-black text-[#756C64] tracking-tighter">
                      {formatCLP(amount)}
                    </span>
                  </div>
                  <ReceiptText className="w-10 h-10 text-gray-100" />
                </div>
              </div>
            </div>
          )}

          <div className="p-8 pt-0">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 w-full bg-[#756C64] hover:bg-[#5e5650] text-white py-5 rounded-[1.5rem] font-bold transition-all shadow-xl shadow-[#756C64]/10 active:scale-[0.98]"
            >
              {status !== "paid" && <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              {status === "paid" ? "Explorar más productos" : "Volver a la tienda"}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
          Gracias por confiar en nosotros
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Loader2 className="w-10 h-10 animate-spin text-[#756C64]" />
      </div>
    }>
      <StatusContent />
    </Suspense>
  )
}