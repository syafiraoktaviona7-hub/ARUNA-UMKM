<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { db, sections } from "@/data/adminData";

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();
const keyword = ref("");

const icons = {
  ringkasan: "M3 12l9-9 9 9M5 10v10h14V10",
  verifikasi: "M9 12l2 2 4-4M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  umkm: "M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6",
  produk: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  pengguna: "M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8",
  pesanan: "M6 6h15l-2 9H8zM6 6L5 3H2M9 20h.01M18 20h.01",
  laporan: "M5 21V4M5 4h12l-2 4 2 4H5",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
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

function goSearch() {
  if (!keyword.value.trim()) return;
  router.push({ name: "admin-section", params: { section: "umkm" } });
}

function handleLogout() {
  logout();
  router.replace({ name: "admin-login" });
}
</script>

<template>
  <div class="shell">
    <aside class="side">
      <div class="brand"><span class="mark">A</span><div><strong>ARUNA</strong><small>Admin Center</small></div></div>

      <nav aria-label="Menu admin">
        <RouterLink v-for="m in menu" :key="m.key" :to="m.to" class="item" exact-active-class="on">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons[m.key]" /></svg>
          <span>{{ m.label }}</span>
          <em v-if="count[m.key]">{{ count[m.key] }}</em>
        </RouterLink>
      </nav>

      <RouterLink v-if="count.verifikasi" :to="{ name: 'admin-section', params: { section: 'verifikasi' } }" class="promo">
        <span class="ring" aria-hidden="true"></span>
        <strong>{{ count.verifikasi }} UMKM menunggu</strong>
        <small>Periksa pendaftaran baru supaya bisa segera tampil di ARUNA.</small>
        <b>Periksa sekarang</b>
      </RouterLink>
    </aside>

    <div class="main">
      <header class="top">
        <h1 class="ttl">{{ title }}</h1>
        <label class="search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path :d="icons.search" /></svg>
          <input v-model="keyword" type="search" placeholder="Cari UMKM, produk, atau pengguna" @keyup.enter="goSearch" />
        </label>
        <div class="who">
          <RouterLink :to="{ name: 'admin-section', params: { section: 'laporan' } }" class="bell" aria-label="Laporan baru">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons.bell" /></svg>
            <i v-if="count.laporan">{{ count.laporan }}</i>
          </RouterLink>
          <span class="avatar">{{ user?.name?.[0] }}</span>
          <div class="name"><b>{{ user?.name }}</b><small>Super admin</small></div>
          <button type="button" @click="handleLogout">Keluar</button>
        </div>
      </header>
      <main class="body"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: grid; grid-template-columns: 250px 1fr; background: var(--bg); color: var(--ink); }
.side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 18px; padding: 20px 14px; overflow-y: auto; background: linear-gradient(185deg, var(--blue-dark), var(--blue)); color: var(--white); }
.brand { display: flex; align-items: center; gap: 10px; padding: 2px 10px 6px; }
.brand div { display: grid; line-height: 1.2; }
.brand small { font-size: 0.75rem; opacity: 0.75; }
.mark { display: grid; place-items: center; width: 36px; height: 36px; font-weight: 700; color: var(--blue); background: var(--white); border-radius: 10px; }
nav { display: grid; gap: 4px; }
.item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.85); font-size: 0.93rem; }
.item:hover { background: rgba(255,255,255,0.12); }
.item.on { background: var(--white); color: var(--blue-dark); font-weight: 600; }
.item em { margin-left: auto; min-width: 22px; padding: 1px 7px; font-size: 0.75rem; font-style: normal; text-align: center; color: var(--blue-dark); background: #ffd9a8; border-radius: 999px; }
.item:focus-visible, .promo:focus-visible { outline-color: var(--white); }
.promo { position: relative; overflow: hidden; margin-top: auto; display: grid; gap: 6px; padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22); }
.promo small { font-size: 0.8rem; opacity: 0.85; }
.promo b { width: fit-content; margin-top: 4px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; color: var(--blue-dark); background: var(--white); border-radius: 8px; }
.ring { position: absolute; right: -26px; top: -26px; width: 90px; height: 90px; border-radius: 50%; border: 14px solid rgba(255,255,255,0.12); }
.top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 18px; padding: 14px 28px; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.ttl { font-size: 1.2rem; font-weight: 600; white-space: nowrap; }
.search { flex: 1; max-width: 420px; display: flex; align-items: center; gap: 10px; margin-left: 12px; padding: 0 14px; color: var(--muted); background: var(--bg); border: 1px solid var(--line); border-radius: 999px; }
.search input { flex: 1; min-width: 0; padding: 10px 0; color: var(--ink); background: transparent; border: 0; outline: 0; }
.search:focus-within { border-color: var(--blue); }
.who { display: flex; align-items: center; gap: 12px; margin-left: auto; }
.bell { position: relative; display: grid; place-items: center; width: 40px; height: 40px; color: var(--ink); background: var(--bg); border-radius: 50%; }
.bell i { position: absolute; top: -2px; right: -2px; min-width: 18px; padding: 0 5px; font-size: 0.7rem; font-style: normal; line-height: 18px; text-align: center; color: var(--white); background: #e5484d; border-radius: 999px; }
.avatar { display: grid; place-items: center; width: 38px; height: 38px; color: var(--white); background: var(--blue); border-radius: 50%; font-weight: 600; }
.name { display: grid; line-height: 1.25; }
.name small { color: var(--muted); font-size: 0.78rem; }
.who button { padding: 8px 14px; color: var(--ink); background: var(--white); border: 1px solid var(--line); border-radius: 10px; }
.who button:hover { border-color: var(--blue); color: var(--blue); }
.body { padding: 24px 28px 40px; }

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  .side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; padding: 12px; gap: 8px; }
  nav { display: flex; overflow-x: auto; width: 100%; order: 3; }
  .item { white-space: nowrap; }
  .promo { display: none; }
  .search, .name { display: none; }
  .top { padding: 12px 14px; }
  .body { padding: 18px 14px; }
}
</style>