<script setup>
import { categoryCards } from "@/data/categories";
const query = defineModel("query", { type: String, default: "" });
defineEmits(["pick-category"]);

const categories = categoryCards.map((c) => c.name);

const stats = [
  { icon: "store", number: "500+", label: "Produk Lokal" },
  { icon: "users", number: "200+", label: "UMKM Terdaftar" },
  { icon: "shield", number: "100%", label: "Karya Anak Bangsa" },
];

const goSearch = () =>
  document.getElementById("umkm")?.scrollIntoView({ behavior: "smooth" });
</script>

<template>
  <div>
    <section id="beranda" class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1>
            Menghubungkan UMKM,
            <span>Membangun Indonesia.</span>
          </h1>

          <p class="hero-description">
            ARUNA menghubungkan kamu dengan produk dan jasa berkualitas dari
            pelaku UMKM di seluruh Indonesia. Pilih wilayahmu dan temukan UMKM
            terdekat.
          </p>

          <div class="hero-search">
            <svg viewBox="0 0 24 24" fill="none">
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
              v-model="query"
              type="text"
              placeholder="Cari produk, jasa, atau toko UMKM..."
              @keyup.enter="goSearch"
            />
            <button type="button" @click="goSearch">Cari</button>
          </div>

          <div class="popular-categories">
            <span>Populer:</span>
            <a
              v-for="c in categories"
              :key="c"
              href="#umkm"
              @click="$emit('pick-category', c)"
              >{{ c }}</a
            >
          </div>
        </div>

        <div class="hero-visual">
          <span class="leaf leaf-1"></span>
          <span class="leaf leaf-2"></span>
          <span class="leaf leaf-3"></span>
          <img
            class="hero-person"
            src="/images/aruna-hero.png"
            alt="Perempuan membawa produk kerajinan UMKM dengan latar Monas dan Borobudur"
          />
        </div>
      </div>
    </section>

    <div class="stats-wrap">
      <div class="stats-bar">
        <div class="stat-item" v-for="s in stats" :key="s.label">
          <div class="stat-icon">
            <svg v-if="s.icon === 'store'" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 10L5 4H19L21 10"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M4 10V20H20V10"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M9 20V14H15V20"
                stroke="currentColor"
                stroke-width="1.8"
              />
            </svg>
            <svg v-else-if="s.icon === 'users'" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3" fill="currentColor" />
              <circle cx="17" cy="9" r="2.5" fill="currentColor" />
              <path
                d="M3 20C3 16.7 5.7 14 9 14C12.3 14 15 16.7 15 20"
                fill="currentColor"
              />
              <path
                d="M15 15C18.3 14.7 21 16.8 21 20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L20 5V11C20 16 16.5 20 12 22C7.5 20 4 16 4 11V5L12 2Z"
                fill="currentColor"
              />
              <path
                d="M8 12L11 15L16 9"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="stat-text">
            <strong>{{ s.number }}</strong>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  overflow: hidden;
  background:
    radial-gradient(
      circle at 75% 20%,
      rgba(208, 231, 255, 0.7),
      transparent 32%
    ),
    linear-gradient(110deg, #f4f9ff 0%, #eaf4ff 100%);
}

.hero-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 7% 0;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 24px;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding-bottom: 60px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e4effc;
  border-radius: 20px;
  color: #263f5e;
  font-size: 11px;
  font-weight: 500;
  box-shadow: 0 3px 12px rgba(38, 85, 140, 0.04);
}
.badge-icon {
  color: #0872df;
  font-size: 15px;
}

.hero-content h1 {
  max-width: 620px;
  margin-bottom: 16px;
  color: #142d4e;
  font-size: clamp(32px, 3.6vw, 58px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -1.7px;
}
.hero-content h1 span {
  display: block;
  color: #0865d8;
}

.hero-description {
  max-width: 540px;
  margin-bottom: 22px;
  color: #405875;
  font-size: 14px;
  line-height: 1.85;
}

.hero-search {
  width: 100%;
  max-width: 560px;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background: #fff;
  border: 1px solid #e5effb;
  border-radius: 11px;
  box-shadow: 0 5px 18px rgba(36, 88, 150, 0.08);
}
.hero-search svg {
  width: 17px;
  height: 17px;
  margin-left: 9px;
  flex-shrink: 0;
  color: #7891ae;
}
.hero-search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #243b5a;
  font-size: 12px;
}
.hero-search input::placeholder {
  color: #98aabe;
}
.hero-search button {
  height: 40px;
  min-width: 88px;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: #0865d8;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s ease;
}
.hero-search button:hover {
  background: #0754b5;
}

.popular-categories {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.popular-categories > span {
  color: #5c718a;
  font-size: 11px;
}
.popular-categories a {
  padding: 5px 12px;
  border: 1px solid #e6eef8;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  color: #405875;
  font-size: 11px;
  transition: 0.2s ease;
}
.popular-categories a:hover {
  color: #0865d8;
  border-color: #0865d8;
  background: #fff;
}

/* FOTO HERO */
.hero-visual {
  min-width: 0;
  height: 460px;
  position: relative;
  isolation: isolate;
}
.leaf {
  position: absolute;
  z-index: 0;
  background: linear-gradient(145deg, #d6e9ff, #8fc2f5);
  border-radius: 0 100% 0 100%;
  opacity: 0.6;
}
.leaf-1 {
  width: 38%;
  height: 54%;
  left: 2%;
  bottom: 10%;
  transform: rotate(-12deg);
}
.leaf-2 {
  width: 32%;
  height: 46%;
  right: 0;
  top: 2%;
  transform: rotate(18deg);
}
.leaf-3 {
  width: 24%;
  height: 34%;
  right: 14%;
  bottom: 8%;
  transform: rotate(-30deg);
  opacity: 0.4;
}
.hero-person {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  transform: translateX(-50%);
}

/* BAR STATISTIK */
.stats-wrap {
  position: relative;
  z-index: 3;
  margin-top: -36px;
  padding: 0 4px;
}
.stats-bar {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(36, 91, 153, 0.1);
}
.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px 12px;
}
.stat-item + .stat-item {
  border-left: 1px solid #e5edf7;
}
.stat-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #0865d8;
}
.stat-icon svg {
  width: 32px;
  height: 32px;
}
.stat-text {
  display: flex;
  flex-direction: column;
}
.stat-text strong {
  color: #142d4e;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
}
.stat-text span {
  color: #526982;
  font-size: 13px;
}

@media (max-width: 950px) {
  .hero-container {
    grid-template-columns: 1fr;
    padding-top: 40px;
  }
  .hero-content {
    padding-bottom: 0;
  }
  .hero-visual {
    height: 400px;
  }
}

@media (max-width: 650px) {
  .hero-container {
    padding: 32px 6% 0;
  }
  .hero-description {
    font-size: 13px;
  }
  .hero-search {
    height: 46px;
  }
  .hero-search button {
    height: 36px;
    min-width: 66px;
  }
  .hero-visual {
    height: 330px;
  }
  .stats-bar {
    width: 88%;
    grid-template-columns: 1fr;
  }
  .stat-item {
    justify-content: flex-start;
    padding: 14px 20px;
  }
  .stat-item + .stat-item {
    border-left: none;
    border-top: 1px solid #e5edf7;
  }
}
</style>
