import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import path from "path"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: {
      $components: path.resolve("./src/lib/components"), // Define the $lib alias
      $lib: path.resolve("./src/lib"), // Define the $lib alias
      $utils: path.resolve("./src/lib/utils"), // Define the $lib alias
      $server: path.resolve("./src/lib/server"), // Define the $lib alias
      $types: path.resolve("./src/lib/types"), // Define the $lib alias
      $stores: path.resolve("./src/stores"), // Define the $lib alias
    },

    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
}

export default config
