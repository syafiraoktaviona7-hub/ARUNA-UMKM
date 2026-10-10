<script setup>
import { computed } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import PenjualIcon from "@/components/PenjualIcon.vue";

// Ganti path ini sesuai lokasi logo ARUNA kamu (mis. file di public/images/)
const logoSrc = "/images/aruna-logo.png";

const route  = useRoute();
const router = useRouter();
const { user, logout } = useAuth();

function keluar() {
  logout();
  router.push("/login");
}

const menu = [
  { to: "/penjual",         label: "Dashboard",   icon: "dashboard" },
  { to: "/penjual/produk",  label: "Produk",      icon: "produk" },
  { to: "/penjual/pesanan", label: "Pesanan",     icon: "pesanan" },
  { to: "/penjual/profil",  label: "Profil Toko", icon: "toko" },
];

function aktif(to) {
  return to === "/penjual" ? route.path === to : route.path.startsWith(to);
}

const namaToko = computed(() => user.value?.namaToko || user.value?.name || "Penjual");
const inisial  = computed(() => (namaToko.value || "P").trim().charAt(0).toUpperCase());
const judulHalaman = computed(() => menu.find((m) => aktif(m.to))?.label || "Panel Penjual");
</script>

<template>
  <div class="pl-wrap">
    <aside class="pl-side">
      <RouterLink to="/penjual" class="pl-brand" aria-label="ARUNA - Dashboard penjual">
        <img :src="logoSrc" alt="ARUNA" class="pl-logo-img" />
      </RouterLink>

      <nav class="pl-nav" aria-label="Menu penjual">
        <RouterLink
          v-for="m in menu"
          :key="m.to"
          :to="m.to"
          class="pl-link"
          :class="{ active: aktif(m.to) }"
        >
          <span class="pl-ic"><PenjualIcon :name="m.icon" :size="18" /></span>
          <span class="pl-label">{{ m.label }}</span>
        </RouterLink>
      </nav>

      <div class="pl-user">
        <div class="pl-user-row">
          <span class="pl-avatar">{{ inisial }}</span>
          <div class="pl-user-info">
            <span class="pl-user-name">{{ namaToko }}</span>
            <span class="pl-user-role">Penjual</span>
          </div>
        </div>
        <button type="button" class="pl-logout" @click="keluar">
          <PenjualIcon name="logout" :size="16" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <main class="pl-main">
      <header class="pl-topbar">
        <div class="pl-crumb">
          <span class="pl-crumb-muted">Panel Penjual</span>
          <span class="pl-crumb-sep">/</span>
          <span class="pl-crumb-now">{{ judulHalaman }}</span>
        </div>
      </header>

      <div class="pl-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.pl-wrap {
  display: grid;
  grid-template-columns: 252px 1fr;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #f5faff;
  color: #102b50;
}

/* ===== Sidebar ===== */
.pl-side {
  background: #fff;
  border-right: 1px solid #e5eefa;
  padding: 22px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.pl-brand {
  display: flex;
  align-items: center;
  padding: 0 6px;
  text-decoration: none;
}
.pl-logo-img {
  height: 42px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.pl-nav { display: flex; flex-direction: column; gap: 4px; }
.pl-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  color: #4d6a98;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.pl-ic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #f1f7ff;
  color: #5b86c4;
  transition: background 0.15s ease, color 0.15s ease;
}
.pl-link:hover { background: #f1f7ff; color: #0865d8; }
.pl-link:hover .pl-ic { background: #e2efff; color: #0865d8; }
.pl-link:focus-visible { outline: 2px solid #0865d8; outline-offset: 2px; }
.pl-link.active {
  background: #0865d8;
  color: #fff;
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.25);
}
.pl-link.active .pl-ic { background: rgba(255, 255, 255, 0.18); color: #fff; }

.pl-user {
  margin-top: auto;
  padding: 14px;
  border-radius: 14px;
  background: #f5faff;
  border: 1px solid #e5eefa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pl-user-row { display: flex; align-items: center; gap: 10px; min-width: 0; }
.pl-avatar {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #dcebff;
  color: #0865d8;
  font-weight: 700;
  display: grid;
  place-items: center;
}
.pl-user-info { display: flex; flex-direction: column; min-width: 0; }
.pl-user-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #102b50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pl-user-role { font-size: 11.5px; color: #8298b2; }
.pl-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid #fde0e0;
  background: #fff;
  color: #dc2626;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.pl-logout:hover { background: #fff1f1; }
.pl-logout:focus-visible { outline: 2px solid #dc2626; outline-offset: 2px; }

/* ===== Main ===== */
.pl-main { display: flex; flex-direction: column; min-width: 0; }
.pl-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 28px;
  border-bottom: 1px solid #e5eefa;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 20;
}
.pl-crumb { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.pl-crumb-muted { color: #8298b2; }
.pl-crumb-sep { color: #c3d3e8; }
.pl-crumb-now { color: #102b50; font-weight: 700; }
.pl-content { padding: 28px; min-width: 0; }

/* ===== Mobile: header atas + tab bar bawah ===== */
@media (max-width: 800px) {
  .pl-wrap { grid-template-columns: 1fr; }

  .pl-side {
    position: sticky;
    top: 0;
    z-index: 40;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border-right: none;
    border-bottom: 1px solid #e5eefa;
  }
  .pl-logo-img { height: 34px; }

  /* menu pindah ke bawah seperti aplikasi */
  .pl-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 8px 10px calc(8px + env(safe-area-inset-bottom, 0px));
    background: #fff;
    border-top: 1px solid #e5eefa;
    box-shadow: 0 -8px 24px rgba(8, 101, 216, 0.08);
  }
  .pl-link {
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 6px 2px;
    border-radius: 12px;
    font-size: 11px;
    text-align: center;
  }
  .pl-ic { width: 34px; height: 28px; border-radius: 10px; }
  .pl-link:hover { background: transparent; }
  .pl-link.active { background: transparent; color: #0865d8; box-shadow: none; }
  .pl-link.active .pl-ic { background: #0865d8; color: #fff; }

  .pl-user {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    flex-direction: row;
    align-items: center;
  }
  .pl-user-info { display: none; }
  .pl-avatar { width: 34px; height: 34px; font-size: 14px; }
  .pl-logout { padding: 9px; }
  .pl-logout span { display: none; }

  /* topbar cuma isi breadcrumb, di HP disembunyikan */
  .pl-topbar { display: none; }

  .pl-content { padding: 16px 16px calc(92px + env(safe-area-inset-bottom, 0px)); }
}

</style>