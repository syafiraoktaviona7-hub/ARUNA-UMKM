<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const {
  user,
  logout,
  updateUser,
} = useAuth();

const showEditModal = ref(false);
const showAddressModal = ref(false);
const showMenu = ref(false);

const editForm = ref({
  name: "",
  email: "",
  nomorHp: "",
  tanggalLahir: "",
  jenisKelamin: "",
});

const addressForm = ref({
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  alamatLengkap: "",
});

const profile = computed(() => user.value || {});

const displayName = computed(() => {
  return profile.value.name || "Customer ARUNA";
});

const firstLetter = computed(() => {
  return displayName.value.trim().charAt(0).toUpperCase() || "C";
});

const profilePhoto = computed(() => {
  return profile.value.photo || null;
});

const tanggalLahirFormatted = computed(() => {
  if (!profile.value.tanggalLahir) {
    return "-";
  }

  const tanggal = new Date(profile.value.tanggalLahir);

  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const alamatLengkap = computed(() => {
  return profile.value.alamatLengkap || "-";
});

const wilayahAlamat = computed(() => {
  const wilayah = [
    profile.value.kelurahan,
    profile.value.kecamatan,
    profile.value.kota,
    profile.value.provinsi,
  ].filter(Boolean);

  return wilayah.length ? wilayah.join(", ") : "-";
});

function kembaliKeBeranda() {
  router.push("/");
}

function bukaEditProfil() {
  editForm.value = {
    name: profile.value.name || "",
    email: profile.value.email || "",
    nomorHp: profile.value.nomorHp || "",
    tanggalLahir: profile.value.tanggalLahir || "",
    jenisKelamin: profile.value.jenisKelamin || "",
  };

  showEditModal.value = true;
}

function bukaProfil() {
  showMenu.value = false;
  router.push("/profil");
}

function simpanProfil() {
  try {
    if (!editForm.value.name.trim()) {
      alert("Nama lengkap wajib diisi.");
      return;
    }

    if (!editForm.value.email.trim()) {
      alert("Email wajib diisi.");
      return;
    }

    updateUser({
      name: editForm.value.name.trim(),
      email: editForm.value.email.trim(),
      nomorHp: editForm.value.nomorHp,
      tanggalLahir: editForm.value.tanggalLahir,
      jenisKelamin: editForm.value.jenisKelamin,
    });

    showEditModal.value = false;

    alert("Profil berhasil diperbarui.");
  } catch (error) {
    alert(error.message);
  }
}

function bukaRiwayatPesanan() {
  showMenu.value = false;
  alert("Halaman Riwayat Pesanan akan dibuat berikutnya.");
}

function bukaFavorit() {
  showMenu.value = false;
  alert("Halaman Produk Favorit akan dibuat berikutnya.");
}

function bukaEditAlamat() {
  addressForm.value = {
    provinsi: profile.value.provinsi || "",
    kota: profile.value.kota || "",
    kecamatan: profile.value.kecamatan || "",
    kelurahan: profile.value.kelurahan || "",
    kodePos: profile.value.kodePos || "",
    alamatLengkap: profile.value.alamatLengkap || "",
  };

  showAddressModal.value = true;
}

function simpanAlamat() {
  try {
    if (!addressForm.value.alamatLengkap.trim()) {
      alert("Alamat lengkap wajib diisi.");
      return;
    }

    updateUser({
      provinsi: addressForm.value.provinsi,
      kota: addressForm.value.kota,
      kecamatan: addressForm.value.kecamatan,
      kelurahan: addressForm.value.kelurahan,
      kodePos: addressForm.value.kodePos,
      alamatLengkap: addressForm.value.alamatLengkap.trim(),
    });

    showAddressModal.value = false;

    alert("Alamat berhasil diperbarui.");
  } catch (error) {
    alert(error.message);
  }
}

function bukaPengaturan() {
  alert("Halaman Pengaturan Akun akan dibuat berikutnya.");
}

function keluar() {
  logout();
  router.push("/");
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("File yang dipilih harus berupa gambar.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("aruna_auth") || "null"
    );

    if (!currentUser) {
      return;
    }

    const updatedUser = {
      ...currentUser,
      photo: reader.result,
    };

    localStorage.setItem("aruna_auth", JSON.stringify(updatedUser));

    window.location.reload();
  };

  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="profile-page">

  


    <!-- ================================
         MAIN
    ================================= -->

    <main class="profile-main">

      <!-- BREADCRUMB -->

      <div class="breadcrumb">

        <button
          type="button"
          @click="kembaliKeBeranda"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M3 10.5 12 3l9 7.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.5 10v10h13V10"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
        </button>

        <span>›</span>

        <button
          type="button"
          @click="kembaliKeBeranda"
        >
          Beranda
        </button>

        <span>›</span>

        <span>Akun Saya</span>

        <span>›</span>

        <strong>Profil Saya</strong>

      </div>


      <!-- CONTENT -->

      <div class="profile-layout">

        <!-- ============================
             SIDEBAR
        ============================= -->

        <aside class="profile-sidebar">

          <button
            type="button"
            class="sidebar-item active"
          >
            <span class="sidebar-icon">♙</span>
            <span>Profil Saya</span>
          </button>

          <button
            type="button"
            class="sidebar-item"
            @click="bukaRiwayatPesanan"
          >
            <span class="sidebar-icon">◇</span>
            <span>Riwayat Pesanan</span>
          </button>

          <button
            type="button"
            class="sidebar-item"
            @click="bukaFavorit"
          >
            <span class="sidebar-icon">♡</span>
            <span>Produk Favorit</span>
          </button>

          <div class="sidebar-divider"></div>

          <button
            type="button"
            class="sidebar-item"
            @click="bukaPengaturan"
          >
            <span class="sidebar-icon">⚙</span>
            <span>Pengaturan Akun</span>
          </button>

          <button
            type="button"
            class="sidebar-item logout"
            @click="keluar"
          >
            <span class="sidebar-icon">↪</span>
            <span>Keluar</span>
          </button>

        </aside>


        <!-- ============================
             CENTER
        ============================= -->

        <section class="profile-center">

          <!-- PROFILE HEADER -->

          <div class="profile-card profile-header-card">

            <div class="profile-title-area">

              <div>
                <h1>Profil Saya</h1>

                <p>
                  Kelola informasi pribadi Anda untuk pengalaman
                  yang lebih baik di ARUNA.
                </p>
              </div>

              <button
                type="button"
                class="edit-profile-button"
@click="bukaEditProfil"
              >
                <span>✎</span>
                Edit Profil
              </button>

            </div>

            <div class="profile-header-divider"></div>

            <div class="profile-identity">

              <div class="large-avatar-wrapper">

                <div class="large-avatar">

                  <img
                    v-if="profilePhoto"
                    :src="profilePhoto"
                    :alt="displayName"
                  />

                  <span v-else>
                    {{ firstLetter }}
                  </span>

                </div>

                <label
                  class="camera-button"
                  title="Ganti foto profil"
                >
                  <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                  />

                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 8h3l1.5-2h7L17 8h3v10H4V8Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="13"
                      r="3"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>
                </label>

              </div>

              <div class="identity-info">

                <div class="name-row">

                  <h2>
                    {{ displayName }}
                  </h2>

                  <span class="active-badge">
                    Akun Aktif
                  </span>

                </div>

                <p class="customer-role">
                  Customer ARUNA
                </p>

                <p class="profile-quote">
                  “Mendukung UMKM lokal untuk Indonesia yang lebih maju.”
                </p>

              </div>

            </div>

          </div>


          <!-- INFORMATION -->

          <div class="profile-card information-card">

            <div class="section-heading">

              <div class="section-heading-icon">
                ♙
              </div>

              <h2>Informasi Pribadi</h2>

            </div>

            <div class="information-grid">

              <div class="information-item">
                <span>Nama Lengkap</span>
                <strong>
                  {{ profile.name || "-" }}
                </strong>
              </div>

              <div class="information-item">
                <span>Email</span>
                <strong>
                  {{ profile.email || "-" }}
                </strong>
              </div>

              <div class="information-item">
                <span>Nomor Handphone</span>
                <strong>
                  {{ profile.nomorHp || "-" }}
                </strong>
              </div>

              <div class="information-item">
                <span>Tanggal Lahir</span>
                <strong>
                  {{ tanggalLahirFormatted }}
                </strong>
              </div>

              <div class="information-item full">
                <span>Jenis Kelamin</span>
                <strong>
                  {{ profile.jenisKelamin || "-" }}
                </strong>
              </div>

            </div>

          </div>


          <!-- ADDRESS -->

          <div class="profile-card address-card">

            <div class="address-header">

              <div class="section-heading">

                <div class="section-heading-icon location-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>
                </div>

                <h2>Alamat</h2>

              </div>

              <button
                type="button"
                class="add-address-button"
              @click="bukaEditAlamat"
              >
                <span>⊕</span>
                Tambah Alamat
              </button>

            </div>


            <div class="address-box">

              <div class="address-home-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 10.5 12 3l9 7.5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.5 10v10h13V10"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M9.5 20v-5h5v5"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </div>

              <div class="address-content">

                <span class="main-address-label">
                  Alamat Utama
                </span>

                <h3>
                  {{ alamatLengkap }}
                </h3>

                <p>
                  {{ wilayahAlamat }}
                </p>

              </div>

              <button
                type="button"
                class="address-more"
              >
                ⋮
              </button>

              <button
  type="button"
  class="change-address-button"
  @click="bukaEditAlamat"
>
  Ubah
</button>

            </div>

          </div>

        </section>


        <!-- ============================
             RIGHT SIDEBAR
        ============================= -->

        <aside class="right-column">

          <!-- ACCOUNT SUMMARY -->

          <div class="profile-card summary-card">

            <h2>Ringkasan Akun</h2>

            <div class="summary-divider"></div>

            <div class="summary-item">

              <span class="summary-icon">
                ✉
              </span>

              <span>
                {{ profile.email || "-" }}
              </span>

            </div>

            <div class="summary-item">

              <span class="summary-icon">
                ♧
              </span>

              <span>
                {{ profile.nomorHp || "-" }}
              </span>

            </div>

            <div class="summary-item">

              <span class="summary-icon">
                ▣
              </span>

              <span>
                {{ tanggalLahirFormatted }}
              </span>

            </div>

            <div class="summary-item">

              <span class="summary-icon">
                ♀
              </span>

              <span>
                {{ profile.jenisKelamin || "-" }}
              </span>

            </div>

            <div class="summary-item">

              <span class="summary-icon">
                ♜
              </span>

              <span>
                Belum memiliki toko
              </span>

            </div>

          </div>


          <!-- SECURITY -->

          <div class="profile-card security-card">

            <div class="security-image">
              <img
                src="/images/security-shield.png"
                alt="Data Anda Aman"
              />
            </div>

            <h2>Data Anda Aman</h2>

            <p>
              Kami menjaga keamanan data pribadi Anda
              sesuai dengan standar keamanan terbaik.
            </p>

          </div>


          <!-- TIPS -->

          <div class="profile-card tips-card">

            <div class="tips-title">

              <span class="tips-icon">
                ♧
              </span>

              <h2>
                Tips Keamanan Akun
              </h2>

            </div>

            <ul>

              <li>
                <span>✓</span>
                Gunakan kata sandi yang kuat
              </li>

              <li>
                <span>✓</span>
                Jangan bagikan akun kepada orang lain
              </li>

              <li>
                <span>✓</span>
                Selalu perbarui informasi pribadi
              </li>

              <li>
                <span>✓</span>
                Logout setelah selesai menggunakan akun
              </li>

            </ul>

          </div>

        </aside>

      </div>

    </main>


    <!-- ================================
         EDIT PROFILE MODAL
    ================================= -->

   <div
  v-if="showEditModal"
  class="modal-overlay"
  @click.self="showEditModal = false"
>
  <div class="edit-modal">

    <button
      type="button"
      class="modal-close"
      @click="showEditModal = false"
    >
      ×
    </button>

    <h2>Edit Profil</h2>

    <p class="modal-description">
      Perbarui informasi pribadi Anda.
    </p>

    <div class="edit-form">

      <!-- NAMA -->
      <div class="edit-form-group">
        <label>Nama Lengkap</label>

        <input
          v-model="editForm.name"
          type="text"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <!-- EMAIL -->
      <div class="edit-form-group">
        <label>Email</label>

        <input
          v-model="editForm.email"
          type="email"
          placeholder="Masukkan email"
        />
      </div>

      <!-- NOMOR HP -->
      <div class="edit-form-group">
        <label>Nomor Handphone</label>

        <input
          v-model="editForm.nomorHp"
          type="tel"
          placeholder="Masukkan nomor handphone"
        />
      </div>

      <!-- TANGGAL LAHIR -->
      <div class="edit-form-group">
        <label>Tanggal Lahir</label>

        <input
          v-model="editForm.tanggalLahir"
          type="date"
        />
      </div>

      <!-- JENIS KELAMIN -->
      <div class="edit-form-group">
        <label>Jenis Kelamin</label>

        <select v-model="editForm.jenisKelamin">
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>

    </div>

    <div class="modal-actions">

      <button
        type="button"
        class="modal-cancel-button"
        @click="showEditModal = false"
      >
        Batal
      </button>

      <button
        type="button"
        class="modal-save-button"
        @click="simpanProfil"
      >
        Simpan Perubahan
      </button>

    </div>

  </div>
</div>


    <!-- ================================
         ADDRESS MODAL
    ================================= -->
<div
  v-if="showAddressModal"
  class="modal-overlay"
  @click.self="showAddressModal = false"
>
  <div class="edit-modal address-edit-modal">

    <button
      type="button"
      class="modal-close"
      @click="showAddressModal = false"
    >
      ×
    </button>

    <h2>Edit Alamat</h2>

    <p class="modal-description">
      Perbarui alamat utama Anda.
    </p>

    <div class="edit-form">

      <!-- PROVINSI -->
      <div class="edit-form-group">
        <label>Provinsi</label>

        <input
          v-model="addressForm.provinsi"
          type="text"
          placeholder="Masukkan provinsi"
        />
      </div>

      <!-- KOTA -->
      <div class="edit-form-group">
        <label>Kota / Kabupaten</label>

        <input
          v-model="addressForm.kota"
          type="text"
          placeholder="Masukkan kota / kabupaten"
        />
      </div>

      <!-- KECAMATAN -->
      <div class="edit-form-group">
        <label>Kecamatan</label>

        <input
          v-model="addressForm.kecamatan"
          type="text"
          placeholder="Masukkan kecamatan"
        />
      </div>

      <!-- KELURAHAN -->
      <div class="edit-form-group">
        <label>Kelurahan / Desa</label>

        <input
          v-model="addressForm.kelurahan"
          type="text"
          placeholder="Masukkan kelurahan / desa"
        />
      </div>

      <!-- KODE POS -->
      <div class="edit-form-group">
        <label>Kode Pos</label>

        <input
          v-model="addressForm.kodePos"
          type="text"
          placeholder="Masukkan kode pos"
        />
      </div>

      <!-- ALAMAT LENGKAP -->
      <div class="edit-form-group full">
        <label>Alamat Lengkap</label>

        <textarea
          v-model="addressForm.alamatLengkap"
          rows="4"
          placeholder="Masukkan alamat lengkap"
        ></textarea>
      </div>

    </div>

    <div class="modal-actions">

      <button
        type="button"
        class="modal-cancel-button"
        @click="showAddressModal = false"
      >
        Batal
      </button>

      <button
        type="button"
        class="modal-save-button"
        @click="simpanAlamat"
      >
        Simpan Alamat
      </button>

    </div>

  </div>
</div>

  </div>
</template>


<style scoped>

* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #f3f9ff 0%,
      #edf7ff 100%
    );
  color: #102b56;
  font-family: "Poppins", sans-serif;
}





