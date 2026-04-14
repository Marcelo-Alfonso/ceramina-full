import { SupabaseClient } from "@supabase/supabase-js"

export async function registerUser(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
}