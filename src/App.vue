<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')

const currentPage = ref(
  window.location.hash === '#kategori' ? 'kategori' : 'beranda'
)

const updatePage = () => {
  currentPage.value =
    window.location.hash === '#kategori' ? 'kategori' : 'beranda'
}

onMounted(() => {
  window.addEventListener('hashchange', updatePage)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updatePage)
})

const categoryCards = [
  {
    name: 'Makanan',
    count: '120+ produk',
    image: '/images/kategori-makanan.jpg'
  },
  {
    name: 'Minuman',
    count: '85+ produk',
    image: '/images/kategori-minuman.jpg'
  },
  {
    name: 'Kerajinan',
    count: '200+ produk',
    image: '/images/kategori-kerajinan.jpg'
  },
  {
    name: 'Fashion',
    count: '150+ produk',
    image: '/images/kategori-fashion.jpg'
  },
  {
    name: 'Home Decor',
    count: '95+ produk',
    image: '/images/kategori-home-decor.jpg'
  }
]

const filteredCategoryCards = computed(() => {
  return categoryCards.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const categories = [
  'Makanan',
  'Minuman',
  'Kerajinan',
  'Fashion',
  'Home Decor'
]

const stats = [
  {
    icon: 'store',
    number: '500+',
    label: 'Produk Lokal'
  },
  {
    icon: 'users',
    number: '200+',
    label: 'UMKM Terdaftar'
  },
  {
    icon: 'shield',
    number: '100%',
    label: 'Karya Anak Bangsa'
  }
]

const searchProducts = () => {
  console.log('Mencari produk:', searchQuery.value)
}
</script>

<template>
  <div class="home-page">

    <!-- NAVBAR -->
    <header class="navbar">
      <div class="navbar-container">

        <a href="#" class="brand">
          <img
            src="/images/aruna-logo.png"
            alt="Logo ARUNA"
          />
        </a>
<nav class="nav-menu">
  <a
    href="#"
    class="nav-link"
    :class="{ active: currentPage === 'beranda' }"
  >
    Beranda
  </a>

  <a
    href="#kategori"
    class="nav-link"
    :class="{ active: currentPage === 'kategori' }"
  >
    Kategori
  </a>

  <a href="#produk" class="nav-link">Produk</a>
  <a href="#tentang" class="nav-link">Tentang Kami</a>
  <a href="#artikel" class="nav-link">Artikel</a>
</nav>

        <div class="nav-actions">
          <div class="nav-search">
            <input
              type="text"
              placeholder="Cari produk, kategori, atau toko..."
              v-model="searchQuery"
              @keyup.enter="searchProducts"
            />
            <button @click="searchProducts" aria-label="Cari">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M16 16L21 21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <button class="cart-button" aria-label="Keranjang">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4H5L7.5 16H18L21 7H6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="17" cy="20" r="1.5" fill="currentColor" />
            </svg>
            <span class="cart-count">0</span>
          </button>

          <button class="login-button">Masuk</button>
          <button class="register-button">Daftar</button>
        </div>

      </div>
    </header>

    <!-- HERO SECTION -->
   <main v-if="currentPage === 'beranda'">
  <section class="hero">

        <div class="hero-container">

          <!-- BAGIAN KIRI -->
          <div class="hero-content">

            <div class="hero-badge">
              <span class="badge-icon">✦</span>
              Bersama ARUNA, UMKM Indonesia Lebih Maju
            </div>

            <h1>
              Temukan Produk Lokal,
              <span>Bangga Buatan Indonesia.</span>
            </h1>

            <p class="hero-description">
              ARUNA hadir untuk menghubungkan kamu dengan
              berbagai produk unggulan dari UMKM di seluruh
              Indonesia. Dukung produk lokal, dukung ekonomi bangsa.
            </p>

            <!-- SEARCH -->
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
                type="text"
                placeholder="Cari produk, kategori, atau toko UMKM..."
                v-model="searchQuery"
                @keyup.enter="searchProducts"
              />

              <button @click="searchProducts">Cari</button>
            </div>

            <!-- KATEGORI POPULER -->
            <div class="popular-categories">
              <span>Populer:</span>

              <a
                v-for="category in categories"
                :key="category"
                href="#kategori"
              >
                {{ category }}
              </a>
            </div>

            <!-- STATISTIK -->
            <div class="hero-stats">
              <div
                class="stat-item"
                v-for="stat in stats"
                :key="stat.label"
              >
                <div class="stat-icon">
                  <svg
                    v-if="stat.icon === 'store'"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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

                  <svg
                    v-else-if="stat.icon === 'users'"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="9"
                      cy="8"
                      r="3"
                      fill="currentColor"
                    />
                    <circle
                      cx="17"
                      cy="9"
                      r="2.5"
                      fill="currentColor"
                    />
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

                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  <strong>{{ stat.number }}</strong>
                  <span>{{ stat.label }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- BAGIAN KANAN -->
          <div class="hero-visual">

            <div class="scenery scenery-one"></div>
            <div class="scenery scenery-two"></div>

            <div class="mountain">
              <div class="mountain-snow"></div>
            </div>

            <div class="temple temple-left">
              <div class="temple-roof"></div>
              <div class="temple-body"></div>
              <div class="temple-base"></div>
            </div>

            <div class="temple temple-right">
              <div class="temple-roof"></div>
              <div class="temple-body"></div>
              <div class="temple-base"></div>
            </div>

          

            <img
              class="hero-person"
              src="/images/aruna-hero.png"
              alt="Perempuan mengenakan pakaian tradisional Indonesia"
            />


          </div>

        </div>
      </section>
 
      

    </main>

<!-- HALAMAN KATEGORI -->
<section id="kategori" class="category-page">
  <div class="category-container">

    

    <!-- JUDUL -->
    <div class="category-heading">
      <h1>
        Jelajahi <span>Kategori</span>
      </h1>

      <p>
        Temukan berbagai produk unggulan dari UMKM Indonesia.
      </p>
    </div>

    <!-- PENCARIAN KATEGORI -->
    <div class="category-search">
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
        type="text"
        placeholder="Cari kategori..."
        v-model="searchQuery"
      />

      <button type="button">Cari</button>
    </div>

    <!-- KARTU KATEGORI -->
    <div class="category-grid">
      <a
        v-for="category in filteredCategoryCards"
        :key="category.name"
        href="#produk"
        class="category-card"
      >
        <div class="category-image">
          <img :src="category.image" :alt="category.name" />
        </div>

        <div class="category-card-content">
          <div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }}</p>
          </div>

          <span class="category-arrow">→</span>
        </div>
      </a>
    </div>

    <!-- BANNER -->
    <div class="category-banner">
      <div class="category-banner-content">
        <h2>
          Dukung <span>Produk Lokal</span>
        </h2>

        <p>
          Temukan karya terbaik dari pelaku UMKM Indonesia.
        </p>

        <a href="#produk" class="category-banner-button">
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

<!-- HALAMAN BERANDA -->

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Poppins', sans-serif;
  color: #142d4e;
  background: #f4f9ff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
}

