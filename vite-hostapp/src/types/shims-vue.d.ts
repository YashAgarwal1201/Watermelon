// File: types/shims-vue.d.ts

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    BASENAME: string;
    __VUE_ROUTER_INSTANCE__: any;
    __VUE_PROVIDE_ROUTER__: any;
  }
}

export {};
