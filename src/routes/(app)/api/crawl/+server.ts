import { crawlWebsite, searchSimilarContent } from "$lib/server/extrapolate/extrapolate-limited-md"
import { json } from '@sveltejs/kit'
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, locals, url }) => {
  const { input_url, depth, crawl_title } = await request.json()

  const { user } = await locals.safeGetSession()
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log(`🕸️  REQUEST to crawl \n > website:(${input_url}) \n > with depth: (${depth})\n`)
  try {
    await crawlWebsite(user, input_url, parseInt(depth), crawl_title)
    return json({ success: true })
  } catch (error) {
    console.error('Crawl error:', error)
    return json({ success: false, error: 'An error occurred while crawling the website.' }, { status: 500 })
  }
}


export const GET: RequestHandler = async ({ request, locals, url }) => {
  const { user } = await locals.safeGetSession()
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }
  const query = url.searchParams.get('query') || ''
  const limit = url.searchParams.get('limit') || '5'
  const tagIds = url.searchParams.get('tagIds') || ''
  const parsedTagIds = tagIds ? JSON.parse(tagIds) : [];
  console.log(`🔍  REQUEST to search \n > query:(${query}) \n > with limit: (${limit})\n`)

  const results = await searchSimilarContent(user, query, parseInt(limit), parsedTagIds);

  console.log(`🔍  RESPONSE \n > results:(${results})\n`)
  return json({ results })
}