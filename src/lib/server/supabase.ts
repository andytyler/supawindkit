import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private"
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"


// Initialize Supabase client for server-side operations using the service role key
export const serviceRoleClient: SupabaseClient = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
)

export default serviceRoleClient
