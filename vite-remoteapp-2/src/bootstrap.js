// src/bootstrap.js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./router";

let appInstance = null;
let routerInstance = null;

export function mount(el, { basename = "/", memory = false } = {}) {
  // Create fresh router with provided basename
  routerInstance = createRouter({
    history: createWebHistory(basename),
    routes,
  });

  // Create fresh app instance
  appInstance = createApp(App);

  appInstance.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });

  appInstance.use(routerInstance);
  appInstance.mount(el);

  return { app: appInstance, router: routerInstance };
}

export function unmount() {
  if (appInstance) {
    appInstance.unmount();
    appInstance = null;
  }
  routerInstance = null;
}

// Export default for standalone mode
export default App;
