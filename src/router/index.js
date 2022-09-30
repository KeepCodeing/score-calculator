import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/vote/:id",
    component: () => import("@/views/vote/index.vue"),
  },
  {
    path: "/create",
    component: () => import("@/views/create/index.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
