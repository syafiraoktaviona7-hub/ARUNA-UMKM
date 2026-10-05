import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import ArticlePage from "@/views/ArticlePage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/artikel/:id", name: "article", component: ArticlePage },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;

    if (to.hash) {
      // Beri jeda saat pindah halaman supaya elemen tujuan sudah tampil
      const wait = from.name !== to.name ? 350 : 0;
      return new Promise((resolve) =>
        setTimeout(
          () => resolve({ el: to.hash, top: 70, behavior: "smooth" }),
          wait,
        ),
      );
    }
    return { top: 0 };
  },
});
