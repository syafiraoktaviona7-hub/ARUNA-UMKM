<script setup>
import { ref, computed } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

const currentStep = ref(1);

const form = ref({
  nama: "",
  email: "",
  nomorHp: "",
  tanggalLahir: "",
  jenisKelamin: "",
  password: "",

  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  alamatLengkap: "",
});

const provinces = [
  "Jawa Timur",
  "Jawa Barat",
  "Jawa Tengah",
  "DKI Jakarta",
  "Bali",
];

const cities = [
  "Surabaya",
  "Gresik",
  "Sidoarjo",
  "Malang",
  "Kediri",
];

const districts = [
  "Kebomas",
  "Manyar",
  "Driyorejo",
  "Cerme",
  "Menganti",
];

const villages = [
  "Gending",
  "Sidomoro",
  "Sukomulyo",
  "Sembayat",
  "Yosowilangun",
];

function kembali() {
  if (currentStep.value === 2) {
    currentStep.value = 1;
    return;
  }

  router.push("/");
}

function lanjutkan() {
  if (currentStep.value === 1) {
    currentStep.value = 2;
    return;
  }

  if (currentStep.value === 2) {
    console.log("Data customer:", form.value);
  }
}

const alamatCounter = computed(() => {
  return form.value.alamatLengkap.length;
});
</script>

<template>
  <main class="customer-register-page">
    <!-- BAGIAN KIRI -->
    <section class="left-section">
      <div class="left-content">
       
        <div class="left-title">
          <h1>
            Bergabung sebagai
            <span>Customer</span>
          </h1>

          <p>
            Temukan berbagai produk dan jasa UMKM Indonesia dalam satu
            platform. Daftar sekarang dan mulai dukung produk lokal!
          </p>
        </div>

        <div class="customer-illustration">
          <img
            src="/images/customer-register.png"
            alt="Customer ARUNA"
          />
        </div>

        <div class="benefit-card">
          <div class="benefit-item">
            <div class="benefit-icon">
              🛍️
            </div>

            <div>
              <h3>Beragam Produk UMKM</h3>
              <p>
                Dari makanan, fashion, hingga kerajinan tangan lokal.
              </p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon">
              ✓
            </div>

            <div>
              <h3>Transaksi Aman</h3>
              <p>
                Belanja dengan aman dan nyaman.
              </p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon heart">
              ♥
            </div>

            <div>
              <h3>Dukung UMKM Indonesia</h3>
              <p>
                Setiap transaksi membantu pertumbuhan pelaku usaha lokal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BAGIAN KANAN -->
    <section class="right-section">
      <div class="register-card">

        <!-- TOP -->
        <div class="card-top">
          <button
            class="back-button"
            type="button"
            @click="kembali"
          >
            <span>←</span>
          </button>

          <span class="back-text">Kembali</span>

          <div class="login-text">
            Sudah punya akun?
            <a href="#">Masuk</a>
          </div>
        </div>

        <!-- TITLE -->
        <div class="register-title">
          <h2>
            Daftar Akun
            <span>Customer</span>
          </h2>

          <p>
            Lengkapi data diri Anda untuk membuat akun baru
            di platform ARUNA.
          </p>
        </div>

       <!-- PROGRESS -->
<div class="progress-wrapper">
  <div class="progress-line">
   <div
  class="progress-active"
  :class="{ 'step-two': currentStep === 2 }"
></div>
  </div>

  <!-- STEP 1 -->
  <div
    class="progress-step"
    :class="{
      active: currentStep === 1,
      completed: currentStep === 2
    }"
  >
    <div class="step-circle">1</div>
    <span>Data Diri</span>
  </div>

  <!-- STEP 2 -->
  <div
    class="progress-step"
    :class="{ active: currentStep === 2 }"
  >
    <div class="step-circle">2</div>
    <span>Alamat</span>
  </div>

  <!-- STEP 3 -->
  <div class="progress-step">
    <div class="step-circle">3</div>
    <span>Konfirmasi</span>
  </div>
</div>

        <!-- DATA DIRI -->
       <!-- STEP 1 : DATA DIRI -->
