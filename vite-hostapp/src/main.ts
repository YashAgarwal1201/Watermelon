import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./../router/index";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import "./style.css";
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
app.use(ToastService);
app.use(router);
app.mount("#app");
