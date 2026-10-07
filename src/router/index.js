
import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import ProdukPage from "@/views/ProdukPage.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import CustomerRegisterPage from "@/views/CustomerRegisterPage.vue";

import { articles } from "@/data/articles";
import { adminRoutes, installAdminGuard } from "./adminRoutes";

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
        },

        {
            path: "/produk",
            name: "products",
            component: ProdukPage,
        },

        {
            path: "/register",
            name: "register",
            component: RegisterPage,
            meta: {
                bare: true,
            },
        },

        {
            path: "/register/customer",
            name: "customer-register",
            component: CustomerRegisterPage,
            meta: {
                bare: true,
            },
        },

        {
            path: "/artikel/:id",
            name: "article",
            component: ArticlePage,

            // Artikel yang tidak ada -> tampilkan 404 tanpa mengubah alamat
            beforeEnter: (to) => {
                const exists = articles.some(
                    (a) => String(a.id) === String(to.params.id),
                );

                if (exists) {
                    return true;
                }

                return {
                    name: "notfound",
                    params: {
                        pathMatch: to.path.substring(1).split("/"),
                    },
                    query: to.query,
                    hash: to.hash,
                };
            },
        },

        // Route admin harus sebelum route catch-all
        ...adminRoutes,

        // Semua alamat lain yang tidak dikenal
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: NotFoundPage,
        },
    ],

    scrollBehavior(to, from, saved) {
        if (saved) {
            return saved;
        }

        if (to.hash) {
            // Beri jeda saat pindah halaman supaya elemen tujuan sudah tampil
            const wait = from.name !== to.name ? 350 : 0;

            return new Promise((resolve) => {
                setTimeout(
                    () =>
                        resolve({
                            el: to.hash,
                            top: 70,
                            behavior: "smooth",
                        }),
                    wait,
                );
            });
        }

        return {
            top: 0,
        };
    },
});

installAdminGuard(router);

export default router;



