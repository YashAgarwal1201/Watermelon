// // vite config file for hostapp
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

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
//         remoteapp_1: "http://localhost:5251/assets/remoteEntry.js",
//         remoteapp_2: "http://localhost:5252/assets/remoteEntry.js",
//       },
//     }),
//     tailwindcss(),
//   ],
//   build: {
//     target: "esnext",
//     minify: true,
//     cssCodeSplit: false,
//   },

//   server: {
//     port: 5150,
//     cors: true,
//   },
// });

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
        remoteapp_1: "/remoteapp_1/assets/remoteEntry.js", // Use relative paths
        remoteapp_2: "/remoteapp_2/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
    tailwindcss(),
  ],
  server: {
    port: 5150,
    cors: true,
    proxy: {
      "^/remoteapp_1/assets": {
        target: "http://localhost:5251",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/remoteapp_1/, ""),
      },
      "^/remoteapp_2/assets": {
        target: "http://localhost:5252",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/remoteapp_2/, ""),
      },
    },
  },
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
  },
});
