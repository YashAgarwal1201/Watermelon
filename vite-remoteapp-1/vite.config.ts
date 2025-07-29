// vite config file for remoteapp 1
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remoteapp_1",
      filename: "remoteEntry.js",
      exposes: {
        "./RemoteComponent": "./src/App.tsx",
      },
      shared: ["vue", "primevue"],
    }),
    tailwindcss(), // ✅ official plugin
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: true,
  },
  server: {
    port: 5251,
    cors: true,
  },
});