<div
  v-if="currentStep === 1"
  class="form-section"
>
          <h3>Data Diri</h3>

          <p class="form-description">
            Masukkan informasi dasar Anda dengan benar.
          </p>

          <div class="form-grid">

            <!-- Nama -->
            <div class="form-group">
              <label>Nama Lengkap</label>

              <div class="input-wrapper">
                <span class="input-icon">♙</span>

                <input
                  v-model="form.nama"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label>Alamat Email</label>

              <div class="input-wrapper">
                <span class="input-icon">✉</span>

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            <!-- Nomor HP -->
            <div class="form-group">
              <label>Nomor Handphone</label>

              <div class="input-wrapper">
                <span class="input-icon">⌕</span>

                <input
                  v-model="form.nomorHp"
                  type="tel"
                  placeholder="08xxxxxxxx"
                />
              </div>
            </div>

            <!-- Tanggal lahir -->
            <div class="form-group">
              <label>Tanggal Lahir</label>

              <div class="input-wrapper">
                <span class="input-icon">▣</span>

                <input
                  v-model="form.tanggalLahir"
                  type="date"
                />
              </div>
            </div>

            <!-- Jenis Kelamin -->
            <div class="form-group gender-group">
              <label>Jenis Kelamin</label>

              <div class="gender-options">

                <button
                  type="button"
                  class="gender-option"
                  :class="{
                    selected: form.jenisKelamin === 'Laki-laki'
                  }"
                  @click="form.jenisKelamin = 'Laki-laki'"
                >
                  <span class="gender-symbol male">♂</span>

                  <span>Laki-laki</span>

                  <span class="radio"></span>
                </button>

                <button
                  type="button"
                  class="gender-option"
                  :class="{
                    selected: form.jenisKelamin === 'Perempuan'
                  }"
                  @click="form.jenisKelamin = 'Perempuan'"
                >
                  <span class="gender-symbol female">♀</span>

                  <span>Perempuan</span>

                  <span class="radio"></span>
                </button>

              </div>
            </div>

            <!-- Password -->
            <div class="form-group password-group">
              <label>Password</label>

              <div class="input-wrapper">
                <span class="input-icon">♙</span>

                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Masukkan password"
                />

                <span class="eye-icon">◉</span>
              </div>

              <small>
                Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.
              </small>
            </div>

          </div>
        </div>

<!-- STEP 2 : ALAMAT -->
<div
  v-if="currentStep === 2"
  class="form-section address-section"
>
  <h3>Alamat</h3>

  <p class="form-description">
    Masukkan alamat lengkap Anda untuk memudahkan proses
    pengiriman dan layanan.
  </p>

  <!-- PROVINSI -->
  <div class="address-form-group">
    <label>Provinsi</label>

    <div class="select-wrapper">
      <span class="address-icon">
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
      </span>

      <select v-model="form.provinsi">
        <option value="" disabled>Pilih provinsi</option>
        <option
          v-for="province in provinces"
          :key="province"
          :value="province"
        >
          {{ province }}
        </option>
      </select>
    </div>
  </div>

  <!-- KOTA -->
  <div class="address-form-group">
    <label>Kota / Kabupaten</label>

    <div class="select-wrapper">
      <span class="address-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M16 9h3a1 1 0 0 1 1 1v11"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M8 7h2M8 11h2M8 15h2M13 7h1M13 11h1M13 15h1"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </span>

      <select v-model="form.kota">
        <option value="" disabled>Pilih kota / kabupaten</option>
        <option
          v-for="city in cities"
          :key="city"
          :value="city"
        >
          {{ city }}
        </option>
      </select>
    </div>
  </div>

  <!-- KECAMATAN -->
  <div class="address-form-group">
    <label>Kecamatan</label>

    <div class="select-wrapper">
      <span class="address-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6l6-3 4 3 6-3v15l-6 3-4-3-6 3V6Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M10 3v15M14 6v15"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      </span>

      <select v-model="form.kecamatan">
        <option value="" disabled>Pilih kecamatan</option>
        <option
          v-for="district in districts"
          :key="district"
          :value="district"
        >
          {{ district }}
        </option>
      </select>
    </div>
  </div>

  <!-- KELURAHAN -->
  <div class="address-form-group">
    <label>Kelurahan / Desa</label>

    <div class="select-wrapper">
      <span class="address-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11.5 12 4l9 7.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.5 10.5V20h13v-9.5"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M9 20v-5h6v5"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      </span>

      <select v-model="form.kelurahan">
        <option value="" disabled>Pilih kelurahan / desa</option>
        <option
          v-for="village in villages"
          :key="village"
          :value="village"
        >
          {{ village }}
        </option>
      </select>
    </div>
  </div>

  <!-- ALAMAT LENGKAP -->
  <div class="address-form-group full-address">
    <label>Alamat Lengkap</label>

    <div class="textarea-wrapper">
      <span class="address-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M14 3v5h5M8 12h8M8 16h6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </span>

      <textarea
        v-model="form.alamatLengkap"
        maxlength="200"
        placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)"
      ></textarea>

      <span class="address-counter">
        {{ alamatCounter }}/200
      </span>
    </div>
  </div>
