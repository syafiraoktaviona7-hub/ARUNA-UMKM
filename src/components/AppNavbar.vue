<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";
import { useAuth } from "@/composables/useAuth";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";

const route = useRoute();

// Cart
const { count, open, close } = useCart();

// Auth
const { user, isLoggedIn, logout } = useAuth();

const active = ref("beranda");
const showRegisterModal = ref(false);
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

// Daftar menu (dipakai oleh menu desktop dan menu HP)
const links = [
  { label: "Beranda", to: "/#beranda", id: "beranda" },
  { label: "Kategori", to: "/#kategori", id: "kategori" },
  { label: "Jelajahi Produk", to: "/#umkm", id: "umkm" },
  { label: "Jelajahi Jasa", to: "/#jasa", id: "jasa" },
  { label: "Tentang Kami", to: "/#tentang", id: "tentang" },
  { label: "Artikel", to: "/#artikel", id: "artikel" },
];

function isActive(l) {
  if (l.id === "umkm" && route.name === "products") return true;
  return route.name === "home" && active.value === l.id;
}

let observer;

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

function closeUserMenu() {
  showUserMenu.value = false;
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function closeMobileMenu() {
  showMobileMenu.value = false;
}

function openRegister() {
  closeMobileMenu();
  showRegisterModal.value = true;
}

function handleLogout() {
  closeUserMenu();
  closeMobileMenu();
  logout();
}

function handleOutsideClick(event) {
  if (!event.target.closest(".user-menu")) closeUserMenu();
  if (!event.target.closest(".navbar")) closeMobileMenu();
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeUserMenu();
    closeMobileMenu();
  }
}

function handleResize() {
  if (window.innerWidth > 950) closeMobileMenu();
}

function observe() {
  observer?.disconnect();

  if (route.name !== "home") return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          active.value = e.target.id;
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  links.forEach((l) => {
    const el = document.getElementById(l.id);
    if (el) observer.observe(el);
  });
}

watch(
  () => route.name,
  async (name) => {
    await nextTick();
    observe();

    // Halaman 404: keranjang tidak ditampilkan sama sekali
    if (name === "notfound") close?.();
  },
  { immediate: true },
);

