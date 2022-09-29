import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/vote/:id",
    component: () => import("@/views/vote/index.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
