<script lang="ts">
  import ShineText from "$components/animations/ShineText.svelte"
  import { BackgroundBeams } from "$components/ui/BackgroundBeams"
  import WaitlistSignup from "$lib/components/marketing/WaitlistSignup.svelte"
  import type { ActionData } from "./$types"
  import {
    WebsiteBaseUrl,
    WebsiteDescription,
    WebsiteName,
  } from "./../../config"

  export let data
  export let form: ActionData

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}
</svelte:head>

<BackgroundBeams />
<div class="h-screen w-screen flex flex-col justify-center items-center">
  <h2
    class="relative z-10 container bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-center font-sans text-5xl sm:text-6xl font-bold text-transparent md:text-8xl"
  >
    Work, Done.
  </h2>
  <p
    class="relative font-semibold z-10 text-center mt-4 md:mt-8 bg-gradient-to-b from-neutral-900 to-neutral-900 bg-clip-text text-transparent text-md sm:text-lg md:text-xl"
  >
    <ShineText>Coming Soon</ShineText>
  </p>

  <WaitlistSignup {form} />
</div>
