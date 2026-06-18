import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      injectCodeFunction: function (cssCode) {
        return `(function(){
  try {
    if (typeof document === 'undefined') return;
    var s = document.createElement('style');
    s.setAttribute('data-remote-css', 'vite_react_remoteapp');
    s.textContent = ${JSON.stringify(cssCode)};
    document.head.appendChild(s);
  } catch(e) { console.warn('[vite_react_remoteapp] css inject failed', e); }
})();`;
      },
    }),
    // federation last — it processes chunks after cssInjectedByJsPlugin
    federation({
      name: "vite_react_remoteapp",
      filename: "remoteEntry.js",
      remoteType: "module",
      exposes: {
        "./ViteReactRemoteComponent": "./src/App.tsx",
      },
      shared: ["react", "react-dom", "primereact"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ["chart.js/auto", "chart.js", "quill"],
    },
  },
  server: {
    port: 5251,
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
  },
  root: process.cwd(),
  base: "/",
});
