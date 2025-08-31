// import { defineConfig } from "vite";
// import solid from "vite-plugin-solid";
// import federation from "@originjs/vite-plugin-federation";

// export default defineConfig({
//   plugins: [
//     solid(),
//     federation({
//       name: "vite_solidjs_remoteapp",
//       filename: "remoteEntry.js",
//       exposes: {
//         "./ViteSolidRemoteComponent": "./src/App.tsx", // or another .tsx you'd like to expose
//       },
//       shared: ["solid-js"],
//     }),
//   ],
//   build: {
//     target: "esnext",
//     minify: false,
//     cssCodeSplit: false,
//     rollupOptions: {
//       output: {
//         format: "esm",
//         inlineDynamicImports: false,
//       },
//     },
//   },
//   server: {
//     port: 5254,
//     cors: true,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*",
//       "Content-Type": "application/javascript",
//     },
//   },
//   preview: {
//     port: 5254,
//     strictPort: true,
//   },
// });

import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import federation from "@originjs/vite-plugin-federation";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    solid(),
    federation({
      name: "vite_solidjs_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteSolidRemoteComponent": "./src/App.tsx", // or your actual exposed file
      },
      shared: ["solid-js"],
    }),

    // This plugin bundles CSS into remoteEntry.js so styles load correctly in federated host
    // cssInjectedByJsPlugin({
    //   jsAssetsFilterFunction: (outputChunk) =>
    //     outputChunk.fileName === "remoteEntry.js",
    // }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false, // critical for CSS injection stability
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        format: "esm",
        inlineDynamicImports: false,
      },
    },
  },
  server: {
    port: 5254,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/javascript",
    },
  },
  preview: {
    port: 5254,
    strictPort: true,
  },
});