</div>

        <!-- BUTTON -->
       <!-- BUTTON -->
<div class="button-wrapper">
  <!-- BUTTON KEMBALI -->
  <button
    v-if="currentStep === 2"
    class="back-form-button"
    type="button"
    @click="kembali"
  >
    <span class="button-arrow">←</span>
    <span>Kembali</span>
  </button>

  <!-- BUTTON LANJUTKAN -->
  <button
    class="continue-button"
    type="button"
    @click="lanjutkan"
  >
    <span>Lanjutkan</span>
    <span class="arrow">→</span>
  </button>
</div>
        

      </div>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.customer-register-page {
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(
      circle at 50% 0%,
      #d8edff 0%,
      #eaf6ff 45%,
      #f5fbff 100%
    );
  font-family: "Poppins", sans-serif;
  color: #0d2752;
  overflow: hidden;
}

/* =========================
   LEFT
========================= */

.left-section {
  width: 41%;
  min-height: 100vh;
  padding: 38px 30px 25px 60px;
  position: relative;
  overflow: hidden;
}

.left-section::before {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  left: -130px;
  top: 160px;
}

.left-content {
  width: 100%;
  max-width: 490px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.aruna-logo {
  width: 215px;
  height: auto;
  object-fit: contain;
  object-position: left center;
  margin-bottom: 54px;
}

.left-title h1 {
  margin: 0;
  font-size: 42px;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -1.5px;
  color: #0b2855;
}

.left-title h1 span {
  display: block;
  color: #0865d8;
}

.left-title p {
  width: 410px;
  margin: 20px 0 0;
  color: #5f7698;
  font-size: 17px;
  line-height: 1.5;
}

.customer-illustration {
  height: 365px;
  margin-top: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.customer-illustration img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

/* =========================
   BENEFIT
========================= */

.benefit-card {
  width: 440px;
  margin: -2px auto 0;
  padding: 20px 25px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 12px 35px rgba(70, 130, 190, 0.08);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 15px;
}

.benefit-item:last-child {
  margin-bottom: 0;
}

.benefit-icon {
  width: 55px;
  height: 55px;
  min-width: 55px;
  border-radius: 50%;
  background: #e1f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0865d8;
  font-size: 24px;
  font-weight: 700;
}

.benefit-icon.heart {
  color: #ff5470;
}

.benefit-item h3 {
  margin: 0 0 3px;
  font-size: 15px;
  color: #102c59;
}

.benefit-item p {
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
  color: #7187a7;
}

/* =========================
   RIGHT
========================= */

.right-section {
  width: 59%;
  min-height: 100vh;
  padding: 31px 60px 30px 15px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.register-card {
  width: 100%;
  max-width: 720px;
  min-height: 1070px;
  background: #fff;
  border-radius: 30px;
  padding: 42px 50px 48px;
  box-shadow: 0 12px 40px rgba(52, 108, 164, 0.10);
}

/* =========================
   TOP
========================= */

.card-top {
  display: flex;
  align-items: center;
  position: relative;
}

.back-button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: #f0f4f8;
  color: #102d59;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-text {
  margin-left: 17px;
  font-size: 16px;
  font-weight: 500;
}

.login-text {
  margin-left: auto;
  color: #8194af;
  font-size: 14px;
}

.login-text a {
  color: #0865d8;
  font-weight: 600;
  text-decoration: underline;
}

/* =========================
   TITLE
========================= */

.register-title {
  margin-top: 30px;
}

.register-title h2 {
  margin: 0;
  font-size: 39px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -1px;
}

.register-title h2 span {
  color: #0865d8;
}

.register-title p {
  margin: 9px 0 0;
  color: #8295b1;
  font-size: 16px;
  line-height: 1.4;
}

/* =========================
   PROGRESS
========================= */

.progress-wrapper {
  position: relative;
  margin-top: 34px;
  height: 75px;
  display: flex;
  justify-content: space-between;
}

.progress-line {
  position: absolute;
  top: 25px;
  left: 42px;
  right: 42px;
  height: 4px;
  background: #dbe4ee;
  border-radius: 10px;
}

.progress-active {
  width: 0%;
  height: 100%;
  background: #0865d8;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-active.step-two {
  width: 50%;
}

.progress-step {
  width: 90px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8a9ab1;
  font-size: 14px;
  font-weight: 500;
}

.progress-step.active {
  color: #0865d8;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e9eef4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  margin-bottom: 7px;
}

.progress-step.active .step-circle {
  background: #0865d8;
  color: #fff;
}

.progress-step.completed {
  color: #6caef0;
}

.progress-step.completed .step-circle {
  background: #63a9ee;
  color: #fff;
}

/* =========================
   FORM
========================= */

.form-section {
  margin-top: 20px;
}

.form-section h3 {
  margin: 0;
  font-size: 22px;
}

.form-description {
  margin: 5px 0 25px;
  color: #91a2ba;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 25px;
  row-gap: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #102b56;
  font-size: 14px;
  font-weight: 500;
}

.input-wrapper {
  width: 100%;
  height: 54px;
  border: 1px solid #d8e2ee;
  border-radius: 11px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #fff;
  transition: 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.input-icon {
  width: 27px;
  color: #8095b3;
  font-size: 20px;
  display: flex;
  justify-content: center;
}

.input-wrapper input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding-left: 10px;
  font-family: inherit;
  font-size: 14px;
  color: #243d63;
}

.input-wrapper input::placeholder {
  color: #9aabc0;
}

.eye-icon {
  color: #7890ad;
  font-size: 16px;
}

.password-group {
  grid-column: 1 / -1;
}

.password-group small {
  display: block;
  margin-top: 7px;
  color: #91a2ba;
  font-size: 12px;
}

/* =========================
   GENDER
========================= */

.gender-group {
  grid-column: 1 / -1;
}

.gender-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.gender-option {
  height: 68px;
  padding: 0 18px;
  border: 1px solid #d8e2ee;
  background: #fff;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  color: #172e55;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
}

.gender-option.selected {
  border-color: #0865d8;
  box-shadow: 0 0 0 1px #0865d8;
}

.gender-symbol {
  font-size: 31px;
  width: 28px;
}

.gender-symbol.male {
  color: #0865d8;
}

.gender-symbol.female {
  color: #f04c70;
}

.radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #a9b9cd;
  margin-left: auto;
  position: relative;
}

.gender-option.selected .radio {
  border-color: #0865d8;
}

.gender-option.selected .radio::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0865d8;
  left: 4px;
  top: 4px;
}

