// src/bootstrap.ts
import { createApp, type App as VueApp } from "vue";
import App from "./App.vue";
import "./styles/globals.scss";
import "./styles/Home.module.scss";

// Standalone mode: mount to #app if container exists in index.html
const mountElement = document.getElementById("app");
if (mountElement) {
  const app = createApp(App);
  app.mount(mountElement);
}

let appInstance: VueApp<Element> | null = null;

export const mount = (element: HTMLElement) => {
  if (appInstance) {
    appInstance.unmount();
  }
  appInstance = createApp(App);
  appInstance.mount(element);
  return appInstance;
};

export const unmount = () => {
  if (appInstance) {
    appInstance.unmount();
    appInstance = null;
  }
};

export default { mount, unmount };
