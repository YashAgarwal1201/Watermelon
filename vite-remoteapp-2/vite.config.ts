import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "remoteapp_2", // Unique name for this remote
      filename: "remoteEntry.js",
      exposes: {
        "./RemoteComponent": "./src/components/RemoteComponent.vue", // Adjust path if needed
      },
      shared: ["vue"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5252, // Use a unique port
    cors: true,
  },
  preview: {
    port: 5252,
    strictPort: true,
  },
});
