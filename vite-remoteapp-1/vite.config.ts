import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host_app",
      remotes: {
        // remote_app: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
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
  },
});
