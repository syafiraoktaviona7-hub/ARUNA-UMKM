import { createRouter, createWebHistory } from "vue-router";

// =========================
// IMPORT HALAMAN PUBLIC
// =========================
import HomePage from "@/views/HomePage.vue";
import ProdukPage from "@/views/ProdukPage.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import ProdukDetailPage from "@/views/ProdukDetailPage.vue";
import UmkmDetailPage from "@/views/UmkmDetailPage.vue";
import JasaDetailPage from "@/views/JasaDetailPage.vue";

// =========================
// IMPORT HALAMAN AUTH
// =========================
import RegisterPage from "@/views/RegisterPage.vue";
import CustomerRegisterPage from "@/views/CustomerRegisterPage.vue";
import CustomerVerifyPhonePage from "@/views/CustomerVerifyPhonePage.vue";
import LoginPage from "@/views/LoginPage.vue";

// =========================
// IMPORT HALAMAN CUSTOMER
// =========================
import ProfilePage from "@/views/ProfilePage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";

// =========================
// IMPORT HALAMAN PENJUAL
// =========================
import PenjualLayout from "@/layouts/PenjualLayout.vue";
import PenjualDashboard from "@/views/penjual/DashboardPage.vue";
import PenjualProduk from "@/views/penjual/ProdukPage.vue";
import PenjualPesanan from "@/views/penjual/PesananPage.vue";
import PenjualProfil from "@/views/penjual/ProfilTokoPage.vue";

// =========================
// IMPORT SERVICES & AUTH
// =========================
import { katalog } from "@/services/api";
import { jasaList } from "@/data/jasa";
import { useAuth } from "@/composables/useAuth";
import { adminRoutes, installAdminGuard } from "./adminRoutes";

// =========================
// HELPER: CEK DATA SERVER
// =========================
// true  = data tersedia
// false = server mengembalikan 404
// Error jaringan tetap membuka halaman
async function adaDiServer(ambil) {
  try {
    await ambil();
    return true;
  } catch (error) {
    const status = error?.response?.status ?? error?.status;
    return status !== 404;
  }
}

// =========================
// HELPER: REDIRECT KE 404
// =========================
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

// =========================
// HELPER: CEK LOGIN
// =========================
function isUserLoggedIn() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn.value;
}

// =========================
// HELPER: GUEST GUARD
// =========================
function guestGuard() {
  return isUserLoggedIn() ? { name: "home" } : true;
}

// =========================
// CREATE ROUTER
// =========================
const router = createRouter({
  history: createWebHistory(),

  routes: [
    // =========================
    // PUBLIC ROUTES
    // =========================

    // HOME
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { title: "ARUNA — Marketplace UMKM Indonesia" },
    },

    // DAFTAR PRODUK
    {
      path: "/produk",
      name: "products",
      component: ProdukPage,
      meta: { title: "Produk UMKM — ARUNA" },
    },

    // DETAIL PRODUK
    {
      path: "/produk/:id",
      name: "produk-detail",
      component: ProdukDetailPage,
      meta: { title: "Detail Produk — ARUNA" },
      beforeEnter: async (to) => {
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
      meta: { title: "Detail Jasa — ARUNA" },
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
      meta: { title: "Detail UMKM — ARUNA" },
    },

    // DETAIL ARTIKEL
    {
      path: "/artikel/:id",
      name: "article",
      component: ArticlePage,
      meta: { title: "Artikel — ARUNA" },
      beforeEnter: async (to) => {
        const exists = await adaDiServer(() =>
          katalog.artikelDetail(to.params.id)
        );
        return exists ? true : keNotFound(to);
      },
    },

    // =========================
    // AUTH ROUTES
    // =========================

    // REGISTER
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { bare: true, title: "Daftar — ARUNA" },
      beforeEnter: guestGuard,
    },

    // REGISTER CUSTOMER
    {
      path: "/register/customer",
      name: "customer-register",
      component: CustomerRegisterPage,
      meta: { bare: true, title: "Daftar Pelanggan — ARUNA" },
      beforeEnter: guestGuard,
    },

    // VERIFIKASI NOMOR CUSTOMER
    {
      path: "/register/customer/verify",
      name: "customer-verify-phone",
      component: CustomerVerifyPhonePage,
      meta: { bare: true, title: "Verifikasi Nomor — ARUNA" },
      beforeEnter: guestGuard,
    },

    // LOGIN
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { bare: true, title: "Masuk — ARUNA" },
      beforeEnter: guestGuard,
    },

    // =========================
    // PROTECTED CUSTOMER ROUTES
    // =========================

    // PROFIL CUSTOMER
    {
      path: "/profil",
      name: "profile",
      component: ProfilePage,
      meta: { requiresAuth: true, title: "Profil — ARUNA" },
    },

    // RIWAYAT PESANAN
    {
      path: "/riwayat-pesanan",
      name: "riwayat-pesanan",
      component: ProfilePage,
      meta: { requiresAuth: true, title: "Riwayat Pesanan — ARUNA" },
    },

    // PRODUK FAVORIT
    {
      path: "/produk-favorit",
      name: "produk-favorit",
      component: ProfilePage,
      meta: { requiresAuth: true, title: "Produk Favorit — ARUNA" },
    },

    // CHECKOUT
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutPage,
      meta: { requiresAuth: true, title: "Checkout — ARUNA" },
    },

    // =========================
    // PENJUAL ROUTES
    // =========================
    {
      path: "/penjual",
      component: PenjualLayout,
      meta: { requiresAuth: true, role: "penjual" },
      children: [
        {
          path: "",
          name: "penjual-dashboard",
          component: PenjualDashboard,
          meta: { title: "Dashboard Penjual — ARUNA" },
        },
        {
          path: "produk",
          name: "penjual-produk",
          component: PenjualProduk,
          meta: { title: "Produk Saya — ARUNA" },
        },
        {
          path: "pesanan",
          name: "penjual-pesanan",
          component: PenjualPesanan,
          meta: { title: "Pesanan — ARUNA" },
        },
        {
          path: "profil",
          name: "penjual-profil",
          component: PenjualProfil,
          meta: { title: "Profil Toko — ARUNA" },
        },
      ],
    },

    // =========================
    // ADMIN ROUTES
    // =========================
    ...adminRoutes,

    // =========================
    // HALAMAN 404
    // =========================
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundPage,
      meta: { title: "Halaman Tidak Ditemukan — ARUNA" },
    },
  ],

  // =========================
  // SCROLL BEHAVIOR
  // =========================
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

    return { top: 0 };
  },
});

// =========================
// GLOBAL AUTH & ROLE GUARD
// =========================
router.beforeEach((to) => {
  const { isLoggedIn, user } = useAuth();

  const requiresAuth = to.matched.some(
    (route) => route.meta?.requiresAuth
  );

  if (requiresAuth && !isLoggedIn.value) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  const routeRole = to.matched
    .map((route) => route.meta?.role)
    .find(Boolean);

  if (routeRole && user.value?.role !== routeRole) {
    return { name: "home" };
  }

  return true;
});

// =========================
// UPDATE DOCUMENT TITLE
// =========================
router.afterEach((to) => {
  document.title =
    to.meta?.title || "ARUNA — Marketplace UMKM Indonesia";
});

// =========================
// INSTALL ADMIN GUARD
// =========================
installAdminGuard(router);

// =========================
// EXPORT ROUTER
// =========================
export default router;