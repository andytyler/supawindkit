import { PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import getHtml from "$lib/utils/fetch-wrapper";
import type { User } from '@supabase/supabase-js';
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import supabase from "../../supabase";

const nhm = new NodeHtmlMarkdown()

// Use the Xenova model port
// const MODEL_NAME = 'Supabase/gte-small';
// let embeddingPipeline: FeatureExtractionPipeline;

// async function loadModel() {
//   embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME, {
//     quantized: false,
//     revision: 'main',
//     progress_callback: (progress: any) => {
//       console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
//     },
//     env: 'browser',
//     wasmPath: 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1/dist/',
//     config: {
//       runtime: 'web'
//     }
//   });
//   console.log('Embedding Model loaded');
// }

async function getEmbedding(search: string): Promise<number[]> {
  try {
    console.log("Getting embedding for text: ", search);

    const response = await fetch('https://ayhnablqxweiozejicwg.supabase.co/functions/v1/generate-embedding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ search })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Generated embedding:', data);

    return data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
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
      console.log(`🕸��  Crawling: ${currentUrl} (Depth: ${currentDepth})`)
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
        cleanedMarkdown = nhm.translate(cleanedHtml);
      } else {
        // If no main content area is found, use the cleaned body
        const cleanedHtml = $body.html() 
        if (!cleanedHtml || cleanedHtml.length === 0) {
          console.log("🚨  No body content found")
          continue
        }
        try { 
          cleanedMarkdown = nhm.translate(cleanedHtml);
        } catch (error) {
          console.log("🚨  Error converting HTML to markdown")
          throw new Error("Error converting HTML to markdown")
        }
      }
      
      // Further clean the markdown
      cleanedMarkdown = cleanedMarkdown
        .replace(/\n{3,}/g, '\n\n') // Remove excess newlines
        .replace(/^\s+|\s+$/g, '') // Trim leading and trailing whitespace
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Remove links but keep link text
      
      
      // Update the markdown variable with the cleaned content
      let markdown = cleanedMarkdown;

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
        console.log(`���  Saved chunk [${i}] for ${url}`);
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
    console.log("SEARCH Query embedding: ", queryEmbedding);

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
