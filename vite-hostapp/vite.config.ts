// vite config file for hostapp
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    federation({
      name: "host_app",
      remotes: {
        remoteapp_1: "http://localhost:5251/assets/remoteEntry.js",
      },
    }),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
  },

  server: {
    port: 5150,
    cors: true,
  },
});
