import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    solid(),
    federation({
      name: "vite_solidjs_remoteapp",
      filename: "remoteEntry.js",
      exposes: {
        "./ViteSolidRemoteComponent": "./src/App.tsx", // or another .tsx you'd like to expose
      },
      shared: ["solid-js"],
    }),
  ],
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
