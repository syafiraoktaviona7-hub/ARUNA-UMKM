<script setup>
import { ref, onMounted, computed } from "vue";
import { penjual, katalog } from "@/services/api";
import { useKatalog } from "@/composables/useKatalog";
import PenjualIcon from "@/components/PenjualIcon.vue";

// useKatalog menyimpan daftar produk publik di cache (dimuat sekali).
// Setelah produk diubah di sini, cache itu harus diambil ulang supaya halaman Produk publik ikut update.
const { loadProduk: segarkanKatalog } = useKatalog();

const loading = ref(true);
const error = ref("");
const list = ref([]);
const kategori = ref([]);
const kategoriError = ref("");

const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const formError = ref("");

const form = ref({
  nama: "", harga: 0, stok: 0, category_id: "", jenis: "", deskripsi: "", gambar: "",
});

const kategoriOptions = computed(() => kategori.value);

// Terima bentuk respons: [..] atau { data: [..] } atau { kategori: [..] }
function normalisasiList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.kategori)) return res.kategori;
  if (Array.isArray(res?.data?.kategori)) return res.data.kategori;
  return [];
}

function labelKategori(k) {
  return k.nama ?? k.name ?? k.nama_kategori ?? k.label ?? `Kategori ${k.id}`;
}

// Kategori dimuat terpisah supaya gagalnya daftar produk tidak ikut mengosongkan pilihan
async function loadKategori() {
  kategoriError.value = "";
  try {
    const res = await katalog.kategori();
    kategori.value = normalisasiList(res);
    if (!kategori.value.length) {
      kategoriError.value = "Daftar kategori kosong dari server.";
      console.warn("katalog.kategori() mengembalikan:", res);
    }
  } catch (e) {
    kategoriError.value = e.message || "Gagal memuat kategori.";
  }
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    list.value = await penjual.produk();
  } catch (e) {
    error.value = e.message || "Gagal memuat produk.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadKategori();
  load();
});

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n || 0);
}

function bukaTambah() {
  editing.value = null;
  form.value = { nama: "", harga: 0, stok: 0, category_id: "", jenis: "", deskripsi: "", gambar: "" };
  formError.value = "";
  showForm.value = true;
}

function bukaEdit(p) {
  editing.value = p;
  form.value = {
    nama: p.nama,
    harga: p.harga,
    stok: p.stok,
    category_id: p.category_id,
    jenis: p.jenis || "",
    deskripsi: "",
    gambar: p.gambar || "",
  };
  formError.value = "";
  showForm.value = true;
}

function tutupForm() {
  showForm.value = false;
  editing.value = null;
  formError.value = "";
}

async function simpan() {
  formError.value = "";
  if (!form.value.nama.trim())  return (formError.value = "Nama wajib diisi.");
  if (form.value.harga <= 0)    return (formError.value = "Harga harus > 0.");
  if (!form.value.category_id)  return (formError.value = "Kategori wajib dipilih.");

  saving.value = true;
  try {
    if (editing.value) {
      await penjual.produkUpdate(editing.value.id, form.value);
    } else {
      await penjual.produkBuat(form.value);
    }
    tutupForm();
    segarkanKatalog(true);
    await load();
  } catch (e) {
    formError.value = e.message || "Gagal menyimpan.";
  } finally {
    saving.value = false;
  }
}

async function hapus(p) {
  if (!confirm(`Hapus produk "${p.nama}"?`)) return;
  try {
    await penjual.produkHapus(p.id);
    segarkanKatalog(true);
    await load();
  } catch (e) {
    alert(e.message || "Gagal menghapus.");
  }
}

async function toggleStatus(p) {
  const statusBaru = p.status === "tampil" ? "disembunyikan" : "tampil";
  try {
    await penjual.produkUpdate(p.id, { status: statusBaru });
    p.status = statusBaru;
    segarkanKatalog(true);
  } catch (e) {
    alert(e.message || "Gagal ubah status.");
  }
}
</script>

