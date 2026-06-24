// import { createRouter, createWebHistory } from "vue-router";
// import LandingComponent from "../components/LandingComponent.vue";
// import SubPage1 from "../components/SubPage1.vue";
// import SubPage2 from "../components/SubPage2.vue";

// const basename = window.BASENAME || "/";

// export const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: LandingComponent,
//   },
//   {
//     path: "/sub-page-1",
//     name: "Sub Page 1",
//     component: SubPage1,
//     // component: () => import("../components/SubPage1.vue"),
//   },
//   {
//     path: "/sub-page-2",
//     name: "Sub Page 2",
//     component: SubPage2,
//     // component: () => import("../components/SubPage2.vue"),
//   },
// ];

// const routers = createRouter({
//   history: createWebHistory(basename),
//   routes,
// });

// export default routers;

// v12052026
import { createRouter, createWebHistory } from "vue-router";
import LandingComponent from "../components/LandingComponent.vue";
import SubPage1 from "../components/SubPage1.vue";
import SubPage2 from "../components/SubPage2.vue";

// Routes are defined without a basename — the basename is applied at
// router creation time in bootstrap.js (hosted) or main.ts (standalone).
export const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingComponent,
  },
  {
    path: "/timer",
    name: "Timer",
    component: SubPage1,
  },
  {
    path: "/stopwatch",
    name: "Stopwatch",
    component: SubPage2,
  },
];

// Default router for standalone mode — reads BASENAME from window if set
const basename =
  typeof window !== "undefined" ? (window as any).BASENAME || "/" : "/";

const router = createRouter({
  history: createWebHistory(basename),
  routes,
});

export default router;
