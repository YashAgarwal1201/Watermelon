// // vite config file for remoteapp 1
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import federation from "@originjs/vite-plugin-federation";
// import tailwindcss from "@tailwindcss/vite";
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       mode: "dev",
//       name: "vite_react_remoteapp",
//       filename: "remoteEntry.js",
//       remoteType: "module",
//       exposes: {
//         "./ViteReactRemoteComponent": "./src/App.tsx",
//       },
//       shared: ["react", "react-dom", "primereact"],
//     }),
//     tailwindcss(),
//     cssInjectedByJsPlugin(),
//   ],
//   build: {
//     target: "esnext",
//     minify: false,
//     cssCodeSplit: false,
//     rollupOptions: {
//       external: ["chart.js/auto", "chart.js", "quill"], // Externalize chart.js
//     },
//   },
//   server: {
//     port: 5251,
//     // cors: true,
//     cors: {
//       origin: "*",
//       methods: ["GET", "OPTIONS", "POST"],
//       allowedHeaders: ["Content-Type"],
//     },
//     headers: {
//       // This is critical for module loading
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
//       "Access-Control-Allow-Headers": "*",
//       "Content-Type": "application/javascript",
//     },
//   },
//   root: process.cwd(),
//   base: "/",
// });

// test
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin({
      injectCodeFunction: function (cssCode) {
        const escaped = cssCode
          .replace(/\\/g, "\\\\")
          .replace(/`/g, "\\`")
          .replace(/\$\{/g, "\\${");
        return (
          "(function(){try{var s=document.createElement('style');s.setAttribute('data-remote-css','1');s.textContent=`" +
          escaped +
          "`;document.head.appendChild(s);}catch(e){console.warn('css inject failed',e);}})();"
        );
      },
    }),
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