<template>
  <div class="produk-page">
    <header class="page-header">
      <div>
        <h1>Produk Saya</h1>
        <p class="page-sub">
          {{ list.length ? `${list.length} produk di toko kamu.` : "Kelola produk yang dijual di toko kamu." }}
        </p>
      </div>
      <button type="button" class="btn-primary" @click="bukaTambah">
        <PenjualIcon name="plus" :size="17" :stroke="2.4" />
        <span>Tambah Produk</span>
      </button>
    </header>

    <div v-if="loading" class="state-box">
      <span class="spinner"></span>
      <span>Memuat produk...</span>
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
              <th>Produk</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Terjual</th>
              <th>Status</th>
              <th class="th-aksi">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in list" :key="p.id">
              <td class="td-prod td-none" data-label="Produk">
                <div class="prod-cell">
                  <div class="thumb">
                    <PenjualIcon name="image" :size="18" />
                    <img
                      v-if="p.gambar"
                      :src="p.gambar"
                      :alt="p.nama"
                      loading="lazy"
                      @error="$event.target.style.display = 'none'"
                    />
                  </div>
                  <span class="prod-name">{{ p.nama }}</span>
                </div>
              </td>
              <td class="num" data-label="Harga">{{ formatRupiah(p.harga) }}</td>
              <td data-label="Stok">{{ p.stok }}</td>
              <td data-label="Terjual">{{ p.terjual }}</td>
              <td data-label="Status">
                <span class="badge" :class="p.status === 'tampil' ? 'badge-aktif' : 'badge-hide'">
                  <span class="dot"></span>
                  {{ p.status === "tampil" ? "Tampil" : "Disembunyikan" }}
                </span>
              </td>
              <td class="td-aksi td-none">
                <div class="actions">
                  <button type="button" class="icon-btn" title="Edit produk" aria-label="Edit produk" @click="bukaEdit(p)">
                    <PenjualIcon name="edit" :size="16" />
                  </button>
                  <button
                    type="button"
                    class="icon-btn"
                    :title="p.status === 'tampil' ? 'Sembunyikan produk' : 'Tampilkan produk'"
                    :aria-label="p.status === 'tampil' ? 'Sembunyikan produk' : 'Tampilkan produk'"
                    @click="toggleStatus(p)"
                  >
                    <PenjualIcon :name="p.status === 'tampil' ? 'eye-off' : 'eye'" :size="16" />
                  </button>
                  <button type="button" class="icon-btn danger" title="Hapus produk" aria-label="Hapus produk" @click="hapus(p)">
                    <PenjualIcon name="trash" :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-else class="card empty">
      <span class="empty-ic"><PenjualIcon name="produk" :size="28" /></span>
      <h3>Belum ada produk</h3>
      <p>Klik "Tambah Produk" untuk mulai berjualan.</p>
      <button type="button" class="btn-primary" @click="bukaTambah">
        <PenjualIcon name="plus" :size="17" :stroke="2.4" />
        <span>Tambah Produk</span>
      </button>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="tutupForm">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-head">
          <div class="modal-title">
            <span class="modal-ic"><PenjualIcon :name="editing ? 'edit' : 'plus'" :size="18" /></span>
            <h3>{{ editing ? "Edit Produk" : "Tambah Produk" }}</h3>
          </div>
          <button type="button" class="close" aria-label="Tutup" @click="tutupForm">
            <PenjualIcon name="x" :size="18" />
          </button>
        </header>

        <form @submit.prevent="simpan">
          <div class="form-group">
            <label>Nama Produk</label>
            <input v-model="form.nama" type="text" placeholder="Contoh: Keripik Tempe Original" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Harga (Rp)</label>
              <input v-model.number="form.harga" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Stok</label>
              <input v-model.number="form.stok" type="number" min="0" />
            </div>
          </div>

          <div class="form-group">
            <label>Kategori</label>
            <select v-model="form.category_id">
              <option value="" disabled>Pilih kategori</option>
              <option v-for="k in kategoriOptions" :key="k.id" :value="k.id">
                {{ labelKategori(k) }}
              </option>
            </select>
            <small v-if="kategoriError" class="field-err">
              <span>{{ kategoriError }}</span>
              <button type="button" class="link-btn" @click="loadKategori">Muat ulang</button>
            </small>
          </div>

          <div class="form-group">
            <label>Jenis <span class="opt">(opsional, hanya kategori Makanan)</span></label>
            <select v-model="form.jenis">
              <option value="">— Tidak ada —</option>
              <option value="Fast Food Lokal">Fast Food Lokal</option>
              <option value="Frozen Food">Frozen Food</option>
              <option value="Kuliner Lainnya">Kuliner Lainnya</option>
            </select>
          </div>

          <div class="form-group">
            <label>Deskripsi <span class="opt">(opsional)</span></label>
            <textarea v-model="form.deskripsi" rows="3" placeholder="Deskripsi singkat produk..."></textarea>
          </div>

          <div class="form-group">
            <label>Gambar <span class="opt">(URL, opsional)</span></label>
            <input v-model="form.gambar" type="text" placeholder="/images/produk.jpg" />
          </div>

          <p v-if="formError" class="form-err">
            <PenjualIcon name="alert" :size="15" />
            <span>{{ formError }}</span>
          </p>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="tutupForm">Batal</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <PenjualIcon v-if="!saving" name="save" :size="16" />
              <span>{{ saving ? "Menyimpan..." : "Simpan" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.produk-page { font-family: "Poppins", sans-serif; color: #102b50; max-width: 1200px; }

.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 14px; flex-wrap: wrap; margin-bottom: 22px;
}
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

/* card + table */
.card {
  background: #fff; border: 1px solid #e1ebf6; border-radius: 16px;
  box-shadow: 0 6px 22px rgba(8, 101, 216, 0.05);
  overflow: hidden;
}
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 14px; }
.tbl th, .tbl td { padding: 13px 16px; text-align: left; border-bottom: 1px solid #eef3fa; vertical-align: middle; }
.tbl th { background: #f8fbff; color: #7d91ad; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
.th-aksi { text-align: right !important; }
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: #fafcff; }
.num { font-weight: 600; white-space: nowrap; }

.prod-cell { display: flex; align-items: center; gap: 12px; min-width: 200px; }
.thumb {
  position: relative; width: 44px; height: 44px; flex-shrink: 0;
  border-radius: 12px; overflow: hidden;
  background: #f1f7ff; color: #8fb2e6;
  display: grid; place-items: center;
}
.thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.prod-name { font-weight: 600; }

/* badge */
.dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; display: inline-block; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap;
}
.badge-aktif { background: #e8f8ee; color: #188a43; }
.badge-hide  { background: #f1f5fa; color: #6d84aa; }

/* aksi */
.actions { display: flex; justify-content: flex-end; gap: 6px; }
.icon-btn {
  width: 34px; height: 34px; display: grid; place-items: center;
  border: 1px solid #dce6f1; background: #fff; color: #0865d8;
  border-radius: 10px; cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.icon-btn:hover { background: #eaf4ff; border-color: #bcd9fb; }
.icon-btn:focus-visible { outline: 2px solid #0865d8; outline-offset: 2px; }
.icon-btn.danger { border-color: #fde0e0; background: #fff4f4; color: #dc2626; }
.icon-btn.danger:hover { background: #ffe3e3; }

/* buttons */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 18px; border: none; border-radius: 12px;
  background: #0865d8; color: #fff;
  font-family: inherit; font-weight: 650; font-size: 14px; cursor: pointer;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.22);
  transition: background 0.2s ease, transform 0.1s ease;
}
.btn-primary:hover:not(:disabled) { background: #0754b5; }
.btn-primary:active:not(:disabled) { transform: translateY(1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
.btn-primary:focus-visible { outline: 2px solid #0865d8; outline-offset: 2px; }

.btn-secondary {
  padding: 10px 18px; border: 1px solid #dce6f1; border-radius: 12px;
  background: #fff; color: #4d6a98;
  font-family: inherit; font-weight: 650; font-size: 14px; cursor: pointer;
}
.btn-secondary:hover { background: #f7fbff; }

/* empty */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 48px 20px; }
.empty-ic {
  width: 64px; height: 64px; border-radius: 18px;
  display: grid; place-items: center;
  background: #f1f7ff; color: #6d9be0; margin-bottom: 14px;
}
.empty h3 { margin: 0 0 4px; font-size: 16px; }
.empty p { margin: 0 0 18px; color: #8298b2; font-size: 13.5px; }

/* modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 999;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  background: rgba(16, 43, 80, 0.4);
  backdrop-filter: blur(4px);
}
.modal {
  width: min(560px, 100%); max-height: 90vh; overflow-y: auto;
  background: #fff; border-radius: 20px; padding: 24px 26px;
  box-shadow: 0 25px 70px rgba(8, 101, 216, 0.2);
}
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.modal-title { display: flex; align-items: center; gap: 12px; }
.modal-title h3 { margin: 0; font-size: 18px; font-weight: 700; }
.modal-ic {
  width: 38px; height: 38px; border-radius: 12px;
  display: grid; place-items: center;
  background: #e8f2ff; color: #0865d8;
}
.close {
  width: 34px; height: 34px; display: grid; place-items: center;
  border: none; border-radius: 50%;
  background: #f3f7fc; color: #7d91ad; cursor: pointer;
}
.close:hover { background: #e8f2ff; color: #0865d8; }

.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group label { font-size: 13px; font-weight: 600; color: #102b56; }
.opt { font-weight: 400; color: #8298b2; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 11px 13px; border: 1px solid #dce6f1; border-radius: 12px;
  font-family: inherit; font-size: 14px; color: #102b50;
  outline: none; background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}
.field-err { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12.5px; color: #dc2626; }
.link-btn {
  padding: 0; border: none; background: none;
  color: #0865d8; font-family: inherit; font-size: 12.5px; font-weight: 600;
  cursor: pointer; text-decoration: underline;
}
.form-err {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #fff4f4; border: 1px solid #fde0e0;
  color: #dc2626; border-radius: 10px; font-size: 13px; margin: 0 0 12px;
}
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }

@media (max-width: 600px) {
  h1 { font-size: 22px; }
  .page-header { align-items: stretch; flex-direction: column; }
  .page-header .btn-primary { width: 100%; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .form-group input, .form-group select, .form-group textarea { font-size: 16px; }

  /* modal jadi bottom sheet */
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal {
    width: 100%; max-height: 92vh;
    border-radius: 20px 20px 0 0;
    padding: 20px 18px calc(20px + env(safe-area-inset-bottom, 0px));
  }
  .form-actions .btn-primary, .form-actions .btn-secondary { flex: 1; }
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
  .td-prod { padding-bottom: 10px; }
  .prod-cell { min-width: 0; }
  .td-aksi { padding-top: 8px; border-top: 1px dashed #e5eefa; margin-top: 6px; }
  .actions { width: 100%; justify-content: flex-end; }
  .icon-btn { width: 40px; height: 40px; }
}
</style>