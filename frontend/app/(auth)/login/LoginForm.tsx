"use client"

import { useState, useTransition, useEffect } from "react"
import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const supabase = createClient()

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    router.prefetch("/dashboard")
  }, [router])

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message === "Invalid login credentials" ? "Credenciales inválidas" : error.message)
        return
      }

      router.push("/dashboard")
      router.refresh()
    })
  }

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold uppercase text-[#756C64] ml-1">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 border border-[#E6B9B3] rounded-xl focus:ring-4 focus:ring-[#FFA195]/10 focus:border-[#FFA195] transition-all outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold uppercase text-[#756C64] ml-1">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 border border-[#E6B9B3] rounded-xl focus:ring-4 focus:ring-[#FFA195]/10 focus:border-[#FFA195] transition-all outline-none"
          />
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-[#FFA195] hover:text-[#e88d80]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
            <p className="text-xs text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#FFA195] text-white py-3 rounded-xl font-semibold hover:bg-[#ef9387] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar sesión"}
        </button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 h-px bg-[#E6B9B3]/40" />
        <span className="px-3 text-xs uppercase tracking-widest text-[#A7B39B]">o</span>
        <div className="flex-1 h-px bg-[#E6B9B3]/40" />
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-[#E6B9B3] py-2.5 rounded-xl hover:bg-[#F8F4ED] active:scale-[0.98] transition-all text-[#756C64] font-medium"
      >
        <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
        <span>Continuar con Google</span>
      </button>
    </div>
  )
}