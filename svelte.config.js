import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { resolve } from "path"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: {
      $components: resolve("./src/lib/components"),
      $lib: resolve("./src/lib"),
      $utils: resolve("./src/lib/utils"),
      $server: resolve("./src/lib/server"),
      $types: resolve("./src/lib/types"),
      $stores: resolve("./src/stores"),
      $config: resolve("./src/config"),
    },
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
}

export default config
