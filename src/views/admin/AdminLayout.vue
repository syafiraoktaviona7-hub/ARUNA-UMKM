<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { db, sections } from "@/data/adminData";

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();
const keyword = ref("");
const showResults = ref(false);
const open = ref(false);

// Tutup menu geser setiap pindah halaman
watch(() => route.fullPath, () => (open.value = false));

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
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
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

// Pencarian lintas UMKM, produk, dan pengguna
const searchSpec = [
  { section: "umkm", label: "UMKM", data: "umkm", sub: (r) => `${r.pemilik} · ${r.kota}` },
  { section: "produk", label: "Produk", data: "produk", sub: (r) => r.umkm },
  { section: "pengguna", label: "Pengguna", data: "pengguna", sub: (r) => r.email },
];

const groups = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return [];
  return searchSpec
    .map((g) => {
      const all = db[g.data].filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
      return { ...g, total: all.length, items: all.slice(0, 3).map((r) => ({ id: r.id, name: r.nama, sub: g.sub(r) })) };
    })
    .filter((g) => g.total);
});

function go(section, q) {
  showResults.value = false;
  router.push({ name: "admin-section", params: { section }, query: { q } });
}

function goSearch() {
  const q = keyword.value.trim();
  if (!q) return;
  go(groups.value[0]?.section || "umkm", q);
}

function handleLogout() {
  logout();
  router.replace({ name: "admin-login" });
}
</script>

<template>
  <div class="shell" @keydown.esc="open = false">
    <div v-if="open" class="scrim" @click="open = false"></div>
    <aside id="menu" class="side" :class="{ open }">
      <div class="brand1"><RouterLink to="/admin" class="brand1">
        <img src="/images/aruna-logo.png" alt="Logo ARUNA" />
        </RouterLink></div>


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
        <button type="button" class="burger" aria-label="Buka menu" aria-controls="menu" :aria-expanded="open" @click="open = !open">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <RouterLink to="/admin" class="top-logo"><img src="/images/aruna-logo.png" alt="Logo ARUNA" /></RouterLink>
        <h1 class="ttl">{{ title }}</h1>

        <div class="search">
          <label>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path :d="icons.search" /></svg>
            <input v-model="keyword" type="search" autocomplete="off" placeholder="Cari UMKM, produk, atau pengguna" aria-label="Cari UMKM, produk, atau pengguna" @focus="showResults = true" @blur="showResults = false" @keydown.enter.prevent="goSearch" @keydown.esc="showResults = false" />
          </label>
          <div v-if="showResults && keyword.trim()" class="results">
            <template v-if="groups.length">
              <section v-for="g in groups" :key="g.section">
                <h2>{{ g.label }} <small>({{ g.total }})</small></h2>
                <button v-for="r in g.items" :key="r.id" type="button" @mousedown.prevent="go(g.section, r.name)">
                  <b>{{ r.name }}</b><small>{{ r.sub }}</small>
                </button>
                <button v-if="g.total > g.items.length" type="button" class="more" @mousedown.prevent="go(g.section, keyword.trim())">Lihat semua {{ g.total }} hasil {{ g.label }}</button>
              </section>
            </template>
            <p v-else>Tidak ada hasil untuk "{{ keyword.trim() }}"</p>
          </div>
        </div>

        <div class="who">
          <RouterLink :to="{ name: 'admin-section', params: { section: 'laporan' } }" class="bell" aria-label="Laporan baru">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons.bell" /></svg>
            <i v-if="count.laporan">{{ count.laporan }}</i>
          </RouterLink>
          <span class="avatar">{{ user?.name?.[0] }}</span>
          <div class="name"><b>{{ user?.name }}</b><small>Super admin</small></div>
          <button type="button" class="logout" aria-label="Keluar" title="Keluar" @click="handleLogout">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons.logout" /></svg>
          </button>
        </div>
      </header>
      <main class="body">
        <h1 class="ptitle">{{ title }}</h1>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.brand1 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.brand1 img {
  width: 200px;
  height: 62px;
  object-fit: contain;
  object-position: left center;
}
div.brand1 { padding: 4px 8px 16px; border-bottom: 1px solid var(--line); }

.shell { min-height: 100vh; display: grid; grid-template-columns: 250px minmax(0, 1fr); background: var(--bg); color: var(--ink); }

