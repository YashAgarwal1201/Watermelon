import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.url),
  routes: [
    // {
    //   path: "/",
    //   name: "landing",
    //   component: LandingPage,
    //   meta: { title: "Welcome to Orchid Store" },
    // },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const { showToast } = toastHandler();

//   // Check if cookie exists more reliably
//   const hasAccountCookie = document.cookie
//     .split(";")
//     .map((cookie) => cookie.trim())
//     .some((cookie) => cookie.startsWith("OrchidStoreLoginAccount="));

//   // If going to landing page and already logged in
//   if (to.path === "/" && hasAccountCookie) {
//     showToast(
//       "info",
//       "User is logged in",
//       "You are already logged in, navigating you to products page"
//     );
//     return next("/products");
//   }

//   // If going to protected pages and NOT logged in
//   if (
//     (to.path === "/products" ||
//       to.path.startsWith("/products/") ||
//       to.path === "/profile" ||
//       to.path === "/trending") &&
//     !hasAccountCookie
//   ) {
//     showToast(
//       "warn",
//       "Authentication required",
//       "Please log in to access this page"
//     );
//     return next("/");
//   }

//   // Otherwise proceed normally
//   next();
// });

export default router;
