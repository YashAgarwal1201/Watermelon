import { createRouter, createWebHistory } from "vue-router";
import LandingComponent from "../components/LandingComponent.vue";
import SubPage1 from "../components/SubPage1.vue";
import SubPage2 from "../components/SubPage2.vue";

const basename = window.BASENAME || "/";

export const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingComponent,
  },
  {
    path: "/sub-page-1",
    name: "Sub Page 1",
    component: SubPage1,
    // component: () => import("../components/SubPage1.vue"),
  },
  {
    path: "/sub-page-2",
    name: "Sub Page 2",
    component: SubPage2,
    // component: () => import("../components/SubPage2.vue"),
  },
];

const routers = createRouter({
  history: createWebHistory(basename),
  routes,
});

export default routers;
