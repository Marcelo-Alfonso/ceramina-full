import Image from "next/image"
import Link from "next/link"
import LoginForm from "./LoginForm"

export const metadata = {
  title: "Iniciar Sesión | Ceramina",
  description: "Ingresa a tu cuenta de Ceramina para gestionar tus pedidos y perfil.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4ED] px-4 relative">
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-sm text-[#756C64] hover:text-[#FFA195] transition-colors">
          ← Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-[#E6B9B3]/50">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Ceramina" 
            width={60} 
            height={60} 
            priority 
            fetchPriority="high"
          />
          <h1 className="text-3xl font-serif mt-3 text-[#756C64]">Ceramina</h1>
          <p className="text-sm text-[#A7B39B]">Accede a tu cuenta</p>
        </div>
        <LoginForm />
        <p className="text-sm text-center mt-8 text-[#756C64]">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-[#FFA195] font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}