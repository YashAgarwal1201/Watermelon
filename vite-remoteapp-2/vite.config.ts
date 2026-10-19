import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
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

function injectCssIntoJs(): Plugin {
  const cssChunks = new Map<string, string>();

  return {
    name: "inject-css-into-js",
    apply: "build",
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "asset" && fileName.endsWith(".css")) {
          cssChunks.set(fileName, chunk.source as string);
          delete bundle[fileName];
        }
      }

      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.isEntry) {
          const allCss = Array.from(cssChunks.values()).join("\n");
          const injection = `(function(){
  try {
    if (typeof document === 'undefined') return;
    var css = ${JSON.stringify(allCss)};
    var s = document.createElement('style');
    s.setAttribute('data-remote-css', 'vite_vue_remoteapp');
    s.textContent = css;
    document.head.appendChild(s);
  } catch(e) { console.warn('[vite_vue_remoteapp] css inject failed', e); }
})();\n`;
          chunk.code = injection + chunk.code;
          break;
        }
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["vue"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    injectCssIntoJs(),
    federation({
      name: "vite_vue_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteVueRemoteComponent": "./src/bootstrap.js",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5252,
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
    port: 5252,
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
