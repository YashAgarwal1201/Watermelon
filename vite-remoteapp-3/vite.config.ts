import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import federation from "@originjs/vite-plugin-federation";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certPath = path.resolve(__dirname, "../certs/localhost.pem");
const keyPath = path.resolve(__dirname, "../certs/localhost-key.pem");
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
const httpsConfig = hasCerts
  ? {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    }
  : undefined;

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
    federation({
      name: "vite_svelte_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteSvelteRemoteComponent": "./src/App.svelte",
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
    },
    https: httpsConfig,
  },
  preview: {
    port: 5253,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    https: httpsConfig,
  },
});
