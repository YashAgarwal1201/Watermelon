import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import federation from "@originjs/vite-plugin-federation";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
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
    solid(),
    federation({
      name: "vite_solidjs_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteSolidRemoteComponent": "./src/App.tsx",
      },
      shared: ["solid-js"],
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        format: "esm",
        inlineDynamicImports: false,
      },
    },
  },
  server: {
    port: 5254,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    https: httpsConfig,
  },
  preview: {
    port: 5254,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    https: httpsConfig,
  },
});
