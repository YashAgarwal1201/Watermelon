// src/boobstrap.ts
import { createApp } from "vue";
import App from "./App.vue";
import "./styles/globals.scss";
import "./styles/Home.module.scss";

const app = createApp(App);
app.mount("#app");

export default app;
