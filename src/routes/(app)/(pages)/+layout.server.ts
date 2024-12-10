import { redirect } from "@sveltejs/kit"
import { fetchSubscription, getOrCreateCustomerId } from "../../(admin)/account/subscription_helpers.server"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession, supabaseServiceRole },
  cookies,
}) => {
  // Check authentication
  const { session, user } = await safeGetSession()

  if (!session || !user?.id) {
    redirect(303, "/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user?.id)
    .single()

  // Get subscription data
  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user,
  })

  if (idError || !customerId) {
    throw new Error("Failed to get customer ID")
  }

  const {
    primarySubscription,
    hasEverHadSubscription,
    error: fetchErr,
  } = await fetchSubscription({
    customerId,
  })

  if (fetchErr) {
    throw new Error("Failed to fetch subscription")
  }

  // Get authentication level
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  return {
    session,
    user,
    profile,
    cookies: cookies.getAll(),
    isActiveCustomer: !!primarySubscription,
    hasEverHadSubscription,
    currentPlanId: primarySubscription?.appSubscription?.id,
    amr: aal?.currentAuthenticationMethods,
  }
}
