// File: wc-lit-app/vite.config.ts

import { defineConfig, type Plugin } from "vite";
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

// Dev middleware: rewrites /main.js -> /src/main.ts so host can load the CE module in dev mode
function serveMainJsPlugin(): Plugin {
  return {
    name: "serve-main-js",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === "/main.js" || req.url?.startsWith("/main.js?")) {
          req.url = req.url.replace("/main.js", "/src/main.ts");
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [serveMainJsPlugin()],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "WmNotificationCenter",
      formats: ["es"],
      fileName: () => "main.js",
    },
  },
  server: {
    port: 5302,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
      "Access-Control-Allow-Headers": "*",
    },
    https: httpsConfig,
  },
  preview: {
    port: 5302,
    strictPort: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
      "Access-Control-Allow-Headers": "*",
    },
    https: httpsConfig,
  },
});
