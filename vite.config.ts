import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    // {
    //   name: "vite-build-search-index",
    //   writeBundle: {
    //     order: "post",
    //     sequential: false,
    //     handler: async () => {
    //       console.log("Building search index...")
    //       await buildAndCacheSearchIndex()
    //     },
    //   },
    // },
  ],
  optimizeDeps: {
    include: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-mention',
      '@tiptap/extension-placeholder'
    ]
  },
  ssr: {
    noExternal: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-mention',
      '@tiptap/extension-placeholder'
    ]
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    globals: true, /// allows to skip import of test functions like `describe`, `it`, `expect`, etc.
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MIXED_EXPORTS') return;
        warn(warning);
      }
    }
  }
})
