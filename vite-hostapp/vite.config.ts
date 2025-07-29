// vite config file for hostapp
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "host_app",
      remotes: {
        remoteapp_1: "http://localhost:5251/assets/remoteEntry.js",
      },
      shared: ["vue", "primevue"],
    }),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },

  server: {
    port: 5150,
    cors: true,
  },
});
