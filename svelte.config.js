import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: {
      $components: resolve(__dirname, "./src/lib/components"),
      $lib: resolve(__dirname, "./src/lib"),
      $utils: resolve(__dirname, "./src/lib/utils"),
      $server: resolve(__dirname, "./src/lib/server"),
      $types: resolve(__dirname, "./src/lib/types"),
      $stores: resolve(__dirname, "./src/stores"),
      $config: resolve(__dirname, "./src/config"),
    },
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
}

export default config
