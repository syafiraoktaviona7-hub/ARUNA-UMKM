```vue
<script setup>
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();

// Cart
const { count, open } = useCart();

// Auth
const { user, isLoggedIn, logout } = useAuth();

const active = ref("beranda");
const showRegisterModal = ref(false);
const showUserMenu = ref(false);

let observer;

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

function closeUserMenu() {
  showUserMenu.value = false;
}

function handleOutsideClick(event) {
  const userMenu = event.target.closest(".user-menu");

  if (!userMenu) {
    closeUserMenu();
  }
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
    {
      rootMargin: "-40% 0px -55% 0px",
    },
  );

  const ids = [
    "beranda",
    "kategori",
    "umkm",
    "jasa",
    "tentang",
    "artikel",
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);

    if (el) {
      observer.observe(el);
    }
  });
}

watch(
  () => route.name,
  async () => {
    await nextTick();
    observe();
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">

      <!-- Logo -->
      <RouterLink to="/#beranda" class="brand">
        <img
          src="/images/aruna-logo.png"
          alt="Logo ARUNA"
        />
      </RouterLink>

      <!-- Navigation -->
      <nav class="nav-menu" aria-label="Menu utama">

        <RouterLink
          to="/#beranda"
          class="nav-link"
          :class="{
            active:
              route.name === 'home' &&
              active === 'beranda',
          }"
        >
          Beranda
        </RouterLink>

        <RouterLink
          to="/#kategori"
          class="nav-link"
          :class="{
            active:
              route.name === 'home' &&
              active === 'kategori',
          }"
        >
          Kategori
        </RouterLink>

        <RouterLink
          to="/#umkm"
          class="nav-link"
          :class="{
            active:
              (route.name === 'home' &&
                active === 'umkm') ||
              route.name === 'products',
          }"
        >
          Jelajahi Produk
        </RouterLink>

        <RouterLink
          to="/#jasa"
          class="nav-link"
          :class="{
            active:
              route.name === 'home' &&
              active === 'jasa',
          }"
        >
          Jelajahi Jasa
        </RouterLink>

        <RouterLink
          to="/#tentang"
          class="nav-link"
          :class="{
            active:
              route.name === 'home' &&
              active === 'tentang',
          }"
        >
          Tentang Kami
        </RouterLink>

        <RouterLink
          to="/#artikel"
          class="nav-link"
          :class="{
            active:
              route.name === 'home' &&
              active === 'artikel',
          }"
        >
          Artikel
        </RouterLink>

      </nav>

      <!-- Actions -->
      <div class="nav-actions">

        <!-- Cart -->
        <button
          class="cart-button"
          type="button"
          aria-label="Buka keranjang"
          @click="open"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 4H5L7.5 16H18L21 7H6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <circle
              cx="9"
              cy="20"
              r="1.5"
              fill="currentColor"
            />

            <circle
              cx="17"
              cy="20"
              r="1.5"
              fill="currentColor"
            />
          </svg>

          <span
            v-if="count"
            class="cart-count"
          >
            {{ count }}
          </span>
        </button>

  <!-- Login & Register -->
<template v-if="!isLoggedIn">

  <RouterLink
    to="/login"
    class="login-button"
  >
    Masuk
  </RouterLink>

  <button
    class="register-button"
    type="button"
    @click="showRegisterModal = true"
  >
    Daftar
  </button>

</template>

<!-- Customer yang sudah login -->
<template v-else>

  <div class="user-menu">

    <!-- Tombol nama customer -->
    <button
      class="user-info"
      type="button"
      @click.stop="toggleUserMenu"
      :aria-expanded="showUserMenu"
      aria-label="Buka menu profil"
    >
      <div class="user-avatar">
  <img
    v-if="user?.photo"
    :src="user.photo"
    :alt="user?.name"
  />

  <span v-else>
    {{ user?.name?.charAt(0).toUpperCase() }}
  </span>
</div>

      <div class="user-name">
        {{ user?.name }}
      </div>

      <span
        class="user-chevron"
        :class="{ open: showUserMenu }"
      >
        ↓
      </span>
    </button>

    <!-- Dropdown profil -->
    <Transition name="profile-dropdown">
      <div
        v-if="showUserMenu"
        class="profile-dropdown"
      >

       <RouterLink
  to="/profil"
  class="profile-menu-item"
  @click="closeUserMenu"
>
  <span class="profile-menu-icon">👤</span>
  <span>Profil Saya</span>
</RouterLink>

        <button
          class="profile-menu-item"
          type="button"
        >
          <span class="profile-menu-icon">📦</span>
          <span>Riwayat Pesanan</span>
        </button>

        <button
          class="profile-menu-item"
          type="button"
        >
          <span class="profile-menu-icon">♡</span>
          <span>Produk Favorit</span>
        </button>

      </div>
    </Transition>

  </div>

</template>

      </div>
    </div>
  </header>

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
   TABLET
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

/* =========================
   TABLET / SMALL LAPTOP
========================= */

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

/* =========================
   MOBILE
========================= */

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

/* =========================
   SMALL MOBILE
========================= */

@media (max-width: 380px) {
  .nav-menu {
    gap: 12px;
  }

  .nav-link {
    font-size: 10px;
  }
}
</style>