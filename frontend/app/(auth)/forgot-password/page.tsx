"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Mail, Loader2 } from "lucide-react"

const supabase = createClient()
export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido")
      setStatus('error')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) {
      setErrorMessage(error.status === 429 ? "Demasiados intentos. Intenta más tarde." : error.message)
      setStatus('error')
      return
    }

    setStatus('success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4ED] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-[#E6B9B3]/50">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#F8F4ED] p-3 rounded-full mb-4">
            <Image src="/logo.png" alt="Ceramina" width={50} height={50} priority />
          </div>
          <h1 className="text-3xl font-serif text-[#756C64] mb-2">
            ¿Olvidaste tu clave?
          </h1>
          <p className="text-sm text-[#A7B39B] text-center max-w-[250px]">
            No te preocupes, te enviaremos instrucciones para recuperarla.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-500 rounded-full mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-[#756C64] font-medium">¡Correo enviado!</p>
            <p className="text-sm text-[#A7B39B]">
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
            <Link 
              href="/login" 
              className="block w-full py-2 text-sm text-[#FFA195] font-semibold hover:text-[#e88d80] transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#756C64] mb-1 ml-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-3 bg-[#F8F4ED]/30 border rounded-xl outline-none transition-all duration-200
                  ${status === 'error' ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-[#E6B9B3] focus:border-[#FFA195] focus:ring-4 focus:ring-[#FFA195]/10'}
                `}
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs text-red-600 text-center">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#FFA195] text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-[#ef9387] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando enlace...
                </>
              ) : (
                "Enviar instrucciones"
              )}
            </button>
            
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 text-sm text-[#A7B39B] hover:text-[#756C64] transition-colors pt-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}