<script setup>
import { ref, onMounted } from "vue";
import { penjual, katalog } from "@/services/api";
import PenjualIcon from "@/components/PenjualIcon.vue";

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const success = ref("");
const kategori = ref([]);
const kategoriError = ref("");

const form = ref({
  nama: "", deskripsi: "", whatsapp: "",
  nama_rekening: "", bank: "", no_rekening: "",
  provinsi: "", kota: "", kecamatan: "", alamat: "",
  gambar: "", category_id: "",
});

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

// Kategori dimuat terpisah supaya gagalnya profil tidak ikut mengosongkan pilihan
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
    const u = await penjual.profil();
    form.value = {
      nama:          u.nama          || "",
      deskripsi:     u.deskripsi     || "",
      whatsapp:      u.whatsapp      || "",
      nama_rekening: u.nama_rekening || "",
      bank:          u.bank          || "",
      no_rekening:   u.no_rekening   || "",
      provinsi:      u.provinsi      || "",
      kota:          u.kota          || "",
      kecamatan:     u.kecamatan     || "",
      alamat:        u.alamat        || "",
      gambar:        u.gambar        || "",
      category_id:   u.category_id   || "",
    };
  } catch (e) {
    error.value = e.message || "Gagal memuat profil.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadKategori();
  load();
});

