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
    // Query Supabase to get all unique titles as tags
    const query = locals.supabase
      .from('crawled_data')
      .select('id, title')
      .eq('owner_user', user.id)
      .order('created_at', { ascending: false })

    const { data: tags, error } = await query
    if (error) {
      throw error
    }

    // Transform the data to match the expected tag format
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      title: tag.title
    }))

    return json({ results: formattedTags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
