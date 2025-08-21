import { createRouter, createWebHistory } from "vue-router";
import RemoteWrapper from "./../src/RemoteWrapper/RemoteWrapper.vue";
import RemoteList from "../src/RemoteWrapper/RemoteList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./../src/components/Home/HomeComponent.vue"), // or any placeholder component
  },
  {
    path: "/remote",
    name: "RemoteList",
    component: RemoteList,
  },
  {
    path: "/remote/:appName",
    name: "RemoteApp",
    component: RemoteWrapper,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
