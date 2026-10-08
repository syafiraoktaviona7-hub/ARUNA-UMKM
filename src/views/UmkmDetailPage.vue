<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { umkmList } from "@/data/umkm";
import { produkList } from "@/data/produk";
import ProdukCard from "@/components/ProdukCard.vue";

const route = useRoute();
const failed = ref(false);
const tab = ref("produk");
const q = ref("");
const sort = ref("terlaris");

const umkm = computed(() =>
  umkmList.find((u) => String(u.id) === String(route.params.id)),
);

watch(
  () => route.params.id,
  () => {
    failed.value = false;
    tab.value = "produk";
    q.value = "";
    sort.value = "terlaris";
  },
);

const semuaProduk = computed(() =>
  umkm.value ? produkList.filter((p) => p.umkmId === umkm.value.id) : [],
);

const totalTerjual = computed(() =>
  semuaProduk.value.reduce((sum, p) => sum + p.sold, 0),
);

const produk = computed(() => {
  const s = q.value.toLowerCase().trim();
  const list = semuaProduk.value.filter(
    (p) => !s || p.name.toLowerCase().includes(s),
  );
  if (sort.value === "harga-asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort.value === "harga-desc") return [...list].sort((a, b) => b.price - a.price);
  return [...list].sort((a, b) => b.sold - a.sold);
});

const deskripsi = computed(
  () =>
    umkm.value?.deskripsi ||
    `${umkm.value.name} adalah pelaku UMKM kategori ${umkm.value.category} yang berlokasi di ${umkm.value.district}, ${umkm.value.city}, ${umkm.value.province}.`,
);

// Nomor WA toko: ambil dari data UMKM, kalau belum ada pakai nomor produknya
const waLink = computed(() => {
  if (!umkm.value) return "#";
  const nomor = umkm.value.whatsapp || semuaProduk.value[0]?.whatsapp;
  if (!nomor) return "#";
  const text = encodeURIComponent(`Halo ${umkm.value.name}, saya ingin bertanya.`);
  return `https://wa.me/${nomor}?text=${text}`;
});
</script>

<template>
  <main class="page">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
        <span>/</span>
        <RouterLink :to="{ name: 'home', hash: '#umkm' }">UMKM</RouterLink>
        <template v-if="umkm">
          <span>/</span>
          <b>{{ umkm.name }}</b>
        </template>
      </nav>

      <template v-if="umkm">
        <!-- PROFIL -->
        <section class="profile">
          <div class="cover" aria-hidden="true"></div>

          <div class="head">
            <div class="logo">
              <img
                v-if="!failed"
                :src="umkm.image"
                :alt="umkm.name"
                @error="failed = true"
              />
              <span v-else>{{ umkm.name.charAt(0) }}</span>
            </div>

            <div class="head-info">
              <span class="tag">{{ umkm.category }}</span>
              <h1>{{ umkm.name }}</h1>
              <p class="loc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {{ umkm.district }}, {{ umkm.city }}, {{ umkm.province }}
              </p>
            </div>

            <a
              v-if="waLink !== '#'"
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn"
            >
              Hubungi UMKM
            </a>
          </div>

          <ul class="stats">
            <li><b>{{ semuaProduk.length }}</b><span>Produk</span></li>
            <li><b>{{ totalTerjual }}</b><span>Terjual</span></li>
            <li><b>{{ umkm.category }}</b><span>Kategori</span></li>
          </ul>
        </section>

        <!-- TAB -->
        <section class="panel">
          <div class="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'produk'"
              :class="{ on: tab === 'produk' }"
              @click="tab = 'produk'"
            >
              Produk ({{ semuaProduk.length }})
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'tentang'"
              :class="{ on: tab === 'tentang' }"
              @click="tab = 'tentang'"
            >
              Tentang UMKM
            </button>
          </div>

          <div v-if="tab === 'produk'" class="content">
            <div class="bar">
              <input
                v-model="q"
                type="search"
                placeholder="Cari produk di toko ini..."
                aria-label="Cari produk di toko ini"
              />
              <label class="sort">
                <span>Urutkan:</span>
                <select v-model="sort">
                  <option value="terlaris">Terlaris</option>
                  <option value="harga-asc">Harga Terendah</option>
                  <option value="harga-desc">Harga Tertinggi</option>
                </select>
              </label>
            </div>

            <div v-if="produk.length" class="grid">
              <ProdukCard v-for="p in produk" :key="p.id" :item="p" />
            </div>
            <p v-else class="empty-text">
              {{
                semuaProduk.length
                  ? "Tidak ada produk yang cocok dengan pencarianmu."
                  : "UMKM ini belum menampilkan produk."
              }}
            </p>
          </div>

          <div v-else class="content">
            <p class="desc">{{ deskripsi }}</p>
            <dl class="meta">
              <div><dt>Nama UMKM</dt><dd>{{ umkm.name }}</dd></div>
              <div><dt>Kategori</dt><dd>{{ umkm.category }}</dd></div>
              <div><dt>Kecamatan</dt><dd>{{ umkm.district }}</dd></div>
              <div><dt>Kota / Kabupaten</dt><dd>{{ umkm.city }}</dd></div>
              <div><dt>Provinsi</dt><dd>{{ umkm.province }}</dd></div>
              <div v-if="umkm.alamat"><dt>Alamat</dt><dd>{{ umkm.alamat }}</dd></div>
            </dl>
          </div>
        </section>
      </template>

      <div v-else class="empty">
        <p>UMKM tidak ditemukan.</p>
        <RouterLink :to="{ name: 'products' }" class="btn">
          Lihat semua produk
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page {
  background: #f4f9ff;
  min-height: 100vh;
  padding: 24px 0 72px;
}
.wrap {
  width: 85.5%;
  max-width: 1100px;
  margin: 0 auto;
}

.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  color: #5c718a;
  font-size: 13px;
}
.crumbs a {
  color: #0865d8;
}
.crumbs a:hover {
  text-decoration: underline;
}
.crumbs b {
  color: #142d4e;
  font-weight: 600;
}

