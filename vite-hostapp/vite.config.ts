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
        // example: remote_app: 'http://localhost:5001/assets/remoteEntry.js'
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
  },
});