// Tutup semua menu setiap pindah halaman atau bagian
watch(
  () => route.fullPath,
  () => {
    closeUserMenu();
    closeMobileMenu();
  },
);

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  observer?.disconnect();
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <RouterLink to="/#beranda" class="brand">
        <img src="/images/aruna-logo.png" alt="Logo ARUNA" />
      </RouterLink>

      <!-- Navigation (desktop) -->
      <nav class="nav-menu" aria-label="Menu utama">
        <RouterLink
          v-for="l in links"
          :key="l.id"
          :to="l.to"
          class="nav-link"
          :class="{ active: isActive(l) }"
        >
          {{ l.label }}
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="nav-actions">
        <!-- Cart (disembunyikan di halaman 404) -->
        <button
          v-if="route.name !== 'notfound'"
          class="cart-button"
          type="button"
          aria-label="Buka keranjang"
          @click="open"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

          <span v-if="count" class="cart-count">{{ count }}</span>
        </button>

        <!-- Login / profil (desktop) -->
        <div class="auth-desktop">
          <template v-if="!isLoggedIn">
            <RouterLink to="/login" class="login-button">Masuk</RouterLink>

            <button
              class="register-button"
              type="button"
              @click="showRegisterModal = true"
            >
              Daftar
            </button>
          </template>

          <div v-else class="user-menu">
            <button
              class="user-info"
              type="button"
              :aria-expanded="showUserMenu"
              aria-label="Buka menu profil"
              @click.stop="toggleUserMenu"
            >
              <div class="user-avatar">
                <img v-if="user?.photo" :src="user.photo" :alt="user?.name" />
                <span v-else>{{ user?.name?.charAt(0).toUpperCase() }}</span>
              </div>

              <div class="user-name">{{ user?.name }}</div>

              <span class="user-chevron" :class="{ open: showUserMenu }"
                >↓</span
              >
            </button>

            <Transition name="profile-dropdown">
              <div v-if="showUserMenu" class="profile-dropdown">
                <RouterLink
                  to="/profil"
                  class="profile-menu-item"
                  @click="closeUserMenu"
                >
                  <span class="profile-menu-icon">👤</span>
                  <span>Profil Saya</span>
                </RouterLink>

                <button class="profile-menu-item" type="button">
                  <span class="profile-menu-icon">📦</span>
                  <span>Riwayat Pesanan</span>
                </button>

                <button class="profile-menu-item" type="button">
                  <span class="profile-menu-icon">♡</span>
                  <span>Produk Favorit</span>
                </button>

                <div class="profile-divider"></div>

                <button
                  class="profile-menu-item logout"
                  type="button"
                  @click="handleLogout"
                >
                  <span class="profile-menu-icon">↩</span>
                  <span>Keluar</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Tombol menu (HP) -->
        <button
          class="burger"
          type="button"
          :class="{ open: showMobileMenu }"
          :aria-expanded="showMobileMenu"
          aria-controls="mobile-menu"
          :aria-label="showMobileMenu ? 'Tutup menu' : 'Buka menu'"
          @click.stop="toggleMobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Panel menu (HP): muncul ke bawah -->
    <Transition name="mobile-menu">
      <div v-if="showMobileMenu" id="mobile-menu" class="mobile-panel">
        <nav class="mobile-nav" aria-label="Menu utama">
          <RouterLink
            v-for="l in links"
            :key="l.id"
            :to="l.to"
            class="mobile-link"
            :class="{ active: isActive(l) }"
            @click="closeMobileMenu"
          >
            {{ l.label }}
          </RouterLink>
        </nav>

        <div class="mobile-auth">
          <!-- Belum login -->
          <div v-if="!isLoggedIn" class="mobile-auth-buttons">
            <RouterLink
              to="/login"
              class="m-btn outline"
              @click="closeMobileMenu"
            >
              Masuk
            </RouterLink>
            <button class="m-btn solid" type="button" @click="openRegister">
              Daftar
            </button>
          </div>

          <!-- Sudah login -->
          <template v-else>
            <div class="m-user">
              <div class="user-avatar">
                <img v-if="user?.photo" :src="user.photo" :alt="user?.name" />
                <span v-else>{{ user?.name?.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="m-user-name">{{ user?.name }}</div>
            </div>

            <RouterLink
              to="/profil"
              class="profile-menu-item"
              @click="closeMobileMenu"
            >
              <span class="profile-menu-icon">👤</span>
              <span>Profil Saya</span>
            </RouterLink>

            <button class="profile-menu-item" type="button">
              <span class="profile-menu-icon">📦</span>
              <span>Riwayat Pesanan</span>
            </button>

            <button class="profile-menu-item" type="button">
              <span class="profile-menu-icon">♡</span>
              <span>Produk Favorit</span>
            </button>

            <button
              class="profile-menu-item logout"
              type="button"
              @click="handleLogout"
            >
              <span class="profile-menu-icon">↩</span>
              <span>Keluar</span>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Latar gelap di belakang panel menu (HP) -->
  <Transition name="fade">
    <div
      v-if="showMobileMenu"
      class="mobile-overlay"
      aria-hidden="true"
      @click="closeMobileMenu"
    ></div>
  </Transition>

  <!-- Register Role Modal -->
  <RegisterRoleModal
    v-if="showRegisterModal"
    @close="showRegisterModal = false"
  />
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
  text-decoration: none;
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

.auth-desktop {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* =========================
   USER MENU
========================= */

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.user-info {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px 0 5px;
  border: 1px solid #dce8f6;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  color: #18385f;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.user-info:hover {
  border-color: #bcd5f2;
  background: #fbfdff;
  box-shadow: 0 4px 14px rgba(8, 101, 216, 0.08);
}

.user-avatar {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #0865d8;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
}

.user-name {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #18385f;
  font-size: 11px;
  font-weight: 600;
}

.user-chevron {
  font-size: 12px;
  color: #6d86a3;
  line-height: 1;
  transition: transform 0.2s ease;
}

.user-chevron.open {
  transform: rotate(180deg);
}

/* =========================
   PROFILE DROPDOWN
========================= */

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
  padding: 8px;
  background: #fff;
  border: 1px solid #e4edf7;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(24, 56, 95, 0.12);
  z-index: 1100;
}

.profile-menu-item {
  width: 100%;
  min-height: 42px;
  box-sizing: border-box;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 11px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #29415f;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.profile-menu-item:hover {
  background: #f1f7ff;
  color: #0865d8;
}

.profile-menu-icon {
  width: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0865d8;
  font-size: 15px;
}

.profile-divider {
  height: 1px;
  margin: 6px 4px;
  background: #edf3fa;
}

.profile-menu-item.logout,
.profile-menu-item.logout .profile-menu-icon {
  color: #c62828;
}

.profile-menu-item.logout:hover {
  background: #fdecec;
  color: #c62828;
}

/* =========================
   DROPDOWN ANIMATION
========================= */

.profile-dropdown-enter-active,
.profile-dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top right;
}

.profile-dropdown-enter-from,
.profile-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-7px) scale(0.98);
}

