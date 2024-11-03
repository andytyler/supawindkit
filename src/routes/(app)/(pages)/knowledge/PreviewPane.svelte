<script lang="ts">
  import { chatStore } from "$lib/stores/chatStore"
  const VIEWPORT_SIZE = 512 // also edit in puppeteer.ts
  const RENDER_SIZE = 512
  export let run_id: string

  $: chats = $chatStore[run_id] || []

  // Get the latest action event
  $: latestActionEvent = chats
    .filter(
      (chat) =>
        chat.type === "click" ||
        chat.type === "scroll" ||
        chat.type === "screenshot",
    )
    .pop()

  $: latestAction = latestActionEvent?.action

  // URL and Screenshot are message-only events
  $: latestNavigationURL =
    chats.filter((chat) => chat.type === "url").pop()?.message ||
    "https://lets.go"
  $: latestScreenshotURL =
    chats.filter((chat) => chat.type === "screenshot").pop()?.message ||
    "https://lets.go"

  // Click specific properties
  $: clickX =
    latestAction?.action?.type === "click"
      ? latestAction.action.click.x
      : undefined
  $: clickY =
    latestAction?.action?.type === "click"
      ? latestAction.action.click.y
      : undefined

  // Scroll specific properties
  $: scrollDirection =
    latestAction?.action?.type === "scroll"
      ? latestAction.action.scroll.direction
      : undefined
  $: scrollDistance =
    latestAction?.action?.type === "scroll"
      ? latestAction.action.scroll.distance
      : undefined
</script>

<div
  class="relative border border-border p-4 bg-card text-card-foreground w-full max-w-min h-full"
>
  <div class="flex flex-col gap-4 w-full">
    <h2 class="text-lg font-semibold">Latest Action</h2>

    <!-- Browser Preview -->
    <div
      class={`relative min-w-min min-h-min w-[${RENDER_SIZE}px] h-[${RENDER_SIZE + 8}px] bg-gray-100 rounded-md overflow-hidden shadow-lg border border-border`}
      style="width: {RENDER_SIZE}px; height: {RENDER_SIZE + 8}px;"
    >
      <!-- Browser toolbar -->
      <div class="relative h-8 bg-gray-200 flex items-center px-4">
        <div class="absolute flex flex-row gap-2 items-center">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <!-- URL -->
        <div class="flex-grow flex justify-center">
          <div
            class="w-1/2 rounded border border-border/10 text-center h-5 px-2 text-[10px] flex items-center"
          >
            <span class="text-gray-500 text-center w-full"
              >{latestNavigationURL}</span
            >
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class={`relative w-[${RENDER_SIZE}px] h-[${RENDER_SIZE}px]`}>
        {#if latestAction && typeof latestAction === "object" && "action" in latestAction && latestAction.action.type === "click"}
          <div
            id="click-spotlight"
            class="absolute z-50 w-4 h-4 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"
            style="left: {clickX
              ? (clickX / VIEWPORT_SIZE) * 100
              : 0}%; top: {clickY ? (clickY / VIEWPORT_SIZE) * 100 : 0}%"
          ></div>
        {/if}
        <img
          src={latestScreenshotURL}
          alt="Screenshot"
          class={`w-[${RENDER_SIZE}px] h-[${RENDER_SIZE}px] `}
        />
      </div>
    </div>
  </div>

  {#if latestAction}
    <h2 class="text-lg font-semibold mt-6 mb-3">Action Metadata</h2>
    <div
      class="bg-card rounded-lg p-4 text-card-foreground shadow-md border border-border/50"
    >
      <!-- Top Metadata bar -->
      <div
        class={`flex items-center justify-between mb-4 p-3 rounded-lg ${latestAction?.GOAL_ACHIEVED ? "bg-green-500" : "bg-red-500"} text-primary-foreground`}
      >
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-bold text-lg">{latestAction?.action?.type}</span>
        </div>
        <span
          class="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold"
        >
          {latestAction?.action?.type}
        </span>
      </div>

      <!-- Action specifics -->
      <div class="grid grid-cols-2 gap-4 mb-4 overflow-y-scroll">
        {#if latestAction?.action?.type === "click"}
          <div class="col-span-2 sm:col-span-1">
            <p class="text-sm font-medium text-muted-foreground">
              Click Coordinates
            </p>
            <p class="text-lg">X: {clickX}, Y: {clickY}</p>
          </div>
        {/if}
        {#if latestAction?.action?.type === "scroll"}
          <div>
            <p class="text-sm font-medium text-muted-foreground">
              Scroll Direction
            </p>
            <p class="text-lg">{scrollDirection}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-muted-foreground">
              Scroll Distance
            </p>
            <p class="text-lg">{scrollDistance}</p>
          </div>
        {/if}
        <div class="col-span-2 sm:col-span-1">
          <p class="text-sm font-medium text-muted-foreground">Goal Achieved</p>
          <p class="text-lg">{latestAction?.GOAL_ACHIEVED ? "Yes" : "No"}</p>
        </div>
      </div>

      <div class="flex flex-col gap-2 text-xs mb-4">
        <p class="">
          <span class="font-semibold">Previous Action Learnings:</span>
          {latestAction?.previous_action_learnings}
        </p>
        <p class="">
          <span class="font-semibold">Thoughts:</span>
          {latestAction?.thoughts}
        </p>
        <p class="">
          <span class="font-semibold">Explanation:</span>
          {latestAction?.explanation}
        </p>
        <p class="">
          <span class="font-semibold">Self Challenge:</span>
          {latestAction?.self_challenge}
        </p>
      </div>
    </div>
  {/if}
</div>
