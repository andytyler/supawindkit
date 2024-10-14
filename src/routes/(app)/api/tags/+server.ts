import { json } from '@sveltejs/kit'
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, locals, url }) => {
  
}


export const GET: RequestHandler = async ({ locals }) => {
  // Get the user from the safeGetSession function
  const { user } = await locals.safeGetSession()

  // Check if the user is authenticated
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Query Supabase to get all parents uploaded by this user
    const query = locals.supabase
    .from('crawled_data')
    .select('*')
    .eq('owner_user', user.id)
    .order('created_at', { ascending: false })

    // type Tag = Awaited<ReturnType<typeof query>>

    const { data: parents, error } = await query
    if (error) {
      throw error
    }

    return json({ results: parents })
  } catch (error) {
    console.error('Error fetching parents:', error)
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
