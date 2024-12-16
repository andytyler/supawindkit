<script lang="ts">
  import Button from "$components/ui/button/button.svelte"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$components/ui/card"
  import { pricingPlans } from "./pricing_plans"

  export let highlightedPlanId: string = "pro"
  export let callToAction: string
  export let currentPlanId: string = ""
  export let center = true
</script>

<div class="w-full px-4 py-8">
  <div
    class="mx-auto grid max-w-7xl gap-8 {center ? 'place-content-center' : ''} 
    grid-cols-1 lg:grid-cols-3"
  >
    {#each pricingPlans as plan}
      <Card
        class="relative flex h-full flex-col {plan.id === highlightedPlanId
          ? 'border-primary ring-1 ring-primary'
          : 'border-border'}"
      >
        {#if plan.id === highlightedPlanId}
          <div
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-8 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Popular
          </div>
        {/if}

        <CardHeader class="flex flex-col space-y-1.5 pb-8">
          <CardTitle class="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription class="text-base text-muted-foreground">
            {plan.description}
          </CardDescription>
        </CardHeader>

        <CardContent class="flex flex-col space-y-6">
          <div class="flex items-baseline">
            <span class="text-4xl font-bold tracking-tight">
              {plan.price || "Talk to Sales"}
            </span>
            {#if plan.priceIntervalName}
              <span class="ml-2 text-muted-foreground"> per month </span>
            {/if}
          </div>

          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground">
              Plan includes:
            </h4>
            <ul class="space-y-3">
              {#each plan.features as feature}
                <li class="flex items-center gap-2">
                  <svg
                    class="h-5 w-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.75 12.75L10 15.25L16.25 8.75"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-base">{feature}</span>
                </li>
              {/each}
            </ul>
          </div>
        </CardContent>

        <CardFooter class="mt-auto pt-8">
          {#if plan.id === "enterprise"}
            <Button variant="secondary" size="lg" class="w-full" href={`/#cal`}>
              Talk to Sales
            </Button>
          {:else}
            <Button
              variant={plan.id === currentPlanId ? "secondary" : "default"}
              size="lg"
              class="w-full  {plan.id === currentPlanId
                ? 'bg-muted'
                : 'bg-primary'}"
              disabled={plan.id === currentPlanId}
              href={plan.id === currentPlanId
                ? undefined
                : `/account/subscribe/${plan?.stripe_price_id ?? "free_plan"}`}
            >
              {plan.id === currentPlanId ? "Current Plan" : callToAction}
            </Button>
          {/if}
        </CardFooter>
      </Card>
    {/each}
  </div>
</div>
