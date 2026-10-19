// // vite config file for hostapp

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const certPath = path.resolve(__dirname, "../certs/localhost.pem");
  const keyPath = path.resolve(__dirname, "../certs/localhost-key.pem");
  const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
  const httpsConfig = hasCerts
    ? {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      }
    : undefined;

  const sanitizeUrl = (url: string) => url.replace(/\/+$/, "");

  const viteReactUrl = sanitizeUrl(env.VITE_REMOTE_VITE_REACT_URL ?? "https://localhost:5251");
  const viteVueUrl = sanitizeUrl(env.VITE_REMOTE_VITE_VUE_URL ?? "https://localhost:5252");
  const viteSvelteUrl = sanitizeUrl(env.VITE_REMOTE_VITE_SVELTE_URL ?? "https://localhost:5253");
  const viteSolidUrl = sanitizeUrl(env.VITE_REMOTE_VITE_SOLID_URL ?? "https://localhost:5254");
  const webpackReactUrl = sanitizeUrl(env.VITE_REMOTE_WEBPACK_REACT_URL ?? "https://localhost:5161");
  const webpackVueUrl = sanitizeUrl(env.VITE_REMOTE_WEBPACK_VUE_URL ?? "https://localhost:5162");

  return {
    plugins: [
      vue(),
      federation({
        name: "host_app",
        remotes: {
          vite_react_remoteapp: `${viteReactUrl}/assets/remoteEntry.js`,
          vite_vue_remoteapp: `${viteVueUrl}/assets/remoteEntry.js`,
          vite_svelte_remoteapp: `${viteSvelteUrl}/assets/remoteEntry.js`,
          vite_solidjs_remoteapp: `${viteSolidUrl}/assets/remoteEntry.js`,
          webpack_react_remoteapp: {
            external: `${webpackReactUrl}/remoteEntry.js`,
            from: "webpack",
            format: "var",
          },
          webpack_vue_remoteapp: {
            external: `${webpackVueUrl}/remoteEntry.js`,
            from: "webpack",
            format: "var",
          },
          // angular_remoteapp: "https://localhost:4201/remoteEntry.json",
        } as any,
        shared: ["react", "react-dom", "vue", "vue-router"],
      }),
      tailwindcss(),
    ],

    build: {
      target: "esnext",
      minify: true,
      cssCodeSplit: false,
      rollupOptions: {
        external: ["chart.js/auto", "chart.js", "quill"], // Externalize chart.js
        output: {
          format: "esm",
          entryFileNames: "assets/[name].js",
          minifyInternalExports: false,
        },
      },
    },

    server: {
      port: 5150,
      cors: true,
      https: httpsConfig,
    },
    preview: {
      port: 5150,
      cors: true,
      https: httpsConfig,
    },
  };
});

