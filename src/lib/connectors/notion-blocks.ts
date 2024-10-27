import { Client } from '@notionhq/client';
import {
  type BlockObjectResponse,
  type GetPageResponse,
  type RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';

import { NOTION_API_KEY } from '$env/static/private';

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Retrieves all blocks from a Notion page and converts them into an array of markdown strings.
 * Each string represents a block and its nested children in markdown format.
 * 
 * @param pageId - The ID of the Notion page to retrieve.
 * @returns A promise that resolves to an array of markdown strings.
 */
export async function getNotionPageAsMarkdownArray(pageId: string): Promise<string[]> {
  try {
    const pageResponse: GetPageResponse = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });

    const markdownArray: string[] = [];

    // Add page title
    const titleProperty = pageResponse.properties.title as { title: Array<RichTextItemResponse> } || "undefined title";
    if (titleProperty.title.length > 0) {
      const titleText = titleProperty.title.map(text => text.plain_text).join('');
      markdownArray.push(`# ${titleText}\n`);
    }

    // Process each top-level block
    for (const block of blocks.results) {
      const blockMarkdown = await processBlock(block as BlockObjectResponse);
      if (blockMarkdown) {
        markdownArray.push(blockMarkdown);
      }
    }

    return markdownArray;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return [];
  }
}

/**
 * Recursively processes a Notion block and its children, converting them into a markdown string.
 * 
 * @param block - The Notion block to process.
 * @returns A promise that resolves to a markdown string representing the block and its children.
 */
async function processBlock(block: BlockObjectResponse): Promise<string> {
  let markdown = '';

  // Convert the current block to markdown
  switch (block.type) {
    case 'paragraph':
      markdown += `${block.paragraph.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'heading_1':
      markdown += `# ${block.heading_1.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'heading_2':
      markdown += `## ${block.heading_2.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'heading_3':
      markdown += `### ${block.heading_3.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'bulleted_list_item':
      markdown += `- ${block.bulleted_list_item.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'numbered_list_item':
      markdown += `1. ${block.numbered_list_item.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'to_do':
      const checkbox = block.to_do.checked ? '[x]' : '[ ]';
      markdown += `${checkbox} ${block.to_do.rich_text.map(text => text.plain_text).join('')}\n`;
      break;
    case 'image':
      const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      markdown += `![Image](${imageUrl})\n\n`;
      break;
    case 'code':
      const codeLanguage = block.code.language || 'plaintext';
      const codeContent = block.code.rich_text.map(text => text.plain_text).join('');
      markdown += `\`\`\`${codeLanguage}\n${codeContent}\n\`\`\`\n\n`;
      break;
    case 'quote':
      markdown += `> ${block.quote.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'callout':
      markdown += `> [!${block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : '🔔'}] ${block.callout.rich_text.map(text => text.plain_text).join('')}\n\n`;
      break;
    case 'toggle':
      markdown += `<details>\n<summary>${block.toggle.rich_text.map(text => text.plain_text).join('')}</summary>\n\n`;
      break;
    // Add more cases for other block types as needed
    default:
      // Skip unsupported block types
      return '';
  }

  // If the block has children, process them recursively
  if (block.has_children) {
    const childBlocks = await notion.blocks.children.list({ block_id: block.id, page_size: 100 });
    for (const childBlock of childBlocks.results) {
      const childMarkdown = await processBlock(childBlock as BlockObjectResponse);
      if (childMarkdown) {
        markdown += childMarkdown;
      }
    }

    // Close HTML tags if necessary
    if (block.type === 'toggle') {
      markdown += `</details>\n\n`;
    }
  }

  return markdown;
}
