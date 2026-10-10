import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import ProdukPage from "@/views/ProdukPage.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import CustomerRegisterPage from "@/views/CustomerRegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";
import ProdukDetailPage from "@/views/ProdukDetailPage.vue";
import UmkmDetailPage from "@/views/UmkmDetailPage.vue";
import JasaDetailPage from "@/views/JasaDetailPage.vue";

import { katalog } from "@/services/api";
import { jasaList } from "@/data/jasa";
import { adminRoutes, installAdminGuard } from "./adminRoutes";

// true = data ada.
// 404 = data tidak ditemukan.
// Error jaringan dianggap ada agar halaman tetap terbuka.
async function adaDiServer(ambil) {
    try {
        await ambil();
        return true;
    } catch (error) {
        const status = error.response ?
            error.response.status :
            error.status;

        return status !== 404;
    }
}

// Redirect ke halaman 404
function keNotFound(to) {
    return {
        name: "notfound",
        params: {
            pathMatch: to.path.substring(1).split("/"),
        },
        query: to.query,
        hash: to.hash,
    };
}

const router = createRouter({
    history: createWebHistory(),

    routes: [
        // HOME
        {
            path: "/",
            name: "home",
            component: HomePage,
        },

        // DAFTAR PRODUK
        {
            path: "/produk",
            name: "products",
            component: ProdukPage,
        },

        // DETAIL PRODUK
        {
            path: "/produk/:id",
            name: "produk-detail",
            component: ProdukDetailPage,
            beforeEnter: async(to) => {
                const exists = await adaDiServer(() =>
                    katalog.produkDetail(to.params.id)
                );

                return exists ? true : keNotFound(to);
            },
        },

        // DETAIL JASA
        {
            path: "/jasa/:id",
            name: "service",
            component: JasaDetailPage,
            beforeEnter: (to) => {
                const exists = jasaList.some(
                    (j) => String(j.id) === String(to.params.id)
                );

                return exists ? true : keNotFound(to);
            },
        },

        // DETAIL UMKM
        {
            path: "/umkm/:id",
            name: "umkm-detail",
            component: UmkmDetailPage,
        },

        // REGISTER
        {
            path: "/register",
            name: "register",
            component: RegisterPage,
            meta: {
                bare: true,
            },
        },

        // REGISTER CUSTOMER
        {
            path: "/register/customer",
            name: "customer-register",
            component: CustomerRegisterPage,
            meta: {
                bare: true,
            },
        },

        // LOGIN
        {
            path: "/login",
            name: "login",
            component: LoginPage,
            meta: {
                bare: true,
            },
        },

        // PROFIL
        {
            path: "/profil",
            name: "profile",
            component: ProfilePage,
        },

        // RIWAYAT PESANAN
        {
            path: "/riwayat-pesanan",
            name: "riwayat-pesanan",
            component: ProfilePage,
        },

        // PRODUK FAVORIT
        {
            path: "/produk-favorit",
            name: "produk-favorit",
            component: ProfilePage,
        },

        // CHECKOUT
        {
            path: "/checkout",
            name: "checkout",
            component: CheckoutPage,
        },

        // DETAIL ARTIKEL
        {
            path: "/artikel/:id",
            name: "article",
            component: ArticlePage,
            beforeEnter: async(to) => {
                const exists = await adaDiServer(() =>
                    katalog.artikelDetail(to.params.id)
                );

                return exists ? true : keNotFound(to);
            },
        },

        // ROUTE ADMIN
        ...adminRoutes,

        // HALAMAN 404
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
            const wait = from.name !== to.name ? 350 : 0;

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        el: to.hash,
                        top: 70,
                        behavior: "smooth",
                    });
                }, wait);
            });
        }

        return {
            top: 0,
        };
    },
});

// Pasang guard admin
installAdminGuard(router);

export default router;