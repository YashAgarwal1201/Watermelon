// // import { fileURLToPath, URL } from "node:url";
// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
// import federation from "@originjs/vite-plugin-federation";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     vue(),
//     tailwindcss(),
//     federation({
//       name: "vite_vue_remoteapp", // Unique name for this remote
//       filename: "remoteEntry.js",
//       exposes: {
//         "./ViteVueRemoteComponent": "./src/App.vue", // Adjust path if needed
//       },
//       shared: ["vue"],
//     }),
//   ],
//   build: {
//     target: "esnext",
//     minify: false,
//     cssCodeSplit: false,
//   },
//   server: {
//     port: 5252, // Use a unique port
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
//   preview: {
//     port: 5252,
//     strictPort: true,
//   },
// });

// import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["vue"], // Force single Vue instance
  },
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: "vite_vue_remoteapp", // Unique name for this remote
      filename: "remoteEntry.js",
      exposes: {
        "./ViteVueRemoteComponent": "./src/bootstrap.js", // Adjust path if needed
      },
      shared: ["vue", "vue-router"],
    }),
    cssInjectedByJsPlugin(), // Add the CSS injection plugin
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5252, // Use a unique port
    // cors: true,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    headers: {
      // This is critical for module loading
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/javascript",
    },
  },
  preview: {
    port: 5252,
    strictPort: true,
  },
});