/* ================================
   MAIN
================================ */

.profile-main {
  width: min(1440px, calc(100% - 96px));
  margin: 0 auto;
  padding: 22px 0 50px;
}

.breadcrumb {
  height: 40px;

  display: flex;
  align-items: center;
  gap: 13px;

  color: #5b82b5;
  font-size: 14px;
}

.breadcrumb button {
  border: none;
  background: transparent;
  color: #174d93;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

.breadcrumb button:first-child {
  display: flex;
}

.breadcrumb svg {
  width: 20px;
  height: 20px;
}

.breadcrumb strong {
  color: #3473c2;
  font-weight: 500;
}


/* ================================
   LAYOUT
================================ */

.profile-layout {
  display: grid;
  grid-template-columns: 295px minmax(0, 1fr) 350px;
  gap: 18px;
  align-items: start;
}


/* ================================
   CARD
================================ */

.profile-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e4edf7;
  border-radius: 13px;

  box-shadow:
    0 8px 25px rgba(54, 108, 164, 0.06);
}


/* ================================
   SIDEBAR
================================ */

.profile-sidebar {
  min-height: 860px;

  padding: 20px;

  background: #ffffff;
  border: 1px solid #e4edf7;
  border-radius: 13px;

  box-shadow:
    0 8px 25px rgba(54, 108, 164, 0.06);
}

