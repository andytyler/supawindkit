import { searchSimilarContent } from '$lib/server/extrapolate/extrapolate-limited-md';
import type { RequestHandler } from './$types';
import { askChatGPT } from '../../chat/llm';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { userInput, systemPrompt } = data;


  // Search for similar content
  const similarContent = await searchSimilarContent(userInput, 3); // Limit to 3 results

  // Prepare context from similar content
  const context = similarContent.map(item => item.content).join('\n\n');

  // Enhance the user input with context
  const enhancedUserInput = `Snippets:\n${context}\n\nUser Input: ${userInput}`;

  // Extract snippets for referencing
  const snippets = similarContent.map((item, index) => ({
    id: index + 1,
    content: item.content,
    source: item.source, // Assuming each item has a 'source' field indicating origin
  }));

  try {
    const stream = await askChatGPT(systemPrompt, enhancedUserInput);

    const snippetsJson = JSON.stringify(snippets);

    return new Response(new ReadableStream({
      async start(controller) {
        // Stream the AI response
        for await (const chunk of stream) {
          controller.enqueue(chunk.choices[0]?.delta?.content || '');
        }
        // Append the snippets at the end with a unique marker
        controller.enqueue(`\n### Snippets Context\n${snippetsJson}`);
        controller.close();
      }
    }), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};