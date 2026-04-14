"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/browser"
import { registerUser } from "@/lib/auth/register"
import { Loader2, MailCheck } from "lucide-react"

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{
    error: string | null
    success: boolean
  }>({
    error: null,
    success: false,
  })

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ error: null, success: false })

    const form = e.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()

    startTransition(async () => {
      const { error } = await registerUser(supabase, email, password)

      if (error) {
        setStatus({ error: error.message, success: false })
        return
      }

      setStatus({ error: null, success: true })
    })
  }

  if (status.success) {
    return (
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-500 rounded-full">
          <MailCheck className="w-6 h-6" />
        </div>
        <p className="text-[#756C64] font-medium">¡Casi listo!</p>
        <p className="text-sm text-[#A7B39B]">
          Revisa tu correo para confirmar tu cuenta y empezar a comprar.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase text-[#756C64] ml-1"
        >
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          placeholder="tu@email.com"
          className="w-full px-4 py-2.5 border border-[#E6B9B3] rounded-xl focus:ring-4 focus:ring-[#FFA195]/10 focus:border-[#FFA195] transition-all outline-none disabled:opacity-50"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase text-[#756C64] ml-1"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          disabled={isPending}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 border border-[#E6B9B3] rounded-xl focus:ring-4 focus:ring-[#FFA195]/10 focus:border-[#FFA195] transition-all outline-none disabled:opacity-50"
        />
      </div>

      {status.error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
          <p className="text-xs text-red-600 text-center font-medium">
            {status.error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#FFA195] text-white py-3 rounded-xl font-semibold hover:bg-[#ef9387] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Registrarse"
        )}
      </button>
    </form>
  )
}