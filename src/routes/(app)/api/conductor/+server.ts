import { askGPTWithZod } from '$lib/server/llm';
import { addExecution, executions, updateExecution } from '$lib/stores/executionStore';
import { WorkflowSchema, type LLMActivity, type LLMStep } from '$types/llm-schemas';
import { single_shot } from '../../../../lib/server/kevin/action';
import type { RequestHandler } from './$types';

const SYSTEM_PROMPT = `
You are an AI assistant that helps create workflow steps on a canvas.
Each step contains one or more activities, where activities can be of type: browse or rag. 

For RAG activities:
- Analyze the user's query to determine relevant tag IDs to search
- Include these tag IDs in the activity configuration
- Specify the search query to use

Steps can depend on outputs from previous steps - specify these dependencies using step_ids.
Return an array of steps, where each step contains:
- step_id: A unique identifier for the step
- activities: Array of activities to perform in this step
- depends_on: (Optional) Array of step_ids this step depends on

Each activity's output will automatically be available to dependent steps.
Ensure that dependencies are valid (no circular dependencies, referenced steps exist).
`;

// Add proper type definitions
type ActivityResult = Record<string, any>;
type StepResult = Record<string, any>;

// Improve error handling and typing for activity executors
async function executeBrowseActivity(activity: LLMActivity, inputs: StepResult = {}, fetch: Function, tagIds?: string[]): Promise<ActivityResult> {
  if (activity.action_type !== 'browse') {
    throw new Error('Invalid activity type provided to executeBrowseActivity');
  }

  // Create initial execution record and get the run_id
  const execution = await addExecution({
    status: 'running',
    payload: { activity },
  });
  
  try {
    const {success, output} = await single_shot(
      [], 
      null, 
      activity.goal, 
      activity.start_url, 
      [], 
      undefined, 
      execution.run_id, 
      inputs
    );

    // Update the execution with completion status
    await updateExecution(execution.run_id, {
      status: 'running',
      payload: { activity, success, output },
    });
    
    return {
      browse_result: output,  
    };

  } catch (error) {
    // Update the execution with error status
    await updateExecution(execution.run_id, {
      status: 'completed',
      payload: { activity, error: error.message },
    });
    throw error;
  }
}

async function executeRagActivity(
  activity: LLMActivity, 
  inputs: StepResult = {}, 
  fetch: Function, 
  tagIds?: any[]
): Promise<ActivityResult> {
  if (activity.action_type !== 'rag') {
    throw new Error('Invalid activity type provided to executeRagActivity');
  }

  const execution = await addExecution({
    status: 'running',
    payload: { 
      activity,
      output: {
        results: [] // Initialize empty results array
      }
    },
  });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userInput: activity.query,
        tagIds: tagIds?.map(id => id),
        systemPrompt: activity.system_prompt || '',
      })
    });

    if (!response.ok) {
      await updateExecution(execution.run_id, {
        status: 'completed',
        payload: { 
          activity, 
          error: 'RAG search failed',
          output: { results: [] }
        },
      });
      throw new Error('RAG search failed');
    }
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let snippets = [];

    while (reader) {
      const {value, done} = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      if (chunk.includes('### Snippets Context')) {
        const [content, snippetsData] = chunk.split('### Snippets Context');
        result += content;
        snippets = JSON.parse(snippetsData.trim());
        break;
      } else {
        result += chunk;
      }

      // Update execution with intermediate results
      await updateExecution(execution.run_id, {
        status: 'running',
        payload: { 
          activity,
          output: {
            results: [{
              content: result,
              source: 'RAG Search'
            }]
          }
        },
      });
    }

    // Final update with complete results
    await updateExecution(execution.run_id, {
      status: 'completed',
      payload: { 
        activity,
        success: true,
        output: {
          results: [{
            content: result,
            source: 'RAG Search'
          }],
          snippets,
          used_query: activity.query,
          used_tags: tagIds?.map(id => id) || []
        }
      },
    });

    return {
      rag_result: result,
      snippets,
      used_query: activity.query,
      used_tags: tagIds?.map(id => id) || []
    };

  } catch (error) {
    await updateExecution(execution.run_id, {
      status: 'completed',
      payload: { 
        activity, 
        error: error.message,
        output: { results: [] }
      },
    });
    throw error;
  }
}

async function executeEmailActivity(activity: LLMActivity, inputs: any = {}) {
  // TODO: Implement email sending
  return { email_sent: true };
}

async function executeGenerateActivity(activity: LLMActivity, inputs: any = {}) {
  // TODO: Implement content generation
  return { generated_content: 'placeholder' };
}

