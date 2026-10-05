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

    if (to.meta.requiresAdmin && !isAdmin.value) {
      return { name: "admin-login", query: { redirect: to.fullPath } };
    }

    if (to.meta.guestOnly && isAdmin.value) {
      return { name: "admin-dashboard" };
    }
  });
}