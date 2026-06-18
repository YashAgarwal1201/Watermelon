import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

// Custom plugin: collects ALL generated CSS from the bundle and injects
// it as a <style> tag via JS — replaces cssInjectedByJsPlugin entirely.
function injectCssIntoJs(): Plugin {
  const cssChunks = new Map<string, string>();

  return {
    name: "inject-css-into-js",
    apply: "build",
    generateBundle(_, bundle) {
      // Collect all CSS chunks
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "asset" && fileName.endsWith(".css")) {
          cssChunks.set(fileName, chunk.source as string);
          delete bundle[fileName]; // remove the .css file from output
        }
      }

      // Find the main JS chunk and prepend the CSS injection code
      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.isEntry) {
          const allCss = Array.from(cssChunks.values()).join("\n");
          const injection = `(function(){
  try {
    if (typeof document === 'undefined') return;
    var css = ${JSON.stringify(allCss)};
    var s = document.createElement('style');
    s.setAttribute('data-remote-css', 'vite_react_remoteapp');
    s.textContent = css;
    document.head.appendChild(s);
  } catch(e) { console.warn('[vite_react_remoteapp] css inject failed', e); }
})();\n`;
          chunk.code = injection + chunk.code;
          break;
        }
      }
    },
  };
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  plugins: [
    react(),
    injectCssIntoJs(),
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
