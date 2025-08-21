import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: true, // enable for dev, disable for prod
        // hydratable: true // useful for SSR and interop cases
      },
    }),
    federation({
      name: "remoteapp_3",
      filename: "remoteEntry.js",
      exposes: {
        "./RemoteComponent3": "./src/App.svelte", // or another .svelte file you'd like to expose
      },
      shared: ["svelte"],
    }),
  ],
  server: {
    port: 5253,
    cors: true,
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