async function simpan() {
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    await penjual.profilUpdate(form.value);
    success.value = "Profil berhasil diperbarui.";
  } catch (e) {
    error.value = e.message || "Gagal menyimpan.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="profil-page">
    <header class="page-head">
      <h1>Profil Toko</h1>
      <p class="page-sub">Atur info toko, rekening pembayaran, dan alamat yang dilihat customer.</p>
    </header>

    <div v-if="loading" class="state-box">
      <span class="spinner"></span>
      <span>Memuat profil...</span>
    </div>

    <form v-else @submit.prevent="simpan">
      <section class="panel">
        <header class="panel-head">
          <span class="panel-ic"><PenjualIcon name="toko" :size="18" /></span>
          <div>
            <h3>Info Toko</h3>
            <p>Nama, kategori, dan kontak toko kamu.</p>
          </div>
        </header>

        <div class="form-group">
          <label>Nama Toko / UMKM</label>
          <input v-model="form.nama" type="text" />
        </div>

        <div class="form-group">
          <label>Kategori</label>
          <select v-model="form.category_id">
            <option value="">— Pilih kategori —</option>
            <option v-for="k in kategori" :key="k.id" :value="k.id">{{ labelKategori(k) }}</option>
          </select>
          <small v-if="kategoriError" class="field-err">
            <span>{{ kategoriError }}</span>
            <button type="button" class="link-btn" @click="loadKategori">Muat ulang</button>
          </small>
        </div>

        <div class="form-group">
          <label>Deskripsi Toko</label>
          <textarea v-model="form.deskripsi" rows="3" placeholder="Ceritakan tentang toko Anda..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>WhatsApp <span class="opt">(format 62xxx)</span></label>
            <div class="input-ic">
              <PenjualIcon name="phone" :size="16" />
              <input v-model="form.whatsapp" type="tel" placeholder="6281234567890" />
            </div>
          </div>
          <div class="form-group">
            <label>Gambar Toko <span class="opt">(URL)</span></label>
            <div class="input-ic">
              <PenjualIcon name="image" :size="16" />
              <input v-model="form.gambar" type="text" placeholder="/images/toko.jpg" />
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <header class="panel-head">
          <span class="panel-ic ic-green"><PenjualIcon name="card" :size="18" /></span>
          <div>
            <h3>Rekening Pembayaran</h3>
            <p>Pembayaran customer akan masuk ke rekening ini.</p>
          </div>
        </header>

        <div class="form-row">
          <div class="form-group">
            <label>Nama Pemilik Rekening</label>
            <input v-model="form.nama_rekening" type="text" />
          </div>
          <div class="form-group">
            <label>Bank</label>
            <input v-model="form.bank" type="text" placeholder="BCA / BRI / Mandiri..." />
          </div>
        </div>
        <div class="form-group">
          <label>No. Rekening</label>
          <input v-model="form.no_rekening" type="text" />
        </div>
      </section>

      <section class="panel">
        <header class="panel-head">
          <span class="panel-ic ic-amber"><PenjualIcon name="pin" :size="18" /></span>
          <div>
            <h3>Alamat</h3>
            <p>Lokasi toko atau tempat produksi.</p>
          </div>
        </header>

        <div class="form-row">
          <div class="form-group">
            <label>Provinsi</label>
            <input v-model="form.provinsi" type="text" />
          </div>
          <div class="form-group">
            <label>Kota / Kabupaten</label>
            <input v-model="form.kota" type="text" />
          </div>
        </div>
        <div class="form-group">
          <label>Kecamatan</label>
          <input v-model="form.kecamatan" type="text" />
        </div>
        <div class="form-group">
          <label>Alamat Lengkap</label>
          <input v-model="form.alamat" type="text" />
        </div>
      </section>

      <p v-if="error" class="form-err">
        <PenjualIcon name="alert" :size="16" />
        <span>{{ error }}</span>
      </p>
      <p v-if="success" class="form-ok">
        <PenjualIcon name="check-circle" :size="16" />
        <span>{{ success }}</span>
      </p>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="saving">
          <PenjualIcon v-if="!saving" name="save" :size="17" />
          <span>{{ saving ? "Menyimpan..." : "Simpan Perubahan" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profil-page { font-family: "Poppins", sans-serif; color: #102b50; max-width: 900px; }

.page-head { margin-bottom: 22px; }
h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; }
.page-sub { margin: 0; color: #7d91ad; font-size: 14px; }

.state-box {
  display: flex; align-items: center; gap: 12px;
  padding: 18px 20px; border-radius: 14px;
  background: #fff; border: 1px solid #dce6f1;
  color: #55729f; font-size: 14px;
}
.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid #dcebff; border-top-color: #0865d8;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* panel */
.panel {
  background: #fff; border: 1px solid #e1ebf6; border-radius: 16px;
  padding: 20px 22px 10px; margin-bottom: 18px;
  box-shadow: 0 6px 22px rgba(8, 101, 216, 0.05);
}
.panel-head {
  display: flex; align-items: center; gap: 14px;
  padding-bottom: 16px; margin-bottom: 18px;
  border-bottom: 1px solid #eef3fa;
}
.panel-head h3 { margin: 0; font-size: 16px; font-weight: 700; }
.panel-head p { margin: 2px 0 0; font-size: 12.5px; color: #8298b2; }
.panel-ic {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  display: grid; place-items: center;
  background: #e8f2ff; color: #0865d8;
}
.panel-ic.ic-green { background: #e5f8ec; color: #188a43; }
.panel-ic.ic-amber { background: #fff4d9; color: #b7791f; }

/* form */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; min-width: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group label { font-size: 13px; font-weight: 600; color: #102b56; }
.opt { font-weight: 400; color: #8298b2; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 11px 13px; border: 1px solid #dce6f1; border-radius: 12px;
  font-family: inherit; font-size: 14px; color: #102b50;
  outline: none; background: #fff; width: 100%; box-sizing: border-box;
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

.input-ic { position: relative; display: flex; align-items: center; }
.input-ic svg { position: absolute; left: 13px; color: #8fb2e6; pointer-events: none; }
.input-ic input { padding-left: 38px; }

/* feedback */
.form-err,
.form-ok {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; border-radius: 10px; font-size: 13px; margin: 0 0 14px;
}
.form-err { background: #fff4f4; border: 1px solid #fde0e0; color: #dc2626; }
.form-ok  { background: #e8f8ee; border: 1px solid #c8ecd5; color: #188a43; }

.form-actions { display: flex; justify-content: flex-end; padding-bottom: 8px; }
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 22px; border: none; border-radius: 12px;
  background: #0865d8; color: #fff;
  font-family: inherit; font-weight: 650; font-size: 14px; cursor: pointer;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.22);
  transition: background 0.2s ease, transform 0.1s ease;
}
.btn-primary:hover:not(:disabled) { background: #0754b5; }
.btn-primary:active:not(:disabled) { transform: translateY(1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
.btn-primary:focus-visible { outline: 2px solid #0865d8; outline-offset: 2px; }

@media (max-width: 600px) {
  h1 { font-size: 22px; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .form-group input, .form-group select, .form-group textarea { font-size: 16px; }
  .panel { padding: 16px 16px 6px; }
  .form-actions .btn-primary { width: 100%; }
}
</style>