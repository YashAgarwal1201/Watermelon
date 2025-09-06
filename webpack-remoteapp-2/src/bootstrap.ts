// // src/bootstrap.ts
import { createApp, App } from "vue";
import AppComponent from "./App.vue";
import "./styles/globals.scss";
import "./styles/Home.module.scss";

let app: App<Element> | null = null;

export default {
  mount: (element: HTMLElement) => {
    if (app) {
      // If already mounted, unmount first
      app.unmount();
    }

    app = createApp(AppComponent);
    app.mount(element);
    return app;
  },
  unmount: () => {
    if (app) {
      app.unmount();
      app = null;
    }
  },
};

// src/bootstrap.ts
// import { createApp } from "vue";
// import App from "./App.vue";

// const app = createApp(App);
// app.mount("#app");

// export default app;
