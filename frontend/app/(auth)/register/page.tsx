import Image from "next/image"
import Link from "next/link"
import RegisterForm from "./RegisterForm"

export const metadata = {
  title: "Crear Cuenta | Ceramina",
  description: "Únete a Ceramina y descubre joyas únicas hechas a mano.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4ED] px-4">
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
          <h1 className="text-3xl font-serif mt-3 text-[#756C64]">Crear cuenta</h1>
          <p className="text-sm text-[#A7B39B]">Únete a Ceramina</p>
        </div>
        <RegisterForm />
        <p className="text-sm text-center mt-8 text-[#756C64]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#FFA195] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}