button,
input {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}

/* NAVBAR */

/* NAVBAR */

.navbar {
  height: 68px;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e8eff8;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand img {
  width: 150px;
  height: 45px;
  object-fit: contain;
  object-position: left center;
}

.nav-menu {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 27px;
}

.nav-link {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  font-size: 12px;
  font-weight: 500;
  color: #293c57;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #0865d8;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0865d8;
  border-radius: 5px 5px 0 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-search {
  width: 180px;
  height: 30px;
  display: flex;
  align-items: center;
  background: #f2f7fd;
  border: 1px solid #e5edf7;
  border-radius: 20px;
  overflow: hidden;
}

.nav-search input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 10px;
  border: none;
  outline: none;
  background: transparent;
  color: #243b5a;
  font-size: 9px;
}

.nav-search input::placeholder {
  color: #9baec5;
}

.nav-search button {
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #0865d8;
  color: #ffffff;
  display: grid;
  place-items: center;
}

.nav-search button svg {
  width: 13px;
  height: 13px;
}

.cart-button {
  position: relative;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #18385f;
  display: grid;
  place-items: center;
}

.cart-button svg {
  width: 18px;
  height: 18px;
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  display: grid;
  place-items: center;
  background: #ed3535;
  color: white;
  border-radius: 50%;
  font-size: 8px;
}

.login-button,
.register-button {
  height: 30px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.login-button {
  color: #0865d8;
  border: 1px solid #0865d8;
  background: white;
}

.register-button {
  color: white;
  background: #0865d8;
  border: 1px solid #0865d8;
}

/* HERO */

.hero {
  min-height: calc(100vh - 68px);
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(
      circle at 75% 20%,
      rgba(208, 231, 255, 0.7),
      transparent 30%
    ),
    linear-gradient(110deg, #f4f9ff 0%, #eaf4ff 100%);
}

.hero-container {
  max-width: 1440px;
  min-height: calc(100vh - 68px);
  margin: 0 auto;
  padding: 10px 7% 35px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 25px;
}

/* KONTEN KIRI */

.hero-content {
  position: relative;
  z-index: 2;
  padding-bottom: 12px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.8);
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
  max-width: 650px;
  margin-bottom: 16px;
  color: #142d4e;
  font-size: clamp(30px, 3.4vw, 56px);
  font-weight: 800;
  line-height: 1.13;
  letter-spacing: -1.7px;
}

.hero-content h1 span {
  display: block;
  color: #0865d8;
}

.hero-description {
  max-width: 570px;
  margin-bottom: 20px;
  color: #405875;
  font-size: 13px;
  line-height: 1.85;
  font-weight: 400;
}

/* SEARCH UTAMA */

.hero-search {
  width: 100%;
  max-width: 580px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background: white;
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
  font-size: 11px;
}

.hero-search input::placeholder {
  color: #98aabe;
}

.hero-search button {
  height: 38px;
  min-width: 85px;
  border: none;
  border-radius: 7px;
  color: white;
  background: #0865d8;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.hero-search button:hover,
.register-button:hover {
  background: #0754b5;
}

/* KATEGORI */

.popular-categories {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.popular-categories > span {
  color: #5c718a;
  font-size: 10px;
}

.popular-categories a {
  padding: 5px 11px;
  border: 1px solid #e6eef8;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.65);
  color: #405875;
  font-size: 9px;
  transition: 0.2s ease;
}

.popular-categories a:hover {
  color: #0865d8;
  border-color: #0865d8;
  background: white;
}

/* STATISTIK */

.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 28px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: #0865d8;
}

.stat-icon svg {
  width: 25px;
  height: 25px;
}

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-text strong {
  color: #142d4e;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.2;
}

.stat-text span {
  color: #526982;
  font-size: 9px;
  white-space: nowrap;
}

/* BAGIAN KANAN */

.hero-visual {
  min-width: 0;
  height: 510px;
  position: relative;
  align-self: end;
  overflow: visible;
  isolation: isolate;
  transform: translateY(-30px);
}

.scenery {
  position: absolute;
  z-index: -2;
  bottom: 0;
  width: 100%;
  height: 78%;
  border-radius: 45% 45% 0 0;
}

.scenery-one {
  background:
    radial-gradient(
      ellipse at 50% 50%,
      rgba(255, 255, 255, 0.65),
      transparent 60%
    ),
    linear-gradient(
      180deg,
      rgba(211, 233, 255, 0.1),
      rgba(139, 193, 232, 0.4)
    );
}

.scenery-two {
  bottom: 0;
  height: 35%;
  border-radius: 50% 50% 0 0;
  background: linear-gradient(
    180deg,
    rgba(147, 202, 130, 0.1),
    rgba(113, 172, 94, 0.32)
  );
}

/* GUNUNG */

.mountain {
  position: absolute;
  z-index: -1;
  top: 23%;
  right: 16%;
  width: 38%;
  height: 35%;
  background: linear-gradient(145deg, #6eadd2, #27729f 75%);
  clip-path: polygon(
    0 100%,
    20% 55%,
    35% 65%,
    58% 0,
    100% 100%
  );
  opacity: 0.75;
}

.mountain-snow {
  position: absolute;
  top: 0;
  left: 40%;
  width: 30%;
  height: 35%;
  background: #f2f8ff;
  clip-path: polygon(60% 0, 100% 60%, 65% 43%, 40% 80%, 0 100%);
}

/* ILUSTRASI CANDI */

.temple {
  position: absolute;
  z-index: -1;
  bottom: 19%;
  width: 55px;
  height: 110px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.temple-left {
  left: 11%;
  transform: scale(0.9);
}

.temple-right {
  right: 5%;
  transform: scale(1.15);
}

.temple-roof {
  width: 35px;
  height: 32px;
  background: #74634d;
  clip-path: polygon(
    50% 0,
    100% 100%,
    0 100%
  );
}

.temple-body {
  width: 29px;
  height: 58px;
  background: repeating-linear-gradient(
    180deg,
    #8d7659 0,
    #8d7659 9px,
    #6f5d46 10px,
    #6f5d46 13px
  );
  border-left: 5px solid #65543f;
  border-right: 5px solid #65543f;
}

.temple-base {
  width: 48px;
  height: 12px;
  background: #756147;
  box-shadow: 0 6px 0 #8c775b;
}

/* TEKS LOKAL */

.local-text {
  position: absolute;
  top: 5%;
  right: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #18385f;
  font-size: 17px;
  font-style: italic;
  line-height: 1.25;
  transform: rotate(-9deg);
  z-index: 2;
}

.local-flag {
  width: 35px;
  height: 15px;
  margin-top: 5px;
  transform: rotate(-5deg);
}

.local-flag span {
  display: block;
  width: 100%;
  height: 50%;
}

.local-flag span:first-child {
  background: #e33434;
}

.local-flag span:last-child {
  background: #ffffff;
}

/* GAMBAR ORANG */

.hero-person {
  position: absolute;
  z-index: 1;
  bottom: -7px;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  transform: translateX(-50%);

}

/* KARTU PRODUK */

.product-card {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 25px;
  width: 270px;
  min-height: 75px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e9f0fa;
  border-radius: 13px;
  box-shadow: 0 8px 25px rgba(24, 67, 117, 0.12);
}

.product-card-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #eaf4ff;
}

.product-card-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.product-card-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-card-text strong {
  color: #142d4e;
  font-size: 11px;
  font-weight: 600;
}

.product-card-text span {
  color: #63778f;
  font-size: 10px;
  line-height: 1.5;
}

.product-arrow {
  margin-left: auto;
  color: #0865d8;
  font-size: 19px;
}

/* RESPONSIVE */

@media (min-width: 1441px) {
  .hero-container {
    padding-top: 10px;
  }
}

@media (max-width: 1200px) {
  .navbar-container {
    padding: 0 4%;
    gap: 15px;
  }

  .nav-menu {
    gap: 17px;
  }

  .nav-search {
    width: 145px;
  }

  .hero-container {
    padding-left: 5%;
    padding-right: 5%;
  }

  .hero-stats {
    gap: 18px;
  }
}

@media (max-width: 950px) {
  .navbar {
    height: auto;
    min-height: 65px;
  }

  .navbar-container {
    min-height: 65px;
    flex-wrap: wrap;
    padding: 10px 4%;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    height: 35px;
    justify-content: center;
  }

  .nav-link {
    height: 35px;
  }

  .hero-container {
    grid-template-columns: 1fr 0.9fr;
    padding-top: 55px;
    gap: 10px;
  }

  .hero-content h1 {
    font-size: clamp(28px, 4vw, 42px);
  }

  .hero-visual {
    height: 430px;
  }

  .hero-stats {
    flex-wrap: wrap;
  }

  .product-card {
    width: 235px;
  }
}

@media (max-width: 650px) {
  .navbar-container {
    gap: 10px;
  }

  .brand img {
    width: 125px;
  }

  .nav-actions {
    gap: 6px;
  }

  .nav-search {
    display: none;
  }

  .login-button,
  .register-button {
    padding: 0 11px;
  }

  .nav-menu {
    gap: 16px;
    overflow-x: auto;
    justify-content: flex-start;
  }

  .nav-link {
    font-size: 11px;
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 45px 6% 0;
    gap: 0;
  }

  .hero-content {
    width: 100%;
  }

  .hero-content h1 {
    font-size: clamp(31px, 8vw, 43px);
    letter-spacing: -1.2px;
  }

  .hero-description {
    font-size: 12px;
  }

  .hero-search {
    height: 45px;
  }

  .hero-search button {
    height: 35px;
    min-width: 65px;
  }

  .popular-categories {
    gap: 6px;
  }

  .hero-stats {
    gap: 18px;
    margin-top: 24px;
  }

  .stat-item {
    gap: 6px;
  }

  .stat-text strong {
    font-size: 16px;
  }

  .stat-text span {
    font-size: 8px;
  }

  .hero-visual {
    width: 100%;
    height: 400px;
    margin-top: 20px;
  }

  .product-card {
    right: 0;
    bottom: 15px;
    width: 230px;
  }

  .local-text {
    font-size: 14px;
  }
}

@media (max-width: 380px) {
  .nav-menu {
    gap: 12px;
  }

  .nav-link {
    font-size: 10px;
  }

  .hero-stats {
    gap: 12px;
  }

  .stat-icon {
    width: 22px;
  }

  .stat-icon svg {
    width: 21px;
  }

  .stat-text strong {
    font-size: 14px;
  }

  .hero-visual {
    height: 330px;
  }
}

/* =========================
   HALAMAN KATEGORI
========================= */

.category-page {
  min-height: calc(100vh - 68px);
  padding: 28px 0 34px;
  background: linear-gradient(
    110deg,
    #f4f9ff 0%,
    #edf6ff 48%,
    #e1f0ff 100%
  );
  overflow: hidden;
}

.category-container {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
}

/* BREADCRUMB */

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7386a0;
  font-size: 13px;
  margin-bottom: 28px;
}

.breadcrumb a {
  color: #58799f;
  font-size: 22px;
}

.breadcrumb-separator {
  color: #9aabc0;
}

.breadcrumb-active {
  color: #263e5e;
  font-weight: 500;
}

/* JUDUL */

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

/* PENCARIAN */

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

/* KARTU KATEGORI */

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 34px;
}

.category-card {
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 13px;
  box-shadow: 0 8px 22px rgba(36, 91, 153, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(36, 91, 153, 0.13);
}

.category-image {
  width: 100%;
  height: 190px;
  overflow: hidden;
  background: #e9f1f8;
}

.category-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.04);
}

.category-card-content {
  min-height: 82px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
}

.category-card-content h3 {
  color: #142d4e;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
}

.category-card-content p {
  color: #72849b;
  font-size: 13px;
  margin-top: 1px;
}

.category-arrow {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0865d8;
  background: #f0f7ff;
  border: 1px solid #e0edfc;
  border-radius: 12px;
  font-size: 22px;
}

/* BANNER PRODUK LOKAL */

.category-banner {
  min-height: 202px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 17px;
  background: linear-gradient(
    105deg,
    #cfe5ff 0%,
    #e5f2ff 55%,
    #d3eaff 100%
  );
}

.category-banner::before,
.category-banner::after {
  content: '';
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

/* RESPONSIVE KATEGORI */

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
    padding-top: 22px;
  }

  .category-container {
    width: 88%;
  }

  .breadcrumb {
    margin-bottom: 22px;
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

  .category-image {
    height: 130px;
  }

  .category-card-content {
    min-height: 68px;
    padding: 9px 10px;
  }

  .category-card-content h3 {
    font-size: 13px;
  }

  .category-card-content p {
    font-size: 10px;
  }

  .category-arrow {
    width: 32px;
    height: 32px;
    font-size: 17px;
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

/* SECTION PRODUK UNGGULAN */

.home-extra {
  min-height: 400px;
  padding: 60px 7%;
  background: #ffffff;
}

.home-extra-container {
  max-width: 1440px;
  margin: 0 auto;
}

.home-extra h2 {
  font-size: 28px;
  font-weight: 700;
  color: #142d4e;
  margin-bottom: 10px;
}

.home-extra p {
  font-size: 14px;
  color: #64748b;
}
</style>