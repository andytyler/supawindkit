import type { User } from '@supabase/supabase-js';
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import TurndownService from "turndown";
import { URL } from "url";
import getHtml from "waterfall-fetch";
import supabase from "../../supabase";

const turndownService = new TurndownService()

// Use the Xenova model port
const MODEL_NAME = 'Supabase/gte-small';
let embeddingPipeline: FeatureExtractionPipeline;

async function loadModel() {
  embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME);
  console.log('Embedding Model loaded');
}

async function getEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) await loadModel();
  const result = await embeddingPipeline(text, {
    pooling: 'mean',
    normalize: true,
  });
  return Array.from(result.data);
}


export async function crawlWebsite(
  user: User,
  baseUrl: string,
  maxDepth: number = -1,
  crawlTitle: string = ""
): Promise<void> {

  const userId = user.id; 

  if (!userId) {
    throw new Error('User not authenticated');
  }

  await loadModel(); // Load the model before crawling
  const visitedUrls = new Set<string>()
  const urlsToVisit: { url: string; depth: number }[] = [
    { url: baseUrl, depth: 0 },
  ]
  const domain = new URL(baseUrl).hostname

  while (urlsToVisit.length > 0) {
    const current = urlsToVisit.pop()
    if (!current || visitedUrls.has(current.url)) continue

    const { url: currentUrl, depth: currentDepth } = current

    try {
      console.log("--- ----------------------------------- ---")
      console.log(`🕸️  Crawling: ${currentUrl} (Depth: ${currentDepth})`)
      const page_response = await getHtml(currentUrl)
      if (
        !page_response ||
        !page_response.html ||
        page_response.status !== 200
      ) {
        console.error(`🚨  Failed to load page: ${currentUrl}`)
        continue
      }
      console.log(`🕸️  Loaded page: ${page_response.html.length} characters`)
      // console.log("--- markdown PRE ---")
      // console.log(page_response.html)
      const $ = cheerio.load(page_response.html)

      // Convert HTML to Markdown and save the content
      let markdown = turndownService.turndown($.html())
      // Remove everything but the core content of the site
      const $body = $('body');
      // console.log("--- markdown POST ---")
      
      // Remove common non-relevant elements
      $body.find('header, nav, footer, script, style, iframe, aside, .sidebar, .ads, .comments, [class*="menu"], [id*="menu"], [class*="nav"], [id*="nav"], [class*="header"], [id*="header"], [class*="footer"], [id*="footer"]').remove();
      
      // Remove elements with common non-content classes or IDs
      $body.find('[class*="widget"], [id*="widget"], [class*="banner"], [id*="banner"], [class*="social"], [id*="social"], [class*="share"], [id*="share"]').remove();
      
      // Remove empty paragraphs and divs
      $body.find('p:empty, div:empty').remove();
      // console.log($body.html())
      
      // Keep only the main content area (adjust selector as needed)
      const $mainContent = $body.find('main, #content, .content, .contents, article, [role="main"]');
      
      let cleanedMarkdown = '';
      if ($mainContent.length > 0) {
        // If a main content area is found, use only that
        const cleanedHtml = $mainContent.html() || '';
        cleanedMarkdown = turndownService.turndown(cleanedHtml);
      } else {
        // If no main content area is found, use the cleaned body
        const cleanedHtml = $body.html() 
        if (!cleanedHtml || cleanedHtml.length === 0) {
          console.log("🚨  No body content found")
          continue
        }
        try { 
          cleanedMarkdown = turndownService.turndown(cleanedHtml);
        } catch (error) {
          console.log("🚨  Error turndowning body content")
          throw new Error("Error turndowning body content")
        }
      }
      
      // Further clean the markdown
      cleanedMarkdown = cleanedMarkdown
        .replace(/\n{3,}/g, '\n\n') // Remove excess newlines
        .replace(/^\s+|\s+$/g, '') // Trim leading and trailing whitespace
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Remove links but keep link text
      
      
      // Update the markdown variable with the cleaned content
      markdown = cleanedMarkdown;

      const title:string=crawlTitle||$('title').text()||currentUrl.split("/").pop()||"Untitled"
      
      await saveContent(currentUrl, markdown, title, userId)

      // Add new URLs to visit if we haven't reached the max depth
      if (maxDepth === -1 || currentDepth < maxDepth) {
        $("a").each((_, element) => {
          const href = $(element).attr("href")
          if (href && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
            try {
              const fullUrl = new URL(href, currentUrl).href
              if (fullUrl.startsWith("http") && fullUrl.includes(domain) && !visitedUrls.has(fullUrl)) {
                urlsToVisit.push({ url: fullUrl, depth: currentDepth + 1 })
              }
            } catch (error) {
              console.error(`Invalid URL: ${href}`)
            }
          }
        })
      }

      visitedUrls.add(currentUrl)
    } catch (error) {
      console.error(`Error crawling ${currentUrl}: ${error?.message}`)
    }
  }

  console.log("Crawling completed")
}

export async function saveContent(url: string, content: string, title: string, userId: string): Promise<void> {
  try {

    
    // save parent content to supabase
    const data = {
      url,
      content,
      title,
      owner_user: userId,
    };
    const { data: parentData, error: parentError } = await supabase.from("crawled_data").insert(data).select('id');
    if (parentError) {
      throw new Error(`Error inserting parent data: ${parentError.message}`);
    }

    console.log(`💾  💾 Parent data saved for URL: ${url} with id: ${parentData[0].id}\n\n`);
    // Create a text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // Split content into chunks
    const chunks = await textSplitter.splitText(content);
    console.log(`💾  >> Split content into ${chunks.length} chunks`);

    // Generate vector embeddings for all chunks at once
    
    // Loop through chunks and embeddings, saving each one individually
    for (const [i, chunk] of chunks.entries()) {
      const embedding = await getEmbedding(chunk);
      const chunkData = {
        content: chunk,
        embedding: embedding,
        parent_id: parentData[0].id,
      };

      const { error } = await supabase.from("crawled_chunks").insert(chunkData);

      if (error) {
        console.error(`Error inserting chunk ${i} for ${url}:`, error.message);
      } else {
        console.log(`💾  Saved chunk [${i}] for ${url}`);
      }
    }

    console.log(`✅  All vectorized content chunks saved for URL: ${url}`);
  } catch (error) {
    console.error(`❌  Error saving content for ${url}:`, error.message);
  }
}

export async function searchSimilarContent(user: User, query: string, limit: number = 5, tagIds: string[] = []): Promise<any[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await getEmbedding(query);

    if (!user) {
      throw new Error("User not logged in");
    }

    console.log(`🔍  Performing similarity search for query: ${query} with limit: ${limit} and tagIds: ${tagIds}`);
    
    // Ensure tagIds is an array, even if empty
    const parentIds = Array.isArray(tagIds) ? tagIds : [];
    
    // Perform the similarity search using the generated embedding
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
      user_id_input: user.id,
      parent_ids: parentIds // Make sure this matches the exact parameter name expected by your stored procedure
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error(`Error performing similarity search: ${error.message}`);
    }

    // Ensure we return an array even if data is null
    return data || [];
  } catch (error) {
    console.error('Error in searchSimilarContent:', error);
    return [];
  }
}




// Usage
// crawlWebsite("https://youtube.com", 2) // Crawl up to depth 2
