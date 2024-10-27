import { json } from '@sveltejs/kit'
import type { RequestHandler } from "./$types"

import { NOTION_API_KEY } from '$env/static/private'
import { getNotionPageAsMarkdown } from '$lib/connectors/notion'
import { saveContent } from '$lib/server/extrapolate/extrapolate-limited-md'
import { Client } from "@notionhq/client"


export const GET: RequestHandler = async ({ request, locals, url }) => {
  const query = url.searchParams.get('query') || 'meeting notes';
  const notion = new Client({
    auth: NOTION_API_KEY,
  })



  try {

    const response = await notion.search({
      sort: {
        timestamp: 'last_edited_time',
        direction: 'ascending',
      },
    })

    response.results.forEach((result) => {
      console.log(`${result.object} → ${result.id}`)
    })



    // const dbs = await notion.databases.list({})
    // console.log(dbs)

    // const page = await notion.databases.retrieve({
    //   database_id: response.results[0].id,
    // })
  
    const page = await notion.pages.retrieve({
      page_id: response.results[1].id,
    })

    const markdown = await getNotionPageAsMarkdown(page.id)
    // const markdownArray = await getNotionPageAsMarkdownArray(page.id)

    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    })

    // const users = await notion.users.list({})

    return json({ success: true, markdown })
  } catch (error) {
    console.error('Crawl error:', error)
    return json({ success: false, error: 'SUPAFETCH ERROR: An error occurred while making a Notion API request.' }, { status: 500 })
  }
}



export const POST = async ({ request, locals, url }) => {
  // const { pageId } = await request.json();

  // get the user
  // const { user } = await locals.safeGetSession()
  // if (!user) {
  //   return json({ error: 'Unauthorized' }, { status: 401 })
  // }
  let markdownArray = []
  const notion = new Client({
    auth: NOTION_API_KEY,
  });

  // get all the pages from the notion api
  const response = await notion.search({
    sort: {
      timestamp: 'last_edited_time',
      direction: 'ascending',
    },
  })

  // filter to only the pages that are not part of a database
  const pages = response.results.filter((page) => {
    if (page.object === 'page') {
      // If parent doesn't exist, it's not part of a database, so include it
      if (!page.parent) {
        return true;
      }
      // If parent exists, only include if it's not a database
      return page.parent.type !== 'database_id';
    }
    return false;
  });
  
  console.log('pages: ', pages)

  // get the first page  
  for (const page of pages) {
    const markdown = await getNotionPageAsMarkdown(page.id);
    markdownArray.push(markdown)
    // save each item in the markdown array to the database
    saveContent(page.id, markdown, "Notion", "3a5b8f15-59f8-4e62-996e-f5e0e50b8b26")
  }

  try {
    return json({ success: true, markdownArray });
  } catch (error) {
    console.error('Notion API error:', error);
    return json({ success: false, error: 'An error occurred while fetching the Notion page' }, { status: 500 });
  }
};
