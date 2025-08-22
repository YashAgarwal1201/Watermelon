// // vite config file for hostapp
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    federation({
      name: "host_app",
      remotes: {
        vite_react_remoteapp: "http://localhost:5251/assets/remoteEntry.js",
        vite_vue_remoteapp: "http://localhost:5252/assets/remoteEntry.js",
        remoteapp_3: "http://localhost:5253/assets/remoteEntry.js",
        vite_solidjs_remoteapp: "http://localhost:5254/assets/remoteEntry.js",
      },
    }),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
  },

  server: {
    port: 5150,
    cors: true,
  },
});

// export default defineConfig({
//   resolve: {
//     alias: {
//       vue: "vue/dist/vue.esm-bundler.js",
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
//   plugins: [
//     vue(),
//     federation({
//       name: "host_app",
//       remotes: {
//         vite_react_remoteapp: "/vite_react_remoteapp/assets/remoteEntry.js", // Use relative paths
//         vite_vue_remoteapp: "/vite_vue_remoteapp/assets/remoteEntry.js",
//       },
//       shared: ["react", "react-dom"],
//     }),
//     tailwindcss(),
//   ],
//   server: {
//     port: 5150,
//     cors: true,
//     proxy: {
//       "^/vite_react_remoteapp/assets": {
//         target: "http://localhost:5251",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/vite_react_remoteapp/, ""),
//       },
//       "^/vite_vue_remoteapp/assets": {
//         target: "http://localhost:5252",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/vite_vue_remoteapp/, ""),
//       },
//     },
//   },
//   build: {
//     target: "esnext",
//     minify: true,
//     cssCodeSplit: false,
//   },
// });
