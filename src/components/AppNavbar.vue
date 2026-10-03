<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const active = ref("beranda");
let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) active.value = e.target.id;
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  ["beranda", "kategori", "umkm"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <a href="#beranda" class="brand">
        <img src="/images/aruna-logo.png" alt="Logo ARUNA" />
      </a>

      <nav class="nav-menu" aria-label="Menu utama">
        <a
          href="#beranda"
          class="nav-link"
          :class="{ active: active === 'beranda' }"
          >Beranda</a
        >
        <a
          href="#kategori"
          class="nav-link"
          :class="{ active: active === 'kategori' }"
          >Kategori</a
        >
        <a href="#umkm" class="nav-link" :class="{ active: active === 'umkm' }"
          >Jelajah UMKM</a
        >
        <a href="#tentang" class="nav-link">Tentang Kami</a>
        <a href="#artikel" class="nav-link">Artikel</a>
      </nav>

      <div class="nav-actions">
        <button class="cart-button" type="button" aria-label="Keranjang">
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

        <button class="login-button" type="button">Masuk</button>
        <button class="register-button" type="button">Daftar</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  height: 68px;
  width: 100%;
  background: #fff;
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
  content: "";
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
  color: #fff;
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
  background: #fff;
}
.register-button {
  color: #fff;
  background: #0865d8;
  border: 1px solid #0865d8;
}
.register-button:hover {
  background: #0754b5;
}

@media (max-width: 1200px) {
  .navbar-container {
    padding: 0 4%;
    gap: 15px;
  }
  .nav-menu {
    gap: 17px;
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
}

@media (max-width: 380px) {
  .nav-menu {
    gap: 12px;
  }
  .nav-link {
    font-size: 10px;
  }
}
</style>