/* Sidebar terang supaya logo biru terlihat jelas */
.side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 18px; padding: 20px 14px; overflow-y: auto; background: var(--white); border-right: 1px solid var(--line); color: var(--ink); }
nav { display: grid; gap: 4px; }
.item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #3d5372; font-size: 0.93rem; }
.item:hover { background: var(--bg); color: var(--blue); }
.item.on { background: var(--blue); color: var(--white); font-weight: 600; box-shadow: 0 6px 16px rgba(8, 101, 216, 0.28); }
.item em { margin-left: auto; min-width: 22px; padding: 1px 7px; font-size: 0.75rem; font-style: normal; text-align: center; color: #9a6200; background: #ffe9c2; border-radius: 999px; }
.promo { position: relative; overflow: hidden; margin-top: auto; display: grid; gap: 6px; padding: 16px; color: var(--white); border-radius: 14px; background: linear-gradient(160deg, var(--blue), var(--blue-dark)); }
.promo:focus-visible { outline-color: var(--blue-dark); }
.promo small { font-size: 0.8rem; opacity: 0.88; }
.promo b { width: fit-content; margin-top: 4px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; color: var(--blue-dark); background: var(--white); border-radius: 8px; }
.ring { position: absolute; right: -26px; top: -26px; width: 90px; height: 90px; border-radius: 50%; border: 14px solid rgba(255,255,255,0.14); }

.main { min-width: 0; }
.top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 18px; padding: 14px 28px; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.ttl { font-size: 1.2rem; font-weight: 600; white-space: nowrap; }
.top-logo, .burger, .ptitle { display: none; }

.search { position: relative; flex: 1; max-width: 420px; margin-left: 12px; }
.search label { display: flex; align-items: center; gap: 10px; padding: 0 14px; color: var(--muted); background: var(--bg); border: 1px solid var(--line); border-radius: 999px; }
.search label:focus-within { border-color: var(--blue); }
.search input { flex: 1; min-width: 0; padding: 10px 0; color: var(--ink); background: transparent; border: 0; outline: 0; }
.results { position: absolute; left: 0; right: 0; top: calc(100% + 8px); z-index: 10; max-height: 70vh; overflow-y: auto; padding: 8px; background: var(--white); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 16px 40px rgba(20, 45, 78, 0.14); }
.results h2 { padding: 8px 10px 4px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
.results h2 small { font-weight: 400; }
.results button { display: grid; width: 100%; padding: 8px 10px; text-align: left; color: var(--ink); background: transparent; border: 0; border-radius: 8px; cursor: pointer; }
.results button:hover { background: var(--bg); }
.results button b { font-weight: 500; font-size: 0.9rem; }
.results button small { color: var(--muted); font-size: 0.78rem; }
.results .more { color: var(--blue); font-size: 0.82rem; }
.results p { padding: 14px 10px; color: var(--muted); font-size: 0.9rem; }

.who { display: flex; flex-shrink: 0; align-items: center; gap: 12px; margin-left: auto; }
.bell { position: relative; display: grid; place-items: center; width: 40px; height: 40px; color: var(--ink); background: var(--bg); border-radius: 50%; }
.bell i { position: absolute; top: -2px; right: -2px; min-width: 18px; padding: 0 5px; font-size: 0.7rem; font-style: normal; line-height: 18px; text-align: center; color: var(--white); background: #e5484d; border-radius: 999px; }
.avatar { display: grid; place-items: center; width: 38px; height: 38px; color: var(--white); background: var(--blue); border-radius: 50%; font-weight: 600; }
.name { display: grid; line-height: 1.25; }
.name small { color: var(--muted); font-size: 0.78rem; }
.logout { display: grid; place-items: center; width: 40px; height: 40px; color: var(--ink); background: var(--bg); border: 0; border-radius: 50%; }
.logout:hover { color: #b3261e; background: #fdecea; }
.body { padding: 24px 28px 40px; }

.burger { place-items: center; width: 40px; height: 40px; color: var(--ink); background: var(--bg); border: 1px solid var(--line); border-radius: 10px; }
.top-logo img { display: block; height: 42px; width: auto; max-width: 160px; object-fit: contain; }
.scrim { display: none; }

/* Tablet dan HP: sidebar menjadi menu geser, logo pindah ke topbar */
@media (max-width: 1024px) {
  .shell { grid-template-columns: minmax(0, 1fr); }
  .side { position: fixed; inset: 0 auto 0 0; z-index: 30; width: 280px; transform: translateX(-100%); transition: transform 0.22s ease; box-shadow: 8px 0 30px rgba(7, 40, 90, 0.25); }
  .side.open { transform: none; }
  .brand1 img { width: 220px; height: 68px; }
  .scrim { display: block; position: fixed; inset: 0; z-index: 20; background: rgba(20, 45, 78, 0.45); }
  .burger { display: grid; }
  .top-logo { display: block; }
  .top { gap: 12px; padding: 12px 18px; }
  .search { margin-left: 0; max-width: none; }
  .body { padding: 20px 18px 32px; }
}

/* HP: baris 1 = menu, logo, aksi. Baris 2 = pencarian */
@media (max-width: 640px) {
  .top { flex-wrap: wrap; row-gap: 10px; padding: 10px 14px 12px; }
  .ttl, .name { display: none; }
  .who { gap: 8px; }
  .search { order: 3; flex: 1 1 100%; }
  .search input { padding: 9px 0; }
  .ptitle { display: block; margin-bottom: 14px; font-size: 1.25rem; font-weight: 600; }
  .body { padding: 16px 14px 28px; }
}

@media (max-width: 420px) {
  .avatar { display: none; }
  .top-logo img { height: 38px; max-width: 140px; }
}

@media (prefers-reduced-motion: reduce) {
  .side { transition: none; }
}
</style>