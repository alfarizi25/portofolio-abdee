import { createClient } from "@supabase/supabase-js"

// Singleton pattern untuk client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export const createSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be defined")
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Server-side Supabase client (untuk server actions)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and Service Role Key must be defined")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}
