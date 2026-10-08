<script setup>
import { ref, computed } from "vue";
import { categoryCards } from "@/data/categories";
import { produkList } from "@/data/produk";

const category = defineModel("category", { type: String, default: "Semua" });
const catSearch = ref("");

const countOf = (name) => produkList.filter((p) => p.category === name).length;

const filteredCards = computed(() =>
  categoryCards.filter((c) =>
    c.name.toLowerCase().includes(catSearch.value.toLowerCase()),
  ),
);

function pick(name) {
  category.value = category.value === name ? "Semua" : name;
  document.getElementById("umkm")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <section id="kategori" class="category-page">
    <div class="category-container">
      <div class="category-heading">
        <h1>Jelajahi <span>Kategori</span></h1>
        <p>Temukan berbagai produk unggulan dari UMKM Indonesia.</p>
      </div>

      <div class="category-search">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="10.8"
            cy="10.8"
            r="6.8"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M16 16L21 21"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <input
          v-model="catSearch"
          type="text"
          placeholder="Cari kategori..."
          aria-label="Cari kategori"
        />
        <button type="button">Cari</button>
      </div>

      <div v-if="filteredCards.length" class="category-grid">
        <button
          v-for="c in filteredCards"
          :key="c.name"
          type="button"
          class="category-card"
          :class="{ on: category === c.name }"
          :aria-pressed="category === c.name"
          @click="pick(c.name)"
        >
          <span class="cat-icon" :style="{ background: c.bg, color: c.color }">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              v-html="c.icon"
            ></svg>
          </span>
          <strong>{{ c.name }}</strong>
          <span class="cat-count">{{ countOf(c.name) }} produk</span>
        </button>
      </div>
      <p v-else class="cat-empty">Kategori tidak ditemukan.</p>

      <div class="category-banner">
        <div class="category-banner-content">
          <h2>Dukung <span>Produk Lokal</span></h2>
          <p>Temukan karya terbaik dari pelaku UMKM Indonesia.</p>
          <a href="#umkm" class="category-banner-button">
            Lihat Produk
            <span>→</span>
          </a>
        </div>
        <img
          src="/images/aruna-category-banner.png"
          alt="Produk lokal dan kerajinan Indonesia"
          class="category-banner-image"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-page {
  padding: 56px 0 48px;
  background: linear-gradient(110deg, #f4f9ff 0%, #edf6ff 48%, #e1f0ff 100%);
  overflow: hidden;
}
.category-container {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
}

.category-heading {
  margin-bottom: 25px;
}
.category-heading h1 {
  color: #142d4e;
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.2;
}
.category-heading h1 span {
  color: #0865d8;
}
.category-heading p {
  color: #647994;
  font-size: 16px;
  margin-top: 5px;
}

.category-search {
  width: 69%;
  height: 62px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 6px 8px 6px 22px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 13px;
  box-shadow: 0 8px 24px rgba(36, 91, 153, 0.06);
  margin-bottom: 32px;
}
.category-search svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #6685aa;
}
.category-search input {
  width: 100%;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  color: #263e5e;
  background: transparent;
  font-size: 14px;
}
.category-search input::placeholder {
  color: #9aabc0;
}
.category-search button {
  height: 48px;
  min-width: 115px;
  border: none;
  border-radius: 10px;
  color: #fff;
  background: #0865d8;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease;
}
.category-search button:hover {
  background: #0755b7;
}

/* KARTU KATEGORI (IKON) */
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 34px;
}

.category-card {
  min-width: 0;
  padding: 26px 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: inherit;
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(36, 91, 153, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(36, 91, 153, 0.13);
}
.category-card.on {
  border-color: #0865d8;
  box-shadow: 0 0 0 2px rgba(8, 101, 216, 0.25);
}

.cat-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin-bottom: 4px;
  border-radius: 16px;
}
.cat-icon svg {
  width: 32px;
  height: 32px;
}
.category-card strong {
  color: #142d4e;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}
.cat-count {
  color: #72849b;
  font-size: 12px;
}
.cat-empty {
  margin-bottom: 34px;
  color: #647994;
  font-size: 14px;
}

/* BANNER */
.category-banner {
  min-height: 202px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 17px;
  background: linear-gradient(105deg, #cfe5ff 0%, #e5f2ff 55%, #d3eaff 100%);
}
.category-banner::before,
.category-banner::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  pointer-events: none;
}
.category-banner::before {
  left: -110px;
  bottom: -180px;
}
.category-banner::after {
  left: 250px;
  top: -240px;
}

.category-banner-content {
  width: 52%;
  position: relative;
  z-index: 2;
  padding: 24px 60px;
}
.category-banner-content h2 {
  color: #142d4e;
  font-size: clamp(25px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.25;
}
.category-banner-content h2 span {
  color: #0865d8;
}
.category-banner-content p {
  color: #647994;
  font-size: 14px;
  margin-top: 5px;
}
.category-banner-button {
  width: 205px;
  height: 52px;
  margin-top: 14px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: #0865d8;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease;
}
.category-banner-button:hover {
  background: #0755b7;
}
.category-banner-button span {
  font-size: 22px;
}
.category-banner-image {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  width: 58%;
  height: 100%;
  object-fit: contain;
  object-position: right bottom;
  pointer-events: none;
}

@media (max-width: 1100px) {
  .category-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .category-search {
    width: 100%;
  }
  .category-banner-content {
    padding-left: 35px;
  }
}

@media (max-width: 650px) {
  .category-page {
    padding-top: 40px;
  }
  .category-container {
    width: 88%;
  }
  .category-heading h1 {
    font-size: 36px;
    letter-spacing: -1.2px;
  }
  .category-heading p {
    font-size: 12px;
  }
  .category-search {
    height: 52px;
    gap: 9px;
    padding-left: 13px;
    margin-bottom: 22px;
  }
  .category-search button {
    min-width: 68px;
    height: 40px;
    font-size: 12px;
  }
  .category-search input {
    font-size: 12px;
  }
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }
  .category-card {
    padding: 20px 10px 16px;
  }
  .cat-icon {
    width: 52px;
    height: 52px;
  }
  .cat-icon svg {
    width: 26px;
    height: 26px;
  }
  .category-card strong {
    font-size: 13px;
  }
  .category-banner {
    min-height: 260px;
    align-items: flex-start;
  }
  .category-banner-content {
    width: 100%;
    padding: 22px;
  }
  .category-banner-content h2 {
    font-size: 25px;
  }
  .category-banner-content p {
    max-width: 230px;
    font-size: 11px;
  }
  .category-banner-button {
    width: 155px;
    height: 42px;
    font-size: 12px;
  }
  .category-banner-image {
    width: 75%;
    height: 58%;
  }
}
</style>