/* =========================
   CART
========================= */

.cart-button {
  position: relative;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #18385f;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}

.cart-button:hover {
  color: #0865d8;
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
  font-weight: 600;
  line-height: 1;
}

/* =========================
   LOGIN / REGISTER
========================= */

.login-button,
.register-button {
  height: 30px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.login-button {
  color: #0865d8;
  border: 1px solid #0865d8;
  background: #fff;
}

.login-button:hover {
  background: #f1f7ff;
}

.register-button {
  color: #fff;
  background: #0865d8;
  border: 1px solid #0865d8;
}

.register-button:hover {
  background: #0754b5;
}

/* =========================
   TOMBOL MENU (HP)
========================= */

.burger {
  display: none;
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid #dce8f6;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.burger:hover {
  background: #f1f7ff;
  border-color: #bcd5f2;
}

.burger span {
  position: absolute;
  left: 50%;
  width: 18px;
  height: 2px;
  margin-left: -9px;
  border-radius: 2px;
  background: #18385f;
  transition:
    transform 0.25s ease,
    top 0.25s ease,
    opacity 0.2s ease;
}

.burger span:nth-child(1) {
  top: 12px;
}

.burger span:nth-child(2) {
  top: 19px;
}

.burger span:nth-child(3) {
  top: 26px;
}

.burger.open {
  background: #eaf4ff;
  border-color: #0865d8;
}

.burger.open span {
  background: #0865d8;
}

.burger.open span:nth-child(1) {
  top: 19px;
  transform: rotate(45deg);
}

.burger.open span:nth-child(2) {
  opacity: 0;
}

.burger.open span:nth-child(3) {
  top: 19px;
  transform: rotate(-45deg);
}

/* =========================
   PANEL MENU (HP)
========================= */

.mobile-panel,
.mobile-overlay {
  display: none;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================
   TABLET / HP
========================= */

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
    height: 64px;
  }

  .navbar-container {
    flex-wrap: nowrap;
    padding: 0 4%;
    gap: 12px;
  }

  .nav-menu,
  .auth-desktop {
    display: none;
  }

  .nav-actions {
    gap: 8px;
    margin-left: auto;
  }

  .burger {
    display: inline-block;
  }

  .mobile-panel {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    padding: 8px 4% 22px;
    background: #fff;
    border-bottom: 1px solid #e8eff8;
    box-shadow: 0 18px 30px rgba(24, 56, 95, 0.14);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 64px 0 0 0;
    z-index: 900;
    background: rgba(20, 45, 78, 0.35);
  }

  .mobile-nav {
    display: grid;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 14px;
    border-bottom: 1px solid #f0f5fb;
    border-radius: 10px;
    color: #293c57;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .mobile-link::after {
    content: "›";
    color: #9aabc0;
    font-size: 22px;
    line-height: 1;
  }

  .mobile-link:hover {
    background: #f6faff;
  }

  .mobile-link.active {
    background: #eaf4ff;
    border-bottom-color: transparent;
    color: #0865d8;
    font-weight: 600;
  }

  .mobile-link.active::after {
    color: #0865d8;
  }

  .mobile-auth {
    display: grid;
    gap: 6px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #edf3fa;
  }

  .mobile-auth-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .m-btn {
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .m-btn.outline {
    border: 1px solid #0865d8;
    background: #fff;
    color: #0865d8;
  }

  .m-btn.outline:hover {
    background: #f1f7ff;
  }

  .m-btn.solid {
    border: 1px solid #0865d8;
    background: #0865d8;
    color: #fff;
  }

  .m-btn.solid:hover {
    background: #0754b5;
  }

  .m-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 12px;
    background: #f4f9ff;
  }

  .m-user .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 15px;
  }

  .m-user-name {
    color: #18385f;
    font-size: 14px;
    font-weight: 700;
  }

  .mobile-auth .profile-menu-item {
    min-height: 46px;
    font-size: 14px;
  }
}

@media (max-width: 650px) {
  .navbar-container {
    gap: 10px;
  }

  .brand img {
    width: 125px;
  }
}
</style>
