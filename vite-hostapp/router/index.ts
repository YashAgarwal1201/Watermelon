import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../src/components/Home/HomeComponent.vue"),
  },
  {
    path: "/remote",
    name: "RemoteList",
    component: () => import("../src/RemoteWrapper/RemoteList.vue"),
  },
  {
    path: "/remote/:appName/:pathMatch(.*)*",
    name: "RemoteApp",
    component: () => import("../src/RemoteWrapper/RemoteWrapper.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
