<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { db, sections } from "@/data/adminData";

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();

const icons = {
  ringkasan: "M3 12l9-9 9 9M5 10v10h14V10",
  verifikasi: "M9 12l2 2 4-4M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  umkm: "M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6",
  produk: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  pengguna: "M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8",
  pesanan: "M6 6h15l-2 9H8zM6 6L5 3H2M9 20h.01M18 20h.01",
  laporan: "M5 21V4M5 4h12l-2 4 2 4H5",
};

const count = computed(() => ({
  verifikasi: db.umkm.filter((u) => u.status === "menunggu").length,
  laporan: db.laporan.filter((l) => l.status === "baru").length,
}));

const menu = [
  { key: "ringkasan", label: "Ringkasan", to: { name: "admin-dashboard" } },
  ...Object.entries(sections).map(([key, s]) => ({
    key, label: s.title, to: { name: "admin-section", params: { section: key } },
  })),
];

const title = computed(() =>
  route.params.section ? sections[route.params.section].title : "Ringkasan",
);

function handleLogout() {
  logout();
  router.replace({ name: "admin-login" });
}
</script>

<template>
  <div class="shell">
    <aside class="side">
      <div class="brand"><span class="mark">A</span><strong>ARUNA</strong><small>Admin</small></div>
      <nav aria-label="Menu admin">
        <RouterLink v-for="m in menu" :key="m.key" :to="m.to" class="item" exact-active-class="on">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons[m.key] || icons.ringkasan" /></svg>
          <span>{{ m.label }}</span>
          <em v-if="count[m.key]">{{ count[m.key] }}</em>
        </RouterLink>
      </nav>
    </aside>

    <div class="main">
      <header class="top">
        <h1>{{ title }}</h1>
        <div class="who">
          <span class="avatar">{{ user?.name?.[0] }}</span>
          <span class="name">{{ user?.name }}</span>
          <button type="button" @click="handleLogout">Keluar</button>
        </div>
      </header>
      <main class="body"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; background: var(--bg); color: var(--ink); }
.side { position: sticky; top: 0; height: 100vh; padding: 20px 14px; background: linear-gradient(180deg, var(--blue-dark), var(--blue)); color: var(--white); }
.brand { display: flex; align-items: center; gap: 10px; padding: 4px 10px 22px; }
.mark { display: grid; place-items: center; width: 32px; height: 32px; font-weight: 700; color: var(--blue); background: var(--white); border-radius: 9px; }
.brand small { opacity: 0.7; }
nav { display: grid; gap: 4px; }
.item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.85); }
.item:hover { background: rgba(255,255,255,0.12); }
.item.on { background: var(--white); color: var(--blue-dark); font-weight: 600; }
.item em { margin-left: auto; min-width: 22px; padding: 1px 7px; font-size: 0.75rem; font-style: normal; text-align: center; color: var(--blue-dark); background: #ffd9a8; border-radius: 999px; }
.item:focus-visible { outline-color: var(--white); }
.top { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; background: var(--white); border-bottom: 1px solid var(--line); }
.top h1 { font-size: 1.3rem; font-weight: 600; }
.who { display: flex; align-items: center; gap: 10px; }
.avatar { display: grid; place-items: center; width: 34px; height: 34px; color: var(--white); background: var(--blue); border-radius: 50%; font-weight: 600; }
.who button { padding: 7px 14px; color: var(--ink); background: var(--white); border: 1px solid var(--line); border-radius: 8px; }
.body { padding: 28px; }

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  .side { position: static; height: auto; padding: 12px; }
  .brand { padding-bottom: 10px; }
  nav { display: flex; overflow-x: auto; }
  .item { white-space: nowrap; }
  .name { display: none; }
  .body { padding: 18px 14px; }
}
</style>