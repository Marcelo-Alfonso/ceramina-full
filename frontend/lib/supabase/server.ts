// Se importa la funcion createServerClient desde el paquete @supabase/ssr para crear un cliente de Supabase en el servidor.
import { createServerClient } from "@supabase/ssr"
// Se importa la funcion createClient desde el paquete @supabase/supabase-js para crear un cliente de Supabase en el navegador.
import { createClient as createSupabaseClient } from "@supabase/supabase-js" 
// Se importa la funcion cookies desde el paquete next/headers para manejar las cookies en el servidor.
import { cookies } from "next/headers"

// Se exporta una función asincrona
export async function createClient() {
  // Se obtiene el objeto cookieStore que permite acceder a las cookies del navegador en el servidor.
  const cookieStore = await cookies()
  // Se utiliza la funcion createServerClient
  return createServerClient(
    // Se pasa la variable de entorno NEXT_PUBLIC_SUPABASE_URL que contiene la URL del proyecto de Supabase.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Se pasa la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY que contiene la clave anonima del proyecto de Supabase.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Se crea un objeto cookies
      cookies: {
        // Se define un metodo get que recibe un nombre de cookie y devuelve su valor si existe, o undefined si no existe.
        get(name: string) { return cookieStore.get(name)?.value },
        // Se define un metodo set que recibe un nombre de cookie, un valor y unas opciones, y establece la cookie en el navegador con esos parametros.
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }) } catch {} },
        // Se define un metodo remove que recibe un nombre de cookie y unas opciones, y elimina la cookie del navegador con esos parametros.
        remove(name: string, options: any) { try { cookieStore.set({ name, value: "", ...options }) } catch {} },
      },
    }
  )
}
// Se exporta la función createStaticClient
export function createStaticClient() {
  // Se utiliza la funcion createSupabaseClient 
  return createSupabaseClient(
    // Se pasa la variable de entorno NEXT_PUBLIC_SUPABASE_URL que contiene la URL del proyecto de Supabase.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Se pasa la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY que contiene la clave anonima del proyecto de Supabase.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}