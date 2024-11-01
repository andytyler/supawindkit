import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private"
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Load environment variables from .env.local file
// config({ path: path.resolve(__dirname, "../../.env.local") })

// Initialize Supabase client
const supabaseUrl: string = PUBLIC_SUPABASE_URL
const supabaseKey: string = PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables",
  )
}

// console.log("Supabase URL:", PUBLIC_SUPABASE_URL)
// console.log("Supabase Key:", PUBLIC_SUPABASE_ANON_KEY)

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)


export const serviceRoleClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default supabase
