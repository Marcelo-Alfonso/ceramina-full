"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type OrderItem = {
  id: number
  quantity: number
  price: number
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
        const statusRes = await fetch(`${API_URL}/order-status?token=${token}`, {
          cache: "no-store"
        })

        if (!statusRes.ok) throw new Error()

        const statusData = await statusRes.json()
        setStatus(statusData.status)

        const itemsRes = await fetch(`${API_URL}/order/by-token/items?token=${token}`, {
          cache: "no-store"
        })

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

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const configs = {
    loading: {
      icon: <Loader2 className="w-20 h-20 text-slate-400 animate-spin mx-auto" />,
      title: "Verificando pago",
      desc: "Estamos confirmando tu transacción con el banco.",
      color: "text-slate-600"
    },
    paid: {
      icon: <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />,
      title: "¡Pago Recibido!",
      desc: "Tu pedido ha sido procesado con éxito.",
      color: "text-green-600"
    },
    rejected: {
      icon: <XCircle className="w-20 h-20 text-red-500 mx-auto" />,
      title: "Pago Rechazado",
      desc: "No pudimos procesar el pago.",
      color: "text-red-600"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-amber-500 mx-auto" />,
      title: "Pago Pendiente",
      desc: "Tu pago está en revisión.",
      color: "text-amber-600"
    },
    error: {
      icon: <AlertCircle className="w-20 h-20 text-rose-500 mx-auto" />,
      title: "Algo salió mal",
      desc: "Hubo un problema al consultar el pedido.",
      color: "text-rose-600"
    }
  }

  const current = configs[status]

  return (
    <div className="min-h-screen bg-slate-50 pt-26 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">

        <div className="mb-6">{current.icon}</div>

        <h1 className={`text-3xl font-bold mb-3 ${current.color}`}>
          {current.title}
        </h1>

        <p className="text-gray-500 mb-6">{current.desc}</p>

        {status === "paid" && items.length > 0 && (
          <div className="text-left mb-6 border-t pt-4">

            <div className="mb-4 text-sm text-gray-600 space-y-1">
              {shippingMethod === "pickup" ? (
                <>
                  <p>🏪 Retiro en Agustín Edwards 1961</p>
                  {phone && <p>📱 Contacto: {phone}</p>}
                </>
              ) : (
                <>
                  <p>🚚 Envío a:</p>
                  {address && <p className="text-gray-800">{address}</p>}
                  {phone && <p>📱 Contacto: {phone}</p>}
                </>
              )}
            </div>

            <h2 className="font-semibold mb-3 text-sm text-gray-600">
              Resumen de compra
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={item.products.image}
                      alt={item.products.name}
                      fill
                      className="object-cover rounded-lg border"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.products.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-gray-700">
                    ${(item.price * item.quantity).toLocaleString("es-CL")}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-3 space-y-1 text-sm">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-CL")}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>
                  {shippingCost === 0
                    ? "Gratis"
                    : `$${shippingCost.toLocaleString("es-CL")}`}
                </span>
              </div>

              <div className="flex justify-between font-bold text-gray-800 pt-2">
                <span>Total</span>
                <span>${amount.toLocaleString("es-CL")}</span>
              </div>

            </div>
          </div>
        )}

        <Link
          href="/"
          className="block w-full bg-[#756C64] hover:bg-[#5e5650] text-white py-4 rounded-2xl font-bold transition-colors"
        >
          {status === "paid" ? "Ir a mis pedidos" : "Volver al inicio"}
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Cargando...</div>}>
      <StatusContent />
    </Suspense>
  )
}