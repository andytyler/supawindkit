import { askGPTWithZod } from '$lib/server/llm';
import { executions } from '$lib/stores/executionStore';
import { ActivitySchema } from '$types/llm-schemas';
import { v4 as uuidv4 } from 'uuid';
import { single_shot } from '../(kevin)/execute-enigmatic/action';
import type { RequestHandler } from './$types';

const SYSTEM_PROMPT = `
You are an AI assistant that helps create activities on a canvas.
Each activity should have a specific type (browse, rag, email, or generate) with appropriate actions.
Return an array of activities based on the user's request.
`;

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { userInput, workbenchId } = await request.json();
    console.log('👘  userInput', userInput);
    // const session = await locals.auth.getUser();

    // if (!session?.user) {
    //   console.log('👘  Unauthorized');
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const llmResponse = await askGPTWithZod(
            SYSTEM_PROMPT,
            userInput,
            ActivitySchema,
            'activities'
          );

          if (!llmResponse) {
            throw new Error('Failed to get LLM response');
          }

          const { activities } = JSON.parse(
            llmResponse.choices[0].message.content || '{}'
          );
          console.log('👘  Activities', activities);


          // For browse activities, execute enigmatic action
          for (const activity of activities) {
            if (activity.action_type === 'browse') {
              console.log('👘👘👘  BROWSE activity DETECTED!! ', activity);
              const run_id = uuidv4();
              executions.update((execs) => [
                ...execs,
                {
                  run_id,
                  goal: activity.goal,
                  site: activity.start_url,
                  status: 'running',
                },
              ]);
              // Start the execution process in the background
              process(activity.start_url, activity.goal, run_id).catch((error) =>
                console.error(`Error in execution ${run_id}:`, error)
              );
            }
          }

          async function process(site: string, goal: string, run_id: string) {
            try {
              await single_shot(
                [],
                null,
                goal,
                site,
                [],
                undefined,
                run_id
              );
              // Optionally, update the execution status upon completion
              console.log(`Execution ${run_id} completed.`);
            } catch (error) {
              console.error(`Error in execution ${run_id}:`, error);
            }
          }

          // Stream the response back to the client
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                activities,
                executions,
                // recordIds: insertedActivities.map(record => record.id)
              })
            )
          );

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
