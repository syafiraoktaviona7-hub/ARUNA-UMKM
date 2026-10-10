<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { penjual } from "@/services/api";
import PenjualIcon from "@/components/PenjualIcon.vue";

const loading = ref(true);
const error = ref("");
const data = ref(null);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    data.value = await penjual.dashboard();
  } catch (e) {
    error.value = e.message || "Gagal memuat dashboard.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n || 0);
}

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const statusLabel = {
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};
</script>

<template>
  <div class="dashboard-page">
    <header class="page-head">
      <div>
        <h1>Dashboard Penjual</h1>
        <p class="page-sub">Ringkasan toko, pesanan, dan stok kamu hari ini.</p>
      </div>
    </header>

    <div v-if="loading" class="state-box">
      <span class="spinner"></span>
      <span>Memuat dashboard...</span>
    </div>

    <div v-else-if="error" class="state-box state-err">
      <PenjualIcon name="alert" :size="18" />
      <span>{{ error }}</span>
      <button type="button" class="btn-retry" @click="load">Coba lagi</button>
    </div>

    <template v-else-if="data">
      <!-- Info toko -->
      <div class="toko-card">
        <div class="toko-ic"><PenjualIcon name="toko" :size="26" /></div>
        <div class="toko-info">
          <h2>{{ data.umkm.nama }}</h2>
          <p>
            <PenjualIcon name="pin" :size="14" />
            <span>{{ data.umkm.kota || "-" }}</span>
          </p>
        </div>
        <span class="toko-status">
          <span class="dot"></span>
          {{ data.umkm.status }}
        </span>
      </div>

      <!-- Statistik -->
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-ic ic-blue"><PenjualIcon name="produk" :size="22" /></span>
          <div class="stat-body">
            <span class="stat-label">Total Produk</span>
            <span class="stat-value">{{ data.statistik.totalProduk }}</span>
            <span class="stat-sub">{{ data.statistik.produkAktif }} aktif</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-ic ic-amber"><PenjualIcon name="pesanan" :size="22" /></span>
          <div class="stat-body">
            <span class="stat-label">Pesanan Baru</span>
            <span class="stat-value">{{ data.statistik.pesananBaru }}</span>
            <span class="stat-sub">dari {{ data.statistik.pesananTotal }} pesanan</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-ic ic-green"><PenjualIcon name="wallet" :size="22" /></span>
          <div class="stat-body">
            <span class="stat-label">Total Penjualan</span>
            <span class="stat-value">{{ formatRupiah(data.statistik.totalPenjualan) }}</span>
            <span class="stat-sub">dari pesanan selesai</span>
          </div>
        </div>
      </div>

      <!-- Pesanan terbaru -->
      <section class="panel">
        <header class="panel-head">
          <div class="panel-title">
            <span class="panel-ic"><PenjualIcon name="pesanan" :size="16" /></span>
            <h3>Pesanan Terbaru</h3>
          </div>
          <RouterLink to="/penjual/pesanan" class="link">
            <span>Lihat semua</span>
            <PenjualIcon name="arrow-right" :size="14" />
          </RouterLink>
        </header>

        <div v-if="data.pesananTerbaru.length" class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in data.pesananTerbaru" :key="p.id">
                <td data-label="Kode"><strong class="kode">{{ p.kode }}</strong></td>
                <td data-label="Customer">{{ p.nama_customer || "-" }}</td>
                <td class="num" data-label="Total">{{ formatRupiah(p.total) }}</td>
                <td data-label="Status">
                  <span class="badge" :class="`badge-${p.status}`">
                    <span class="dot"></span>
                    {{ statusLabel[p.status] || p.status }}
                  </span>
                </td>
                <td class="muted" data-label="Tanggal">{{ formatTanggal(p.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty">
          <span class="empty-ic"><PenjualIcon name="inbox" :size="26" /></span>
          <p>Belum ada pesanan.</p>
        </div>
      </section>

      <!-- Stok menipis -->
      <section class="panel">
        <header class="panel-head">
          <div class="panel-title">
            <span class="panel-ic ic-warn"><PenjualIcon name="alert" :size="16" /></span>
            <h3>Stok Menipis</h3>
          </div>
          <RouterLink to="/penjual/produk" class="link">
            <span>Kelola produk</span>
            <PenjualIcon name="arrow-right" :size="14" />
          </RouterLink>
        </header>

        <div v-if="data.stokMenipis.length" class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Stok</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in data.stokMenipis" :key="s.id">
                <td data-label="Produk">{{ s.nama }}</td>
                <td data-label="Stok"><span class="stok-chip">{{ s.stok }}</span></td>
                <td class="num" data-label="Harga">{{ formatRupiah(s.harga) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty">
          <span class="empty-ic ok"><PenjualIcon name="check-circle" :size="26" /></span>
          <p>Semua stok aman.</p>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard-page { font-family: "Poppins", sans-serif; color: #102b50; max-width: 1200px; margin: 0 auto; }

.page-head { margin-bottom: 22px; }
h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; }
.page-sub { margin: 0; color: #7d91ad; font-size: 14px; }

/* state */
.state-box {
  display: flex; align-items: center; gap: 12px;
  padding: 18px 20px; border-radius: 14px;
  background: #fff; border: 1px solid #dce6f1;
  color: #55729f; font-size: 14px;
}
.state-err { background: #fff4f4; border-color: #fde0e0; color: #dc2626; }
.btn-retry {
  margin-left: auto; padding: 7px 14px; border-radius: 9px;
  border: 1px solid #f6c4c4; background: #fff; color: #dc2626;
  font-family: inherit; font-weight: 600; font-size: 12.5px; cursor: pointer;
}
.btn-retry:hover { background: #ffecec; }
.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid #dcebff; border-top-color: #0865d8;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* toko banner */
.toko-card {
  display: flex; align-items: center; gap: 16px;
  background: linear-gradient(120deg, #0865d8 0%, #2f8bff 100%);
  color: #fff; border-radius: 18px; padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 14px 30px rgba(8, 101, 216, 0.22);
}
.toko-ic {
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  background: rgba(255, 255, 255, 0.18);
  display: grid; place-items: center;
}
.toko-info { min-width: 0; flex: 1; }
.toko-info h2 { margin: 0 0 4px; font-size: 20px; font-weight: 700; }
.toko-info p { margin: 0; display: flex; align-items: center; gap: 6px; font-size: 13.5px; opacity: 0.9; }
.toko-status {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 12.5px; font-weight: 600; text-transform: capitalize;
}
.toko-status .dot { background: #7dffb0; }

/* stat */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px; margin-bottom: 24px;
}
.stat-card {
  display: flex; align-items: center; gap: 16px;
  background: #fff; border: 1px solid #e1ebf6; border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 6px 22px rgba(8, 101, 216, 0.05);
}
.stat-ic { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; }
.ic-blue  { background: #e8f2ff; color: #0865d8; }
.ic-amber { background: #fff4d9; color: #b7791f; }
.ic-green { background: #e5f8ec; color: #188a43; }
.stat-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.stat-label { color: #7d91ad; font-size: 13px; }
.stat-value { font-size: 22px; font-weight: 700; color: #102b50; line-height: 1.25; overflow-wrap: anywhere; }
.stat-sub { color: #8298b2; font-size: 12px; }

/* panel */
.panel {
  background: #fff; border: 1px solid #e1ebf6; border-radius: 16px;
  padding: 18px 20px; margin-bottom: 20px;
  box-shadow: 0 6px 22px rgba(8, 101, 216, 0.04);
}
.panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 10px; }
.panel-title { display: flex; align-items: center; gap: 10px; }
.panel-title h3 { margin: 0; font-size: 16px; font-weight: 700; }
.panel-ic {
  width: 32px; height: 32px; border-radius: 10px;
  display: grid; place-items: center;
  background: #e8f2ff; color: #0865d8;
}
.panel-ic.ic-warn { background: #fff0f0; color: #dc2626; }

.link {
  display: inline-flex; align-items: center; gap: 6px;
  color: #0865d8; font-size: 13px; font-weight: 600; text-decoration: none;
  padding: 6px 10px; border-radius: 8px;
}
.link:hover { background: #eaf4ff; }

/* table */
.tbl-wrap { overflow-x: auto; margin: 0 -4px; padding: 0 4px; }
.tbl { width: 100%; border-collapse: collapse; font-size: 14px; }
.tbl th, .tbl td { padding: 12px 12px; text-align: left; border-bottom: 1px solid #eef3fa; white-space: nowrap; }
.tbl th { color: #7d91ad; font-weight: 600; font-size: 12.5px; background: #f8fbff; }
.tbl th:first-child { border-radius: 10px 0 0 10px; }
.tbl th:last-child { border-radius: 0 10px 10px 0; }
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: #fafcff; }
.kode { color: #0865d8; font-weight: 600; }
.num { font-weight: 600; }
.muted { color: #8298b2; }

.stok-chip {
  display: inline-block; min-width: 34px; text-align: center;
  padding: 3px 10px; border-radius: 999px;
  background: #fde8e8; color: #b91c1c; font-weight: 700; font-size: 12.5px;
}

/* badge */
.dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; display: inline-block; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600;
}
.badge-diproses   { background: #fff7df; color: #b7791f; }
.badge-dikirim    { background: #e0f2fe; color: #0369a1; }
.badge-selesai    { background: #e8f8ee; color: #188a43; }
.badge-dibatalkan { background: #fde0e0; color: #b91c1c; }

/* empty */
.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 26px 0 18px; color: #8298b2; }
.empty p { margin: 0; font-size: 13.5px; }
.empty-ic {
  width: 56px; height: 56px; border-radius: 16px;
  display: grid; place-items: center;
  background: #f1f7ff; color: #6d9be0;
}
.empty-ic.ok { background: #e8f8ee; color: #188a43; }

@media (max-width: 600px) {
  h1 { font-size: 22px; }
  .toko-card { flex-wrap: wrap; padding: 16px; gap: 12px; }
  .toko-ic { width: 44px; height: 44px; }
  .toko-info h2 { font-size: 17px; }
  .toko-status { order: 3; }
  .stat-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 18px; }
  .stat-card { padding: 14px 16px; }
  .stat-ic { width: 46px; height: 46px; }
  .panel { padding: 16px 0 6px; }
  .panel-head { padding: 0 16px; }
}

/* ===== Mobile: tabel jadi kartu ===== */
@media (max-width: 700px) {
  .tbl-wrap { overflow: visible; margin: 0; padding: 0; }
  .tbl, .tbl tbody, .tbl tr, .tbl td { display: block; width: 100%; }
  .tbl thead { display: none; }
  .tbl tr { padding: 14px 16px; border-bottom: 1px solid #eef3fa; }
  .tbl tbody tr:last-child { border-bottom: none; }
  .tbl td {
    display: flex; justify-content: space-between; align-items: center;
    gap: 14px; padding: 6px 0; border: none; text-align: right;
    white-space: normal;
  }
  .tbl td::before {
    content: attr(data-label);
    flex-shrink: 0; text-align: left;
    color: #7d91ad; font-size: 12px; font-weight: 600;
  }
  .tbl td.td-none::before { display: none; }
  .tbl tbody tr:hover td { background: transparent; }
}
</style>