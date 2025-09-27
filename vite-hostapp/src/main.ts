// File: main.ts

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./../router/index";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import "./style.css";

// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import { ToastService } from "primevue";

if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("watermelon-theme") || "system";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (systemDark) document.documentElement.classList.add("dark");
  }
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Make router globally available for remote Vue components
// window.__VUE_ROUTER_INSTANCE__ = router;
// window.__VUE_PROVIDE_ROUTER__ = (vueApp: any) => {
//   vueApp.provide("$router", router);
//   vueApp.provide("router", router);

//   // Provide route context that RouterView expects
//   const routeContext = {
//     value: router.currentRoute.value,
//   };
//   vueApp.provide("Symbol(route location)", routeContext);
//   vueApp.provide("injectedRoute", routeContext);
// };

app.use(ToastService);
app.use(router);
app.mount("#app");
