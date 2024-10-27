import { Client } from '@notionhq/client';
import { type BlockObjectResponse, type GetPageResponse, type RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { NOTION_API_KEY } from '$env/static/private';

const notion = new Client({ auth: NOTION_API_KEY });

async function getMarkdownFromPage(pageId: string): Promise<string> {
  let markdown = '';

  // Retrieve the page

  const pageResponse: GetPageResponse = await notion.pages.retrieve({ page_id: pageId });

  console.log(pageResponse)
  // Add page title
  const titleProperty = pageResponse.properties.title as { title: Array<RichTextItemResponse> };
  markdown += `# ${titleProperty.title[0].plain_text}\n\n`;

  // Retrieve block children
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  // Process each block
  for (const [i, block] of blocks.results.entries()) {
    console.log(" >>> Enriching Block Level: ", i)
    console.log(block)
    markdown += await processBlock(block as BlockObjectResponse);
  }

  return markdown;
}

async function processBlock(block: BlockObjectResponse): Promise<string> {
  let blockContent = '';

  switch (block.type) {
    case 'paragraph':
      blockContent += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n\n';
      break;
    case 'heading_1':
      blockContent += `# ${block.heading_1.rich_text[0].plain_text}\n\n`;
      break;
    case 'heading_2':
      blockContent += `## ${block.heading_2.rich_text[0].plain_text}\n\n`;
      break;
    case 'heading_3':
      blockContent += `### ${block.heading_3.rich_text[0].plain_text}\n\n`;
      break;
    case 'bulleted_list_item':
      blockContent += `- ${block.bulleted_list_item.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'numbered_list_item':
      blockContent += `1. ${block.numbered_list_item.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'to_do':
      const checkbox = block.to_do.checked ? '[x]' : '[ ]';
      blockContent += `${checkbox} ${block.to_do.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'image':
      const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      blockContent += `![Image](${imageUrl})\n\n`;
      break;
    case 'code':
      blockContent += `\`\`\`${block.code.language}\n${block.code.rich_text[0].plain_text}\n\`\`\`\n\n`;
      break;
    case 'child_page':
      // Recursively process child pages
      blockContent += await getMarkdownFromPage(block.id);
      break;
    // Add more cases for other block types as needed
  }

  // If the block has children, process them recursively
  if (block.has_children) {
    const childBlocks = await notion.blocks.children.list({ block_id: block.id });
    for (const childBlock of childBlocks.results) {
      blockContent += await processBlock(childBlock as BlockObjectResponse);
    }
  }

  return blockContent;
}

export async function getNotionPageAsMarkdown(pageId: string): Promise<string> {
  try {
    return await getMarkdownFromPage(pageId);
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return 'Error fetching Notion page content.';
  }
}
