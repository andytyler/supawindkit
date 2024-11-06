import { z } from "zod";


// Activity-specific payload schemas
const BrowsePayload = z.object({
  action_type: z.literal('browse'),
  start_url: z.string(),
  goal: z.string().optional(),
});

const RagPayload = z.object({
  action_type: z.literal('rag'),
  query: z.string(),
  context_ids: z.array(z.string()),
});

const EmailPayload = z.object({
  action_type: z.literal('email'),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  attachments: z.array(z.string()).optional(),
});


const ActivityPayload = z.discriminatedUnion('action_type', [
  BrowsePayload,
  // RagPayload,
  // EmailPayload,
]);

// // Activity schemas using discriminated union
// export const ActivitySchema = z.object({
//   activities: z.array(ActivityPayload)
// });

// export type LLMActivity = z.infer<typeof ActivitySchema>['activities'][number];

// // ... existing imports ...

// Add a Step schema that contains activities and metadata
const StepSchema = z.object({
  step_id: z.string(),
  activities: z.array(ActivityPayload),
  depends_on: z.array(z.string()).optional(), // Array of step_ids this step depends on
});

// Update the main schema to use steps instead of direct activities
export const WorkflowSchema = z.object({
  steps: z.array(StepSchema)
});

export type LLMStep = z.infer<typeof WorkflowSchema>['steps'][number];
export type LLMActivity = z.infer<typeof StepSchema>['activities'][number];