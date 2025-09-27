import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Force Svelte 4 compatibility to avoid effect_orphan
        compatibility: {
          componentApi: 4,
        },
      },
    }),
  ],

  server: {
    port: 5253,
  },
});