.sidebar-item {
  width: 100%;
  height: 51px;

  margin-bottom: 7px;

  border: none;
  border-radius: 9px;

  background: transparent;

  display: flex;
  align-items: center;
  gap: 17px;

  padding: 0 14px;

  color: #142e59;

  font-family: inherit;
  font-size: 15px;
  font-weight: 500;

  cursor: pointer;
  text-align: left;
}

.sidebar-item:hover,
.sidebar-item.active {
  background: #e5f2ff;
  color: #0865d8;
}

.sidebar-icon {
  width: 28px;
  font-size: 25px;
  text-align: center;
}

.sidebar-divider {
  height: 1px;
  background: #e2eaf3;
  margin: 23px 2px;
}

.sidebar-item.logout {
  color: #172f58;
}


/* ================================
   CENTER
================================ */

.profile-center {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-header-card {
  padding: 26px 28px 25px;
}

.profile-title-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.profile-title-area h1 {
  margin: 0;

  color: #142d56;

  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}

.profile-title-area p {
  margin: 4px 0 0;

  color: #627b9f;

  font-size: 13px;
}

.edit-profile-button {
  height: 43px;
  padding: 0 18px;

  border: 1px solid #3c94f2;
  border-radius: 9px;

  background: white;
  color: #0865d8;

  display: flex;
  align-items: center;
  gap: 8px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.edit-profile-button:hover {
  background: #f0f7ff;
}

.edit-profile-button span {
  font-size: 21px;
}

.profile-header-divider {
  height: 1px;
  background: #e5edf6;
  margin: 18px 0;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 24px;
}

.large-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.large-avatar {
  width: 132px;
  height: 132px;

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #dceeff,
      #b7dcff
    );

  border: 1px solid #a6d1ff;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  color: #0865d8;
  font-size: 48px;
  font-weight: 700;
}

.large-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-button {
  position: absolute;
  right: -2px;
  bottom: 0;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  background: white;
  color: #0865d8;

  border: 1px solid #cde2f8;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 5px 15px rgba(25, 89, 150, 0.15);

  cursor: pointer;
}

.camera-button input {
  display: none;
}

.camera-button svg {
  width: 20px;
  height: 20px;
}

.identity-info {
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 13px;
  flex-wrap: wrap;
}

.name-row h2 {
  margin: 0;

  color: #102a54;

  font-size: 23px;
  font-weight: 700;
}

.active-badge {
  padding: 6px 11px;

  border-radius: 9px;

  background: #d8f8e8;
  color: #0ca35b;

  font-size: 11px;
  font-weight: 600;
}

.customer-role {
  margin: 5px 0 9px;

  color: #3973b6;

  font-size: 15px;
}

.profile-quote {
  margin: 0;

  color: #58759a;

  font-size: 13px;
}


/* ================================
   INFORMATION
================================ */

.information-card {
  padding: 19px 28px 21px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.section-heading-icon {
  width: 31px;
  height: 31px;

  color: #0865d8;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 27px;
}

.section-heading h2 {
  margin: 0;

  color: #142d56;

  font-size: 20px;
  font-weight: 700;
}

.information-grid {
  margin-top: 15px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
}

.information-item {
  min-height: 64px;

  padding: 9px 20px;

  border-radius: 10px;

  background:
    linear-gradient(
      120deg,
      #f0f5fb,
      #f5f8fc
    );

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.information-item.full {
  grid-column: 1 / -1;
}

.information-item span {
  color: #597596;
  font-size: 12px;
}

.information-item strong {
  margin-top: 2px;

  color: #122b54;

  font-size: 15px;
  font-weight: 500;
}


/* ================================
   ADDRESS
================================ */

.address-card {
  padding: 18px 28px 22px;
}

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.location-icon svg {
  width: 25px;
  height: 25px;
}

.add-address-button {
  height: 41px;
  padding: 0 15px;

  border: 1px solid #68a9ed;
  border-radius: 9px;

  background: white;
  color: #0865d8;

  display: flex;
  align-items: center;
  gap: 7px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.add-address-button:hover {
  background: #f1f8ff;
}

.add-address-button span {
  font-size: 20px;
}

.address-box {
  position: relative;

  min-height: 145px;

  margin-top: 13px;
  padding: 17px 68px 17px 60px;

  border: 1px solid #cce3fb;
  border-radius: 11px;

  background:
    linear-gradient(
      120deg,
      #f1f8ff,
      #f8fbff
    );
}

.address-home-icon {
  position: absolute;
  left: 19px;
  top: 19px;

  color: #0865d8;
}

.address-home-icon svg {
  width: 20px;
  height: 20px;
}

.address-content {
  min-width: 0;
}

.main-address-label {
  display: inline-block;

  padding: 5px 12px;

  background: #dceeff;
  color: #0865d8;

  border-radius: 8px;

  font-size: 11px;
  font-weight: 600;
}

.address-content h3 {
  margin: 10px 0 2px;

  color: #142d56;

  font-size: 15px;
  font-weight: 500;
}

.address-content p {
  margin: 0;

  color: #5880b4;

  font-size: 13px;
  line-height: 1.55;
}

.address-more {
  position: absolute;
  right: 16px;
  top: 16px;

  border: none;
  background: transparent;

  color: #0e376e;

  font-size: 25px;

  cursor: pointer;
}

.change-address-button {
  position: absolute;
  right: 24px;
  bottom: 18px;

  height: 42px;
  min-width: 92px;

  border: 1px solid #d9e9f9;
  border-radius: 9px;

  background: #e8f4ff;
  color: #0865d8;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}


/* ================================
   RIGHT COLUMN
================================ */

.right-column {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  padding: 21px 24px;
}

.summary-card h2 {
  margin: 0;

  color: #142d56;

  font-size: 20px;
}

.summary-divider {
  height: 1px;
  background: #e5edf6;
  margin: 16px 0 0;
}

.summary-item {
  min-height: 52px;

  border-bottom: 1px solid #e5edf6;

  display: flex;
  align-items: center;
  gap: 17px;

  color: #142d56;

  font-size: 13px;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-icon {
  width: 28px;

  color: #102d58;

  font-size: 21px;

  display: flex;
  justify-content: center;
}

.security-card {
  min-height: 230px;

  padding: 19px 25px;

  text-align: center;
}

.security-image {
  height: 105px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.security-image img {
  width: 105px;
  height: 105px;
  object-fit: contain;
}

.security-card h2 {
  margin: 4px 0 5px;

  color: #142d56;

  font-size: 17px;
}

.security-card p {
  max-width: 270px;

  margin: 0 auto;

  color: #6081a9;

  font-size: 12px;
  line-height: 1.55;
}

.tips-card {
  padding: 22px 25px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tips-icon {
  font-size: 28px;
  color: #142d56;
}

.tips-title h2 {
  margin: 0;

  color: #142d56;

  font-size: 17px;
}

.tips-card ul {
  list-style: none;

  margin: 17px 0 0;
  padding: 0;
}

.tips-card li {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  margin-bottom: 11px;

  color: #18345d;

  font-size: 12px;
  line-height: 1.5;
}

.tips-card li:last-child {
  margin-bottom: 0;
}

.tips-card li span {
  width: 22px;
  height: 22px;
  min-width: 22px;

  border-radius: 50%;

  background: #0865d8;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 700;
}


/* ================================
   MODAL
================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;

  background: rgba(16, 43, 86, 0.35);
  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.simple-modal {
  position: relative;

  width: min(420px, 100%);

  padding: 30px;

  background: white;

  border-radius: 18px;

  box-shadow: 0 25px 70px rgba(16, 43, 86, 0.2);

  text-align: center;
}

.simple-modal h2 {
  margin: 0 0 8px;

  color: #142d56;
}

.simple-modal p {
  margin: 0 0 20px;

  color: #6b83a3;

  font-size: 13px;
  line-height: 1.6;
}

.modal-close {
  position: absolute;
  right: 14px;
  top: 12px;

  border: none;
  background: transparent;

  color: #6f84a1;

  font-size: 25px;

  cursor: pointer;
}

.modal-button {
  width: 100%;
  height: 43px;

  border: none;
  border-radius: 9px;

  background: #0865d8;
  color: white;

  font-family: inherit;
  font-weight: 600;

  cursor: pointer;
}

/* ================================
   EDIT FORM MODAL
================================ */

.edit-modal {
  position: relative;
  width: min(620px, 100%);
  max-height: 90vh;
  overflow-y: auto;

  padding: 32px;

  background: #ffffff;
  border-radius: 18px;

  box-shadow: 0 25px 70px rgba(16, 43, 86, 0.2);
}

.edit-modal h2 {
  margin: 0;

  color: #142d56;
  font-size: 24px;
  font-weight: 700;
}

.modal-description {
  margin: 6px 0 24px;

  color: #7187a7;
  font-size: 13px;
}

.edit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}

.edit-form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.edit-form-group.full {
  grid-column: 1 / -1;
}

.edit-form-group label {
  color: #263f66;
  font-size: 13px;
  font-weight: 600;
}

.edit-form-group input,
.edit-form-group select,
.edit-form-group textarea {
  width: 100%;

  border: 1px solid #d8e4f1;
  border-radius: 9px;

  background: #ffffff;

  padding: 12px 13px;

  outline: none;

  color: #203b61;
  font-family: inherit;
  font-size: 13px;

  transition: 0.2s ease;
}

.edit-form-group input,
.edit-form-group select {
  height: 45px;
}

.edit-form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.edit-form-group input:focus,
.edit-form-group select:focus,
.edit-form-group textarea:focus {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 25px;
}

.modal-cancel-button,
.modal-save-button {
  height: 43px;

  padding: 0 18px;

  border-radius: 9px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.modal-cancel-button {
  border: 1px solid #d8e4f1;

  background: #f4f8fc;
  color: #55708f;
}

.modal-cancel-button:hover {
  background: #eaf1f8;
}

.modal-save-button {
  border: none;

  background: #0865d8;
  color: #ffffff;
}

.modal-save-button:hover {
  background: #0758bf;
}

@media (max-width: 600px) {
  .edit-modal {
    padding: 24px 20px;
  }

  .edit-form {
    grid-template-columns: 1fr;
  }

  .edit-form-group.full {
    grid-column: auto;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-cancel-button,
  .modal-save-button {
    width: 100%;
  }
}


/* ================================
   RESPONSIVE
================================ */

@media (max-width: 1200px) {

  .navbar-menu {
    gap: 18px;
    margin-left: 10px;
  }

  .navbar-link {
    font-size: 13px;
  }

  .profile-layout {
    grid-template-columns: 230px minmax(0, 1fr);
  }

  .right-column {
    grid-column: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .tips-card {
    grid-column: 1 / -1;
  }

}

@media (max-width: 900px) {

  .navbar-inner,
  .profile-main {
    width: min(100% - 30px, 700px);
  }

  .navbar-menu {
    display: none;
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    min-height: auto;
  }

  .right-column {
    grid-column: auto;
    display: flex;
  }

}

@media (max-width: 600px) {

  .profile-main {
    padding-top: 12px;
  }

  .profile-navbar {
    height: 65px;
  }

  .navbar-inner {
    width: calc(100% - 24px);
  }

  .brand-button img {
    width: 135px;
  }

  .navbar-right {
    margin-left: auto;
  }

  .navbar-user-name {
    display: none;
  }

  .profile-layout {
    gap: 12px;
  }

  .profile-title-area {
    align-items: flex-start;
    flex-direction: column;
  }

  .profile-identity {
    align-items: flex-start;
    flex-direction: column;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }

  .information-item.full {
    grid-column: auto;
  }

  .address-header {
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }

  .address-box {
    padding-right: 20px;
  }

  .change-address-button {
    position: static;
    margin-top: 15px;
  }

  .breadcrumb {
    font-size: 11px;
    gap: 7px;
  }

}

</style>