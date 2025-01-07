import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
  ],
  optimizeDeps: {
    include: [
      // '@tiptap/core',
      // '@tiptap/starter-kit',
      // '@tiptap/extension-mention',
      // '@tiptap/extension-placeholder',
      // 'cheerio',
      // '@xenova/transformers',
      // 'node-fetch',
      // 'axios',
      // 'puppeteer',
      // 'waterfall-fetch',
      // 'zod',
      // 'zod-to-json-schema'
    ]
  },
  ssr: {
    noExternal: [
      // '@tiptap/core',
      // '@tiptap/starter-kit',
      // '@tiptap/extension-mention',
      // '@tiptap/extension-placeholder',
      // 'zod',
      // 'zod-to-json-schema',
      // '@xenova/transformers',
      // 'cheerio',
      // 'waterfall-fetch'
    ]
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    globals: true, /// allows to skip import of test functions like `describe`, `it`, `expect`, etc.
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        /^node:/  // Mark node built-ins as external
      ],
      output: {
        format: 'esm'
      }
    }
  }
})
