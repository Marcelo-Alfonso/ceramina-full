"use client"

import { createClient } from "@/lib/supabase/browser"

export default function LoginButton() {
  const supabase = createClient()
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
            prompt: "select_account"
    }
      }
    })
  }

  return (
    <button onClick={handleLogin}>
      Iniciar sesión con Google
    </button>
  )
}