/* PROFIL */
.profile {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
}
.cover {
  height: 120px;
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
}
.head {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  padding: 0 24px 20px;
}
.logo {
  display: grid;
  place-items: center;
  flex: none;
  overflow: hidden;
  width: 112px;
  height: 112px;
  margin-top: -44px;
  border: 4px solid #fff;
  border-radius: 50%;
  background: linear-gradient(135deg, #cfe5ff, #e9f4ff);
  color: #0865d8;
  font-size: 44px;
  font-weight: 800;
}
.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.head-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding-top: 14px;
}
.tag {
  align-self: flex-start;
  padding: 3px 12px;
  border-radius: 20px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 500;
}
h1 {
  color: #142d4e;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  line-height: 1.25;
}
.loc {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5c718a;
  font-size: 14px;
}
.loc svg {
  flex: none;
  width: 16px;
  height: 16px;
}
.btn {
  display: inline-flex;
  align-items: center;
  flex: none;
  height: 44px;
  padding: 0 22px;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.btn:hover {
  background: #0754b5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #edf3fa;
  list-style: none;
}
.stats li {
  display: grid;
  gap: 2px;
  padding: 14px 24px;
  text-align: center;
}
.stats li + li {
  border-left: 1px solid #edf3fa;
}
.stats b {
  color: #142d4e;
  font-size: 16px;
  font-weight: 800;
}
.stats span {
  color: #5c718a;
  font-size: 12px;
}

/* TAB */
.panel {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
}
.tabs {
  display: flex;
  border-bottom: 1px solid #edf3fa;
}
.tabs button {
  padding: 14px 22px;
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: #5c718a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.tabs button.on {
  border-bottom-color: #0865d8;
  color: #0865d8;
}
.content {
  padding: 20px 24px 24px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}
.bar input,
.bar select {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e2ecf8;
  border-radius: 8px;
  background: #fff;
  color: #142d4e;
  font-size: 13px;
}
.bar input {
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
.sort {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5c718a;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}
.empty-text {
  padding: 24px 0;
  color: #5c718a;
  font-size: 14px;
}

.desc {
  color: #293c57;
  font-size: 14px;
  line-height: 1.8;
}
.meta {
  display: grid;
  margin-top: 12px;
}
.meta div {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #edf3fa;
  font-size: 14px;
}
.meta div:last-child {
  border-bottom: none;
}
dt {
  color: #5c718a;
}
dd {
  color: #142d4e;
  font-weight: 500;
}

.empty {
  display: grid;
  gap: 16px;
  justify-items: start;
  padding: 30px 0;
  color: #5c718a;
}

@media (max-width: 800px) {
  .wrap {
    width: 88%;
  }
  .head {
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0 16px 16px;
  }
  .head-info {
    flex-basis: calc(100% - 130px);
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
  .stats li {
    padding: 12px 8px;
  }
  .content {
    padding: 16px;
  }
  .meta div {
    grid-template-columns: 120px 1fr;
  }
}
@media (max-width: 650px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>