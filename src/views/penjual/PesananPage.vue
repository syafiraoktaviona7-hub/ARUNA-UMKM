<script setup>
import { ref, onMounted, watch } from "vue";
import { penjual } from "@/services/api";
import PenjualIcon from "@/components/PenjualIcon.vue";

const loading = ref(true);
const error = ref("");
const list = ref([]);
const filterStatus = ref("");

const statusLabel = {
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

async function load() {
  loading.value = true;
  error.value = "";
  try {
    list.value = await penjual.pesanan(filterStatus.value ? { status: filterStatus.value } : undefined);
  } catch (e) {
    error.value = e.message || "Gagal memuat pesanan.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(filterStatus, load);

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n || 0);
}
function formatTanggal(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

async function ubahStatus(p, status) {
  try {
    await penjual.pesananUbahStatus(p.id, status);
    p.status = status;
  } catch (e) {
    alert(e.message || "Gagal ubah status.");
  }
}
</script>

<template>
  <div class="pesanan-page">
    <header class="page-header">
      <div>
        <h1>Pesanan</h1>
        <p class="page-sub">Pantau pesanan masuk dan perbarui statusnya.</p>
      </div>

      <label class="filter-wrap">
        <PenjualIcon name="filter" :size="15" />
        <select v-model="filterStatus" class="filter" aria-label="Filter status pesanan">
          <option value="">Semua Status</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      </label>
    </header>

    <div v-if="loading" class="state-box">
      <span class="spinner"></span>
      <span>Memuat pesanan...</span>
    </div>

    <div v-else-if="error" class="state-box state-err">
      <PenjualIcon name="alert" :size="18" />
      <span>{{ error }}</span>
      <button type="button" class="btn-retry" @click="load">Coba lagi</button>
    </div>

    <section v-else-if="list.length" class="card">
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Alamat Kirim</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in list" :key="p.id">
              <td data-label="Kode"><strong class="kode">{{ p.kode }}</strong></td>
              <td data-label="Customer">
                <div class="cell-stack">
                  <div class="cell-main">{{ p.nama_customer || "-" }}</div>
                  <small v-if="p.no_hp_penerima || p.email_customer" class="muted with-ic">
                    <PenjualIcon name="phone" :size="12" />
                    {{ p.no_hp_penerima || p.email_customer }}
                  </small>
                </div>
              </td>
              <td class="num" data-label="Total">{{ formatRupiah(p.total) }}</td>
              <td class="alamat" data-label="Alamat Kirim">
                <div class="cell-stack">
                  <div class="cell-main">{{ p.nama_penerima || "-" }}</div>
                  <small class="muted with-ic">
                    <PenjualIcon name="pin" :size="12" />
                    <span>{{ p.alamat_kirim || "-" }}</span>
                  </small>
                </div>
              </td>
              <td data-label="Status">
                <span class="badge" :class="`badge-${p.status}`">
                  <span class="dot"></span>
                  {{ statusLabel[p.status] || p.status }}
                </span>
              </td>
              <td class="muted tgl" data-label="Tanggal">{{ formatTanggal(p.created_at) }}</td>
              <td data-label="Ubah Status">
                <select
                  class="status-select"
                  :value="p.status"
                  aria-label="Ubah status pesanan"
                  @change="ubahStatus(p, $event.target.value)"
                >
                  <option value="diproses">Diproses</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-else class="card empty">
      <span class="empty-ic"><PenjualIcon name="inbox" :size="28" /></span>
      <h3>Belum ada pesanan</h3>
      <p>
        {{ filterStatus ? "Tidak ada pesanan dengan status ini." : "Pesanan dari customer akan muncul di sini." }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.pesanan-page { font-family: "Poppins", sans-serif; color: #102b50; max-width: 1300px; }

.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 14px; flex-wrap: wrap; margin-bottom: 22px;
}
h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; }
.page-sub { margin: 0; color: #7d91ad; font-size: 14px; }

.filter-wrap {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 0 12px; border: 1px solid #dce6f1; border-radius: 12px;
  background: #fff; color: #5b86c4;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.filter-wrap:focus-within { border-color: #0865d8; box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08); }
.filter {
  padding: 10px 4px; border: none; outline: none; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600; color: #102b50; cursor: pointer;
}

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

/* card + table */
.card {
  background: #fff; border: 1px solid #e1ebf6; border-radius: 16px;
  box-shadow: 0 6px 22px rgba(8, 101, 216, 0.05);
  overflow: hidden;
}
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.tbl th, .tbl td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #eef3fa; vertical-align: top; }
.tbl th { background: #f8fbff; color: #7d91ad; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: #fafcff; }
.kode { color: #0865d8; font-weight: 600; white-space: nowrap; }
.num { font-weight: 600; white-space: nowrap; }
.tgl { white-space: nowrap; }
.alamat { max-width: 280px; }
.cell-main { font-weight: 600; margin-bottom: 2px; }
.cell-stack { min-width: 0; }
.muted { color: #8298b2; font-size: 12px; }
.with-ic { display: inline-flex; align-items: flex-start; gap: 5px; line-height: 1.5; }
.with-ic svg { margin-top: 3px; }

/* badge */
.dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; display: inline-block; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap;
}
.badge-diproses   { background: #fff7df; color: #b7791f; }
.badge-dikirim    { background: #e0f2fe; color: #0369a1; }
.badge-selesai    { background: #e8f8ee; color: #188a43; }
.badge-dibatalkan { background: #fde0e0; color: #b91c1c; }

.status-select {
  padding: 8px 10px; border: 1px solid #dce6f1; border-radius: 10px;
  font-family: inherit; font-size: 12.5px; font-weight: 600; color: #102b50;
  background: #fff; cursor: pointer; outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.status-select:hover { border-color: #bcd9fb; }
.status-select:focus { border-color: #0865d8; box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08); }

/* empty */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 48px 20px; }
.empty-ic {
  width: 64px; height: 64px; border-radius: 18px;
  display: grid; place-items: center;
  background: #f1f7ff; color: #6d9be0; margin-bottom: 14px;
}
.empty h3 { margin: 0 0 4px; font-size: 16px; }
.empty p { margin: 0; color: #8298b2; font-size: 13.5px; }

@media (max-width: 600px) {
  h1 { font-size: 22px; }
  .page-header { align-items: stretch; flex-direction: column; }
  .filter-wrap { width: 100%; }
  .filter { flex: 1; font-size: 16px; }
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
  .alamat { max-width: none; }
  .cell-stack { text-align: right; min-width: 0; }
  .with-ic { justify-content: flex-end; text-align: right; }
  .status-select { font-size: 14px; }
}
</style>