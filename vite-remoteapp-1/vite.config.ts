// vite config file for remoteapp 1
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      mode: "dev",
      name: "remoteapp_1",
      filename: "remoteEntry.js",
      remoteType: "module",
      exposes: {
        "./RemoteComponent": "./src/App.tsx",
      },
      shared: ["react", "react-dom"],
    }),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5251,
    // cors: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      // This is critical for module loading
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/javascript",
    },
  },
});
