<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { produkList } from "@/data/produk";
import { useWilayahFilter } from "@/composables/useWilayahFilter";
import ProdukCard from "@/components/ProdukCard.vue";

const route = useRoute();

const {
  provinces,
  cities,
  districts,
  provinceId,
  cityId,
  districtId,
  loading,
  error,
  selected,
  reset: resetWilayah,
} = useWilayahFilter();

const kategoriOptions = [
  "Makanan",
  "Minuman",
  "Fashion & Aksesorisnya",
  "Sembako",
  "Sayur dan Buah",
];
const fromQuery = (v) =>
  typeof v === "string" && v ? [v] : Array.isArray(v) ? v.filter(Boolean) : [];

const kategori = ref(fromQuery(route.query.kategori));

// Query berubah saat halaman sudah terbuka (klik kategori dari beranda atau breadcrumb)
watch(
  () => route.query.kategori,
  (v) => {
    kategori.value = fromQuery(v);
  },
);
watch(
  () => route.query.q,
  (v) => {
    q.value = typeof v === "string" ? v : "";
  },
);
const minPrice = ref("");
const maxPrice = ref("");
const sort = ref("harga-asc");
const q = ref(typeof route.query.q === "string" ? route.query.q : "");

const PAGE = 12;
const visible = ref(PAGE);

// "Kota Surabaya" dan "Surabaya" dianggap sama
const norm = (s = "") =>
  s
    .toLowerCase()
    .replace(/^(kota|kabupaten|kab\.)\s+/, "")
    .trim();
const toNum = (v) =>
  v === "" || v === null || v === undefined ? null : Number(v);

const results = computed(() => {
  const { province, city, district } = selected.value;
  const min = toNum(minPrice.value);
  const max = toNum(maxPrice.value);
  const s = q.value.toLowerCase().trim();

  const list = produkList.filter(
    (p) =>
      (!province || norm(p.province) === norm(province)) &&
      (!city || norm(p.city) === norm(city)) &&
      (!district || norm(p.district) === norm(district)) &&
      (!kategori.value.length || kategori.value.includes(p.category)) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max) &&
      (!s || `${p.name} ${p.shop}`.toLowerCase().includes(s)),
  );

  if (sort.value === "harga-asc") return list.sort((a, b) => a.price - b.price);
  if (sort.value === "harga-desc")
    return list.sort((a, b) => b.price - a.price);
  return list.sort((a, b) => b.sold - a.sold);
});

const shown = computed(() => results.value.slice(0, visible.value));

// Kembali ke halaman pertama setiap kali filter berubah
watch(results, () => {
  visible.value = PAGE;
});

function resetFilters() {
  resetWilayah();
  kategori.value = [];
  minPrice.value = "";
  maxPrice.value = "";
}

const toResults = () =>
  document.getElementById("hasil")?.scrollIntoView({ behavior: "smooth" });
</script>

