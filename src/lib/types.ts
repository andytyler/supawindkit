import { z } from "zod"


export type Activity = {
  id: string
  title: string
  type: "document" | "image" | "video" | "note" | "email"
  group: string
  content:
    | string
    | {
        to: string
        subject: string
        body: string
      }
  position: { x: number; y: number }
  zIndex: number
  config?: {
    minWidth?: string
    favicon?: string
    gridSize?: [number, number]
  }
}


// Define the click action schema
const ClickAction = z.object({
	type: z.literal("click"),
	click: z
		.object({
			x: z.number().int(),
			y: z.number().int(),
		})
		.describe("The coordinates of the click"),
});

// Define the scroll action schema
const ScrollAction = z.object({
	type: z.literal("scroll"),
	scroll: z
		.object({
			direction: z.enum(["up", "down"]),
			distance: z.number().int(),
		})
		.describe("The direction and distance of the scroll"),
});

// Define the type action schema
const TypeAction = z.object({
	type: z.literal("type"),
	text: z.string().describe("The text to type"),
});

// Define the request user input action schema
const RequestUserInputAction = z.object({
	type: z.literal("request_user_input"),
	prompt: z.string().describe("The prompt to display to the user"),
});

// Use discriminated union to ensure only one action type is allowed
const Action = z.discriminatedUnion("type", [ClickAction, ScrollAction, TypeAction, RequestUserInputAction]);

export const InteligentAction = z.object({
	previous_action_learnings: z.string().describe("Based on your expected outcome did the previous action have the outcome you expected, correctly?"),
	additional_input: z.string().describe("Do you need to request and input from the user?"),
	thoughts: z.string().describe("Your thoughts on what would be the best next action a human would take."),
	self_challenge: z.string().describe("Critique your thoughts and come up with a plan to improve your action."),
	outcome: z.string().describe("What do you expect to be the outcome of this action?"),
	GOAL_ACHIEVED: z
		.boolean()
		.describe(
			"Did the previous action achieve the goal? When deciding make sure that you have some form of confirmation the action succeeded and the goal was achieved."
		),
	action: Action,
});

export type InteligentAction = z.infer<typeof InteligentAction>;

export type EventType = { run_id: string; type: string; action: InteligentAction | null; message: string | null };
