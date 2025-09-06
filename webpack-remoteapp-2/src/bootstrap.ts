// src/bootstrap.ts
import { createApp, App as VueApp } from "vue";
import App from "./App.vue";
import "./styles/globals.scss";

let app: VueApp<Element> | null = null;

export function mount(selectorOrEl: string | Element) {
  const el = typeof selectorOrEl === "string" ? document.querySelector(selectorOrEl)! : selectorOrEl;
  if (!el) throw new Error("Mount target not found.");
  if (app) return app;
  app = createApp(App);
  app.mount(el);
  return app;
}

export function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }
}