<template>
  <main class="page">
    <section class="banner">
      <div class="wrap">
        <RouterLink to="/#umkm" class="crumb">← Kembali ke beranda</RouterLink>
        <h1>Semua Produk UMKM</h1>
        <p>
          Jelajahi produk dari pelaku UMKM di seluruh Indonesia. Saring
          berdasarkan wilayah, jenis makanan, dan harga.
        </p>

        <form class="search" @submit.prevent="toResults">
          <input
            v-model="q"
            type="search"
            placeholder="Cari produk atau toko..."
            aria-label="Cari produk atau toko"
          />
          <button type="submit">Cari</button>
        </form>

        <span class="total"
          ><b>{{ produkList.length }}</b> Produk</span
        >
      </div>
    </section>

    <div class="wrap layout">
      <!-- FILTER -->
      <aside class="filters" aria-label="Filter produk">
        <div class="f-head">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 5h18l-7 8v6l-4-2v-4z" />
          </svg>
          Filter Produk
        </div>

        <div class="f-block">
          <h2>Wilayah</h2>

          <label class="field">
            <span>Provinsi</span>
            <select v-model="provinceId">
              <option value="">Semua provinsi</option>
              <option v-for="x in provinces" :key="x.id" :value="x.id">
                {{ x.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Kota / Kabupaten</span>
            <select v-model="cityId" :disabled="!provinceId">
              <option value="">Semua kota / kabupaten</option>
              <option v-for="x in cities" :key="x.id" :value="x.id">
                {{ x.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Kecamatan</span>
            <select v-model="districtId" :disabled="!cityId">
              <option value="">Semua kecamatan</option>
              <option v-for="x in districts" :key="x.id" :value="x.id">
                {{ x.name }}
              </option>
            </select>
          </label>

          <p v-if="error" class="msg err" role="alert">{{ error }}</p>
          <p v-else-if="loading" class="msg">Memuat data wilayah…</p>
        </div>

        <div class="f-block">
  <h2>Kategori</h2>
  <label v-for="k in kategoriOptions" :key="k" class="check">
    <input v-model="kategori" type="checkbox" :value="k" />
    <span>{{ k }}</span>
  </label>
</div>

        <div class="f-block">
          <h2>Harga</h2>
          <label class="price-row">
            <span>Min</span>
            <input
              v-model.number="minPrice"
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="0"
            />
          </label>
          <label class="price-row">
            <span>Maks</span>
            <input
              v-model.number="maxPrice"
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="Maks"
            />
          </label>
        </div>

        <div class="f-block">
          <button type="button" class="reset" @click="resetFilters">
            Reset Filter
          </button>
        </div>
      </aside>

      <!-- HASIL -->
      <section id="hasil" class="content">
        <div class="bar">
          <label class="sort">
            <span>Urutkan:</span>
            <select v-model="sort">
              <option value="harga-asc">Harga Terendah</option>
              <option value="harga-desc">Harga Tertinggi</option>
              <option value="terlaris">Terlaris</option>
            </select>
          </label>
          <p aria-live="polite">{{ results.length }} hasil ditemukan</p>
        </div>

        <div v-if="shown.length" class="grid">
          <ProdukCard v-for="p in shown" :key="p.id" :item="p" />
        </div>

        <div v-else class="empty">
          <p>
            Belum ada produk yang cocok dengan filtermu. Coba ubah wilayah,
            jenis makanan, atau rentang harga.
          </p>
          <button type="button" class="empty-btn" @click="resetFilters">
            Reset filter
          </button>
        </div>

        <button
          v-if="results.length > visible"
          type="button"
          class="more"
          @click="visible += PAGE"
        >
          Tampilkan lebih banyak
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.page {
  background: #f4f9ff;
  min-height: 100vh;
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

/* BANNER */
.banner {
  padding: 40px 0 36px;
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
  color: #fff;
}
.crumb {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 13px;
  opacity: 0.85;
}
.crumb:hover {
  opacity: 1;
  text-decoration: underline;
}
.banner h1 {
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.15;
}
.banner p {
  max-width: 40em;
  margin: 10px 0 20px;
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.92;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 520px;
  padding: 5px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}
.search input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  border: none;
  outline: none;
  background: transparent;
  color: #142d4e;
  font-size: 14px;
}
.search button {
  height: 40px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.search button:hover {
  background: #0754b5;
}
.total {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 13px;
}

/* LAYOUT */
.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
  padding: 28px 0 72px;
}

/* SIDEBAR */
.filters {
  position: sticky;
  top: 88px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
}
.f-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.f-head svg {
  width: 16px;
  height: 16px;
}
.f-block {
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid #edf3fa;
}
.f-block:last-child {
  border-bottom: none;
}
.f-block h2 {
  color: #142d4e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.field {
  display: grid;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}
.field span {
  color: #5c718a;
}
select,
.price-row input {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #e2ecf8;
  border-radius: 8px;
  background: #fff;
  color: #142d4e;
  font-size: 13px;
}
select:disabled {
  background: #f2f6fb;
  color: #9aabc0;
  cursor: not-allowed;
}
.msg {
  font-size: 12px;
  color: #5c718a;
}
.err {
  color: #c62828;
}

.check {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #293c57;
  font-size: 13px;
  cursor: pointer;
}
.check input {
  width: 16px;
  height: 16px;
  accent-color: #0865d8;
}

.price-row {
  display: grid;
  grid-template-columns: 36px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #5c718a;
}
.price-row input {
  width: 100%;
}

.reset {
  height: 40px;
  border: 1px solid #0865d8;
  border-radius: 8px;
  background: #fff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
}
.reset:hover {
  background: #eaf4ff;
}

/* HASIL */
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  color: #5c718a;
  font-size: 13px;
}
.sort {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.sort select {
  height: 38px;
  min-width: 160px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}

.more {
  display: block;
  margin: 28px auto 0;
  height: 44px;
  padding: 0 28px;
  border: 1px solid #0865d8;
  border-radius: 10px;
  background: #fff;
  color: #0865d8;
  font-size: 14px;
  font-weight: 600;
}
.more:hover {
  background: #eaf4ff;
}

.empty {
  display: grid;
  gap: 16px;
  justify-items: start;
  padding: 30px 0;
  color: #5c718a;
}
.empty-btn {
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.empty-btn:hover {
  background: #0754b5;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .filters {
    position: static;
  }
}
@media (max-width: 650px) {
  .wrap {
    width: 88%;
  }
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
