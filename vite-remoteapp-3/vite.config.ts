import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    svelte(),
    federation({
      name: "vite_svelte_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteSvelteRemoteComponent": "./src/App.svelte", // or another .svelte file you'd like to expose
      },
      shared: ["svelte"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "esm",
        inlineDynamicImports: false,
      },
    },
  },
  server: {
    port: 5253,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/javascript",
    },
  },
  preview: {
    port: 5253,
    strictPort: true,
  },
});
