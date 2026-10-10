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
import { katalog } from "@/services/api";
import UmkmDetailPage from "@/views/UmkmDetailPage.vue";
import JasaDetailPage from "@/views/JasaDetailPage.vue";
import { jasaList } from "@/data/jasa";

import { adminRoutes, installAdminGuard } from "./adminRoutes";

// true = ada. 404 dari server = tidak ada. Galat jaringan dianggap ada supaya halaman tetap terbuka.
async function adaDiServer(ambil) {
    try {
        await ambil();
        return true;
    } catch (e) {
        return e.status !== 404;
    }
}

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

<<<<<<< Updated upstream
                {
            path: "/produk/:id",
            name: "produk-detail",
            component: ProdukDetailPage,
            beforeEnter: async (to) => {
                const exists = await adaDiServer(() => katalog.produkDetail(to.params.id));

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

                {
            path: "/umkm/:id",
            name: "umkm-detail",
            component: UmkmDetailPage,
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
            path: "/login",
            name: "login",
            component: LoginPage,
            meta: {
                bare: true,
            },
        },

        {
            path: "/profil",
            name: "profile",
            component: ProfilePage,
        },

        {
            path: "/checkout",
            name: "checkout",
            component: CheckoutPage,
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
            beforeEnter: async (to) => {
                const exists = await adaDiServer(() => katalog.artikelDetail(to.params.id));

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
=======
    {
      path: "/produk/:id",
      name: "produk-detail",
      component: ProdukDetailPage,
      beforeEnter: (to) => {
        const exists = produkList.some(
          (p) => String(p.id) === String(to.params.id),
        );

        if (exists) {
          return true;
>>>>>>> Stashed changes
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

    {
      path: "/jasa/:id",
      name: "service",
      component: JasaDetailPage,
      // Jasa yang tidak ada -> tampilkan 404 tanpa mengubah alamat
      beforeEnter: (to) => {
        const exists = jasaList.some(
          (j) => String(j.id) === String(to.params.id),
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

    {
      path: "/umkm/:id",
      name: "umkm-detail",
      component: UmkmDetailPage,
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
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: {
        bare: true,
      },
    },

    {
      path: "/profil",
      name: "profile",
      component: ProfilePage,
    },

    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutPage,
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
