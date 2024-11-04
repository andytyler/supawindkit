import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Initialize Supabase client for client-side operations
const supabaseUrl: string = PUBLIC_SUPABASE_URL
const supabaseKey: string = PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables",
  )
}

const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabaseClient

