import { useAuth } from "@/composables/useAuth";

export const adminRoutes = [
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("@/views/admin/AdminLogin.vue"),
    meta: { guestOnly: true, bare: true },
  },
  {
    path: "/admin",
    component: () => import("@/views/admin/AdminLayout.vue"),
    meta: { requiresAdmin: true, bare: true },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("@/views/admin/AdminDashboard.vue"),
      },
      {
        path: ":section(verifikasi|umkm|produk|pengguna|pesanan|laporan)",
        name: "admin-section",
        component: () => import("@/views/admin/AdminListPage.vue"),
      },
    ],
  },
];

export function installAdminGuard(router) {
  router.beforeEach((to) => {
    const { isAdmin } = useAuth();

    // Cek requiresAdmin di SEMUA route yang match (parent + anak)
    const requiresAdmin = to.matched.some(
      (r) => r.meta?.requiresAdmin
    );

    if (requiresAdmin && !isAdmin.value) {
      return {
        name: "admin-login",
        query: { redirect: to.fullPath },
      };
    }

    // Halaman login admin: kalau sudah login sebagai admin, redirect ke dashboard
    const guestOnly = to.matched.some((r) => r.meta?.guestOnly);
    if (guestOnly && isAdmin.value) {
      return { name: "admin-dashboard" };
    }

    return true;
  });
}