// Improve activity executor type safety
const activityExecutors: Record<string, (activity: LLMActivity, inputs: StepResult, fetch: Function, tagIds?: string[]) => Promise<ActivityResult>> = {
  browse: executeBrowseActivity,
  rag: executeRagActivity,
  email: executeEmailActivity,
  generate: executeGenerateActivity,
};

// Improved workflow execution with better error handling and typing
async function executeWorkflow(
  steps: LLMStep[], 
  fetch: Function, 
  tagIds?: any[]
): Promise<Map<string, StepResult>> {
  console.log('🚀 Starting workflow execution with steps:', steps, 'tagIds:', tagIds);
  const stepOutputs = new Map<string, StepResult>();
  const completedSteps = new Set<string>();
  const inProgressSteps = new Set<string>();

  // Validate step dependencies
  for (const step of steps) {
    if (step.depends_on) {
      console.log(`📝 Validating dependencies for step ${step.step_id}:`, step.depends_on);
      const invalidDeps = step.depends_on.filter(depId => 
        !steps.some(s => s.step_id === depId)
      );
      if (invalidDeps.length > 0) {
        throw new Error(`Invalid dependencies found: ${invalidDeps.join(', ')}`);
      }
    }
  }

  async function executeStep(step: LLMStep): Promise<boolean> {
    console.log(`⚡ Attempting to execute step ${step.step_id}`);
    
    if (inProgressSteps.has(step.step_id)) {
      console.log(`⏳ Step ${step.step_id} already in progress, skipping`);
      return false;
    }

    if (step.depends_on?.some(depId => !completedSteps.has(depId))) {
      console.log(`⏳ Dependencies not met for step ${step.step_id}, waiting...`);
      return false;
    }

    // Gather inputs from dependencies
    const inputs: StepResult = {};
    if (step.depends_on) {
      for (const depId of step.depends_on) {
        const depOutputs = stepOutputs.get(depId);
        if (!depOutputs) {
          throw new Error(`Missing outputs for dependency: ${depId}`);
        }
        Object.assign(inputs, depOutputs);
      }
    }

    inProgressSteps.add(step.step_id);

    try {
      console.log(`🏃 Executing activities for step ${step.step_id}:`, step.activities);
      // Execute activities with proper error handling
      const stepResults = await Promise.all(
        step.activities.map(async activity => {
          console.log(`📌 Executing ${activity.action_type} activity in step ${step.step_id}`);
          const executor = activityExecutors[activity.action_type];
          if (!executor) {
            throw new Error(`No executor found for activity type: ${activity.action_type}`);
          }
          return executor(activity, inputs, fetch, tagIds);
        })
      );

      console.log(`✅ Step ${step.step_id} completed successfully:`, stepResults);
      // Combine results from all activities
      const combinedResults = stepResults.reduce((acc, result) => ({...acc, ...result}), {});
      
      stepOutputs.set(step.step_id, combinedResults);
      completedSteps.add(step.step_id);
      inProgressSteps.delete(step.step_id);
      
      return true;
    } catch (error) {
      console.error(`❌ Error in step ${step.step_id}:`, error);
      throw error;
    }
  }

  let lastCompletedCount = -1;
  const maxAttempts = steps.length * 2; // Prevent infinite loops
  let attempts = 0;

  while (completedSteps.size < steps.length) {
    if (attempts++ > maxAttempts) {
      throw new Error('Workflow execution exceeded maximum attempts - possible circular dependency');
    }

    if (completedSteps.size === lastCompletedCount) {
      throw new Error('Workflow execution stalled - possible dependency deadlock');
    }
    lastCompletedCount = completedSteps.size;

    await Promise.all(
      steps
        .filter(step => !completedSteps.has(step.step_id))
        .map(executeStep)
    );
  }

  return stepOutputs;
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    console.log('📥 Received workflow request');
    const { userInput, workbenchId, tagIds } = await request.json();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('🤖 Requesting LLM response with input:', userInput);
          const llmResponse = await askGPTWithZod(
            SYSTEM_PROMPT,
            userInput,
            WorkflowSchema,
            'steps'
          );

          console.log('📊 Parsed LLM response:', llmResponse);

          if (!llmResponse) {
            throw new Error('Failed to get LLM response');
          }

          const { steps } = JSON.parse(
            llmResponse.choices[0].message.content || '{}'
          );
          
          // Execute the workflow and get results
          const workflowResults = await executeWorkflow(steps, fetch, tagIds);

          // Stream the response back to the client
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                steps,
                results: Array.from(workflowResults.entries()),
                executions
              })
            )
          );

          controller.close();
        } catch (error) {
          console.error('💥 Stream error:', error);
          controller.error(error);
          controller.close();
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error('💥 Request handler error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
