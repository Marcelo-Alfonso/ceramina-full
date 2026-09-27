import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = await cookies()

    // 1. Creamos la respuesta de redirección primero
    const response = NextResponse.redirect(`${origin}${next}`)

    // 2. Pasamos la gestión de cookies vinculada directamente a `response.cookies`
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 3. Devolvemos la respuesta que ya contiene los encabezados Set-Cookie
      return response
    }

    console.error("Error exchanging code for session:", error)
  }

  // Si no hay código o hubo un error, redirigir a login
  return NextResponse.redirect(`${origin}/login`)
}