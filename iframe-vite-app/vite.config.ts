// File: iframe-vite-app/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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

const serverHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
  "Access-Control-Allow-Headers": "*",
  // Crucial: allow embedding as iframe inside host shell (port 5150)
  "Content-Security-Policy": "frame-ancestors 'self' https://localhost:5150 https://localhost:5173 https://127.0.0.1:5150 *",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5300,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: serverHeaders,
    https: httpsConfig,
  },
  preview: {
    port: 5300,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: serverHeaders,
    https: httpsConfig,
  },
});