/* =========================
   ADDRESS FORM
========================= */

.address-section {
  margin-top: 20px;
}

.address-form-group {
  width: 100%;
  margin-bottom: 18px;
}

.address-form-group label {
  display: block;
  margin-bottom: 8px;
  color: #102b56;
  font-size: 14px;
  font-weight: 500;
}

.select-wrapper {
  position: relative;
  width: 100%;
  height: 54px;

  border: 1px solid #d8e2ee;
  border-radius: 11px;

  background: #fff;

  display: flex;
  align-items: center;

  transition: 0.2s ease;
}

.select-wrapper:focus-within {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.address-icon {
  width: 42px;
  min-width: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8095b3;
}

.address-icon svg {
  width: 22px;
  height: 22px;
}

.select-wrapper select {
  width: 100%;
  height: 100%;

  padding: 0 42px 0 5px;

  border: none;
  outline: none;

  background: transparent;

  appearance: none;

  font-family: inherit;
  font-size: 14px;
  color: #243d63;

  cursor: pointer;
}

.select-wrapper select:invalid {
  color: #9aabc0;
}

.select-wrapper::after {
  content: "⌄";

  position: absolute;
  right: 18px;
  top: 50%;

  transform: translateY(-55%);

  color: #6f89ad;
  font-size: 23px;

  pointer-events: none;
}

.textarea-wrapper {
  position: relative;

  width: 100%;
  min-height: 90px;

  border: 1px solid #d8e2ee;
  border-radius: 11px;

  background: #fff;

  display: flex;
  align-items: flex-start;

  padding-top: 14px;

  transition: 0.2s ease;
}

.textarea-wrapper:focus-within {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.textarea-wrapper textarea {
  width: 100%;
  min-height: 75px;

  resize: none;

  border: none;
  outline: none;

  padding: 0 15px 25px 5px;

  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;

  color: #243d63;

  background: transparent;
}

.textarea-wrapper textarea::placeholder {
  color: #9aabc0;
}

.address-counter {
  position: absolute;
  right: 10px;
  bottom: 7px;

  color: #8295b1;

  font-size: 11px;
}

/* =========================
   ADDRESS BUTTONS
========================= */

.back-form-button {
  width: 295px;
  height: 68px;

  border: none;
  border-radius: 15px;

  background: #e4efff;
  color: #0865d8;

  font-family: inherit;
  font-size: 17px;
  font-weight: 600;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;

  transition: 0.2s ease;
}

.back-form-button:hover {
  background: #d7e8ff;
}

.button-arrow {
  font-size: 28px;
  font-weight: 400;
}

/* =========================
   BUTTON
========================= */

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
}

.continue-button {
  width: 320px;
  height: 68px;
  border: none;
  border-radius: 15px;
  background: #0865d8;
  color: #fff;
  font-family: inherit;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  transition: 0.2s ease;
}

.back-form-button {
  width: 100%;
}

.button-wrapper {
  flex-direction: column-reverse;
}

.back-form-button,
.continue-button {
  width: 100%;
}

.continue-button:hover {
  background: #0758bf;
}

.arrow {
  font-size: 28px;
  font-weight: 400;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .left-section {
    width: 38%;
    padding-left: 35px;
  }

  .right-section {
    width: 62%;
    padding-right: 30px;
  }

  .left-title h1 {
    font-size: 35px;
  }

  .left-title p {
    width: 100%;
  }

  .benefit-card {
    width: 100%;
  }

  .register-card {
    padding: 35px 35px 40px;
  }
}

@media (max-width: 850px) {
  .customer-register-page {
    flex-direction: column;
    overflow: visible;
  }

  .left-section,
  .right-section {
    width: 100%;
    min-height: auto;
  }

  .left-section {
    padding: 30px;
  }

  .right-section {
    padding: 20px 30px 40px;
  }

  .register-card {
    min-height: auto;
  }
}

@media (max-width: 600px) {
  .left-section {
    padding: 25px 20px;
  }

  .right-section {
    padding: 10px 15px 30px;
  }

  .register-card {
    padding: 25px 20px 30px;
    border-radius: 20px;
  }

  .register-title h2 {
    font-size: 29px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .gender-group,
  .password-group {
    grid-column: auto;
  }

  .gender-options {
    grid-template-columns: 1fr;
  }

  .continue-button {
    width: 100%;
  }

  .login-text {
    font-size: 11px;
  }
}
</style>