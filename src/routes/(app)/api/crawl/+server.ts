import { crawlWebsite, searchSimilarContent } from "$lib/server/extrapolate/extrapolate-limited-md"
import { json } from '@sveltejs/kit'
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, locals, url }) => {
  const { input_url, depth } = await request.json()

  console.log(`🕸️  REQUEST to crawl \n > website:(${input_url}) \n > with depth: (${depth})\n`)
  try {
    await crawlWebsite(input_url, parseInt(depth))
    return json({ success: true })
  } catch (error) {
    console.error('Crawl error:', error)
    return json({ success: false, error: 'An error occurred while crawling the website.' }, { status: 500 })
  }
}


export const GET: RequestHandler = async ({ request, locals, url }) => {
  const query = url.searchParams.get('query') || ''
  const limit = url.searchParams.get('limit') || '5'
  const results = await searchSimilarContent(query, parseInt(limit))
  return json({ results })
}