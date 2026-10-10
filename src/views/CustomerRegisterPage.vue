<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useWilayahFilter } from "@/composables/useWilayahFilter";

const router = useRouter();
const route  = useRoute();

const { registerUser } = useAuth();

const {
  provinces,
  cities,
  districts,
  villages,
  provinceId,
  cityId,
  districtId,
  villageId,
  selected,
} = useWilayahFilter();

const currentStep = ref(1);

const validationPopup = ref({
  show: false,
  title: "Data Belum Lengkap",
  message: "Yuk, lengkapi data berikut terlebih dahulu.",
  fields: [],
});

function closeValidationPopup() {
  validationPopup.value.show = false;
}

function showValidationPopup(fields) {
  validationPopup.value = {
    show: true,
    title: "Data Belum Lengkap",
    message: "Yuk, lengkapi data berikut terlebih dahulu.",
    fields,
  };
}

const form = ref({
  nama: "",
  email: "",
  nomorHp: "",
  tanggalLahir: "",
  jenisKelamin: "",
  password: "",
  konfirmasiPassword: "",

  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  alamatLengkap: "",
});

// =========================
// PREFILL nomor HP dari ?phone=+62...
// Di-set oleh LoginPage setelah OTP berhasil
// dan nomor belum terdaftar.
// HARUS setelah `form` dideklarasikan.
// =========================
if (route.query.phone) {
  const raw   = String(route.query.phone).replace(/^\+/, "");
  const lokal = raw.startsWith("62") ? "0" + raw.slice(2) : raw;
  form.value.nomorHp = lokal;
}

function kembali() {
  if (currentStep.value === 3) {
    currentStep.value = 2;
    return;
  }

  if (currentStep.value === 2) {
    currentStep.value = 1;
    return;
  }

  router.push("/");
}

function lanjutkan() {
  let emptyFields = [];

  // =========================
  // STEP 1 - DATA DIRI
  // =========================
  if (currentStep.value === 1) {
    if (!form.value.nama.trim()) {
      emptyFields.push("Nama Lengkap");
    }

    if (!form.value.email.trim()) {
      emptyFields.push("Email");
    }

    if (!form.value.nomorHp.trim()) {
      emptyFields.push("Nomor HP");
    }

    if (!form.value.tanggalLahir) {
      emptyFields.push("Tanggal Lahir");
    }

    if (!form.value.jenisKelamin) {
      emptyFields.push("Jenis Kelamin");
    }

    if (!form.value.password.trim()) {
      emptyFields.push("Password");
    }

    if (!form.value.konfirmasiPassword.trim()) {
      emptyFields.push("Konfirmasi Password");
    }

    if (form.value.password !== form.value.konfirmasiPassword) {
      validationPopup.value = {
        show: true,
        title: "Password Belum Cocok",
        message: "Password dan konfirmasi password harus sama.",
        fields: [],
      };

      return;
    }
  }

  // =========================
  // STEP 2 - ALAMAT
  // =========================
  if (currentStep.value === 2) {
    if (!provinceId.value) {
      emptyFields.push("Provinsi");
    }

    if (!cityId.value) {
      emptyFields.push("Kota / Kabupaten");
    }

    if (!districtId.value) {
      emptyFields.push("Kecamatan");
    }

    if (!villageId.value) {
      emptyFields.push("Kelurahan / Desa");
    }

    if (!form.value.kodePos.trim()) {
      emptyFields.push("Kode Pos");
    }

    if (!form.value.alamatLengkap.trim()) {
      emptyFields.push("Alamat Lengkap");
    }
  }

  // =========================
  // JIKA ADA DATA KOSONG
  // =========================
  if (emptyFields.length > 0) {
    showValidationPopup(emptyFields);
    return;
  }

  // =========================
  // LANJUT KE STEP BERIKUTNYA
  // =========================
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function ubahDataDiri() {
  currentStep.value = 1;
}

function ubahAlamat() {
  currentStep.value = 2;
}

async function daftarSekarang() {
  const namaDari = (daftar, id) => daftar.value.find((x) => x.id === id)?.name || "";

  try {
    await registerUser({
      name: form.value.nama,
      email: form.value.email,
      password: form.value.password,
      role: "customer",

      nomorHp: form.value.nomorHp,
      tanggalLahir: form.value.tanggalLahir,
      jenisKelamin: form.value.jenisKelamin,

      provinsi: namaDari(provinces, provinceId.value),
      kota: namaDari(cities, cityId.value),
      kecamatan: namaDari(districts, districtId.value),
      kelurahan: namaDari(villages, villageId.value),
      kodePos: form.value.kodePos,
      alamatLengkap: form.value.alamatLengkap,
    });

    alert("Pendaftaran berhasil! Silakan login menggunakan akun yang baru dibuat.");

    router.push("/login");
  } catch (error) {
    alert(error.message);
  }
}

const alamatCounter = computed(() => {
  return form.value.alamatLengkap.length;
});

const tanggalLahirFormatted = computed(() => {
  if (!form.value.tanggalLahir) {
    return "-";
  }

  const tanggal = new Date(form.value.tanggalLahir);

  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const showPhoneError = ref(false);

function handlePhoneInput(event) {
  const value = event.target.value;

  // Cek apakah ada karakter selain angka
  if (/[^0-9]/.test(value)) {
    showPhoneError.value = true;
  }

  // Hanya simpan angka
  const cleanedValue = value.replace(/[^0-9]/g, "");

  form.value.nomorHp = cleanedValue;
}

function closePhoneError() {
  showPhoneError.value = false;
}
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
      :class="{
        'step-two': currentStep === 2,
        'step-three': currentStep === 3
      }"
    ></div>
  </div>

  <!-- STEP 1 -->
  <div
    class="progress-step"
    :class="{
      active: currentStep === 1,
      completed: currentStep === 2 || currentStep === 3
    }"
  >
    <div class="step-circle">1</div>
    <span>Data Diri</span>
  </div>

  <!-- STEP 2 -->
  <div
    class="progress-step"
    :class="{
      active: currentStep === 2,
      completed: currentStep === 3
    }"
  >
    <div class="step-circle">2</div>
    <span>Alamat</span>
  </div>

  <!-- STEP 3 -->
  <div
    class="progress-step"
    :class="{ active: currentStep === 3 }"
  >
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
                  @input="handlePhoneInput"
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

<!-- Konfirmasi Password -->
<div class="form-group password-group">
  <label>Konfirmasi Password</label>

  <div class="input-wrapper">
    <span class="input-icon">♙</span>

    <input
      v-model="form.konfirmasiPassword"
      type="password"
      placeholder="Masukkan kembali password"
    />

    <span class="eye-icon">◉</span>
  </div>
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

     <select v-model="provinceId">
  <option value="" disabled>Pilih provinsi</option>

  <option
    v-for="province in provinces"
    :key="province.id"
    :value="province.id"
  >
    {{ province.name }}
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

     <select
  v-model="cityId"
  :disabled="!provinceId"
>
  <option value="" disabled>
    Pilih kota / kabupaten
  </option>

  <option
    v-for="city in cities"
    :key="city.id"
    :value="city.id"
  >
    {{ city.name }}
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

      <select
  v-model="districtId"
  :disabled="!cityId"
>
  <option value="" disabled>
    Pilih kecamatan
  </option>

  <option
    v-for="district in districts"
    :key="district.id"
    :value="district.id"
  >
    {{ district.name }}
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

      <select
  v-model="villageId"
  :disabled="!districtId"
>
  <option value="" disabled>
    Pilih kelurahan / desa
  </option>

  <option
    v-for="village in villages"
    :key="village.id"
    :value="village.id"
  >
    {{ village.name }}
  </option>
</select>
    </div>
      <!-- KODE POS -->
  <div class="address-form-group">
    <label for="kodePos">Kode Pos</label>

    <div class="select-wrapper">
      <span class="address-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M7 9h4M7 13h10M7 16h6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </span>

      <input
        id="kodePos"
        v-model="form.kodePos"
        type="text"
        inputmode="numeric"
        maxlength="5"
        placeholder="Masukkan 5 digit kode pos"
        autocomplete="postal-code"
        @input="form.kodePos = form.kodePos.replace(/\D/g, '').slice(0, 5)"
      />
    </div>
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

<!-- STEP 3 : KONFIRMASI -->
<div
  v-if="currentStep === 3"
  class="form-section confirmation-section"
>
  <h3>Konfirmasi Data</h3>

  <p class="form-description">
    Periksa kembali data Anda sebelum membuat akun Customer ARUNA.
  </p>

  <!-- DATA DIRI -->
  <div class="confirmation-card">

    <div class="confirmation-header">
      <div class="confirmation-title">
        <div class="confirmation-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8"
              r="3.5"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div>
          <h4>Data Diri</h4>
          <p>Informasi dasar akun Anda</p>
        </div>
      </div>

      <button
        type="button"
        class="edit-button"
        @click="ubahDataDiri"
      >
        <span>✎</span>
        Ubah
      </button>
    </div>

    <div class="confirmation-divider"></div>

    <div class="confirmation-data-grid">

      <div class="confirmation-data">
        <span>Nama Lengkap</span>
        <strong>{{ form.nama || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Alamat Email</span>
        <strong>{{ form.email || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Nomor Handphone</span>
        <strong>{{ form.nomorHp || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Tanggal Lahir</span>
        <strong>{{ tanggalLahirFormatted }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Jenis Kelamin</span>
        <strong>{{ form.jenisKelamin || "-" }}</strong>
      </div>

    </div>
  </div>

  <!-- ALAMAT -->
  <div class="confirmation-card">

    <div class="confirmation-header">
      <div class="confirmation-title">
        <div class="confirmation-icon">
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

        <div>
          <h4>Alamat</h4>
          <p>Informasi alamat Anda</p>
        </div>
      </div>

      <button
        type="button"
        class="edit-button"
        @click="ubahAlamat"
      >
        <span>✎</span>
        Ubah
      </button>
    </div>

    <div class="confirmation-divider"></div>

    <div class="confirmation-data-grid">

      <div class="confirmation-data">
        <span>Provinsi</span>
<strong>{{ selected.province || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Kota / Kabupaten</span>
        <strong>{{ selected.city || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Kecamatan</span>
        <strong>{{ selected.district || "-" }}</strong>
      </div>

      <div class="confirmation-data">
        <span>Kelurahan / Desa</span>
        <strong>{{ selected.village || "-" }}</strong>
      </div>

      <div class="confirmation-data confirmation-full">
        <span>Alamat Lengkap</span>
        <strong>{{ form.alamatLengkap || "-" }}</strong>
      </div>

    </div>
  </div>

  <!-- PERSETUJUAN -->
  <label class="agreement-box">
    <input type="checkbox" />

    <span class="agreement-check">
      ✓
    </span>

    <span class="agreement-text">
      Dengan melanjutkan, saya menyatakan bahwa data yang saya masukkan
      sudah benar dan menyetujui
      <a href="#" @click.prevent>syarat & ketentuan</a>
      penggunaan platform ARUNA.
    </span>
  </label>

</div>

        <!-- BUTTON -->
       <!-- BUTTON -->
<!-- BUTTON -->
<div class="button-wrapper">

  <!-- BUTTON KEMBALI -->
  <button
    v-if="currentStep === 2 || currentStep === 3"
    class="back-form-button"
    type="button"
    @click="kembali"
  >
    <span class="button-arrow">←</span>
    <span>Kembali</span>
  </button>

  <!-- STEP 1 -->
  <button
    v-if="currentStep === 1"
    class="continue-button"
    type="button"
    @click="lanjutkan"
  >
    <span>Lanjutkan</span>
    <span class="arrow">→</span>
  </button>

  <!-- STEP 2 -->
  <button
    v-if="currentStep === 2"
    class="continue-button"
    type="button"
    @click="lanjutkan"
  >
    <span>Lanjutkan</span>
    <span class="arrow">→</span>
  </button>

  <!-- STEP 3 -->
  <button
    v-if="currentStep === 3"
    class="continue-button"
    type="button"
    @click="daftarSekarang"
  >
    <span>Daftar Sekarang</span>
    <span class="arrow">→</span>
  </button>

</div>

<!-- POPUP NOMOR HP -->
<div
  v-if="showPhoneError"
  class="phone-error-overlay"
  @click.self="closePhoneError"
>
  <div class="phone-error-modal">

    <button
      type="button"
      class="phone-error-close"
      @click="closePhoneError"
    >
      ×
    </button>

    <div class="phone-error-icon">
      !
    </div>

    <h3>Nomor HP Tidak Valid</h3>

    <p>
      Nomor HP hanya boleh diisi menggunakan
      <strong>angka</strong>.
    </p>

    <button
      type="button"
      class="phone-error-button"
      @click="closePhoneError"
    >
      Mengerti
    </button>

  </div>
</div>

<!-- =========================
     VALIDATION POPUP
========================== -->
<div
  v-if="validationPopup.show"
  class="validation-overlay"
  @click.self="closeValidationPopup"
>
  <div class="validation-popup">

    <button
      type="button"
      class="popup-close"
      @click="closeValidationPopup"
    >
      ×
    </button>

    <div class="popup-icon">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L21 20H3L12 3Z"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
        <path
          d="M12 9V13"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <circle
          cx="12"
          cy="16.5"
          r="1"
          fill="currentColor"
        />
      </svg>
    </div>

    <h3>{{ validationPopup.title }}</h3>

    <p class="popup-message">
      {{ validationPopup.message }}
    </p>

    <div
      v-if="validationPopup.fields.length"
      class="popup-fields"
    >
      <div
        v-for="field in validationPopup.fields"
        :key="field"
        class="popup-field"
      >
        <span class="popup-check">!</span>
        <span>{{ field }}</span>
      </div>
    </div>

    <button
      type="button"
      class="popup-button"
      @click="closeValidationPopup"
    >
      Oke, Saya Lengkapi
    </button>

  </div>
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

.select-wrapper input {
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 0 42px 0 5px;

  border: none;
  outline: none;
  background: transparent;

  font-family: inherit;
  font-size: 14px;
  color: #243d63;
}

.address-form-group:has(#kodePos) {
  margin-top: 8px;
}

.select-wrapper input::placeholder {
  color: #9aabc0;
}

.select-wrapper:has(input)::after {
  display: none;
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

.progress-active.step-three {
  width: 100%;
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
   CONFIRMATION
========================= */

.confirmation-section {
  margin-top: 20px;
}

.confirmation-section .form-description {
  margin-bottom: 15px;
}

.confirmation-card {
  width: 100%;
  border: 1px solid #dce7f5;
  border-radius: 13px;
  padding: 12px 18px 18px;
  margin-bottom: 14px;
  background: #fff;
}

.confirmation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirmation-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.confirmation-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: #e8f2ff;
  color: #0865d8;

  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-icon svg {
  width: 24px;
  height: 24px;
}

.confirmation-title h4 {
  margin: 0 0 2px;
  color: #102b56;
  font-size: 17px;
  font-weight: 600;
}

.confirmation-title p {
  margin: 0;
  color: #8295b1;
  font-size: 12px;
}

.edit-button {
  border: none;
  background: transparent;
  color: #0865d8;

  font-family: inherit;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  gap: 7px;

  cursor: pointer;
}

.edit-button span {
  font-size: 22px;
}

.edit-button:hover {
  color: #0758bf;
}

.confirmation-divider {
  height: 1px;
  background: #e1e9f3;
  margin: 10px 0 12px;
}

.confirmation-data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 35px;
  row-gap: 11px;
}

.confirmation-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.confirmation-data span {
  color: #8195b3;
  font-size: 12px;
}

.confirmation-data strong {
  color: #172f5b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
}

.confirmation-full {
  grid-column: 1 / -1;
  margin-top: 2px;
}

.agreement-box {
  width: 100%;
  min-height: 58px;

  display: flex;
  align-items: center;
  gap: 13px;

  padding: 11px 15px;

  border-radius: 12px;
  background: #eaf3ff;

  cursor: pointer;
}

.agreement-box input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.agreement-check {
  width: 30px;
  height: 30px;
  min-width: 30px;

  border-radius: 50%;
  background: #0865d8;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
  font-weight: 700;
}

.agreement-text {
  color: #61799d;
  font-size: 12px;
  line-height: 1.5;
}

.agreement-text a {
  color: #0865d8;
  font-weight: 600;
  text-decoration: underline;
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

.confirmation-data-grid {
  grid-template-columns: 1fr;
}

.confirmation-full {
  grid-column: auto;
}

.confirmation-card {
  padding: 12px;
}

.confirmation-title {
  gap: 9px;
}

.confirmation-title h4 {
  font-size: 15px;
}

.edit-button {
  font-size: 12px;
}

}

/* ================================
   POPUP NOMOR HP
================================ */

.phone-error-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(20, 45, 78, 0.42);
  backdrop-filter: blur(5px);
}

.phone-error-modal {
  position: relative;

  width: min(380px, 92vw);

  padding: 32px 28px 26px;

  background: #ffffff;

  border: 1px solid #e2ecf8;
  border-radius: 22px;

  text-align: center;

  box-shadow:
    0 25px 70px rgba(20, 65, 110, 0.22),
    0 8px 25px rgba(20, 65, 110, 0.1);

  animation: phoneErrorShow 0.22s ease-out;
}

@keyframes phoneErrorShow {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.phone-error-close {
  position: absolute;

  top: 13px;
  right: 14px;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background: #f3f7fc;
  color: #7890ad;

  font-size: 21px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s ease;
}

.phone-error-close:hover {
  background: #e8f1fb;
  color: #0865d8;
}

.phone-error-icon {
  width: 58px;
  height: 58px;

  margin: 0 auto 15px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff4df;

  color: #f5a623;

  font-size: 30px;
  font-weight: 800;

  box-shadow: 0 8px 20px rgba(245, 166, 35, 0.12);
}

.phone-error-modal h3 {
  margin: 0 0 8px;

  color: #142d4e;

  font-size: 19px;
  font-weight: 700;
}

.phone-error-modal p {
  margin: 0 auto 22px;

  max-width: 280px;

  color: #7186a1;

  font-size: 12px;
  line-height: 1.6;
}

.phone-error-modal p strong {
  color: #0865d8;
  font-weight: 700;
}

.phone-error-button {
  width: 100%;
  height: 42px;

  border: none;
  border-radius: 9px;

  background: #0865d8;
  color: #ffffff;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  box-shadow: 0 7px 18px rgba(8, 101, 216, 0.18);

  transition: 0.2s ease;
}

.phone-error-button:hover {
  background: #0754b5;
}

/* =========================
   VALIDATION POPUP
========================= */

.validation-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(16, 43, 80, 0.35);
  backdrop-filter: blur(5px);

  animation: popupOverlay 0.2s ease;
}

.validation-popup {
  position: relative;

  width: min(430px, 100%);
  padding: 34px 32px 30px;

  border-radius: 24px;
  background: #ffffff;

  text-align: center;

  box-shadow:
    0 25px 70px rgba(8, 101, 216, 0.18),
    0 8px 25px rgba(16, 43, 80, 0.08);

  animation: popupShow 0.25s ease;
}

.popup-close {
  position: absolute;
  top: 14px;
  right: 16px;

  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  border: 0;
  border-radius: 50%;

  background: #f3f7fc;
  color: #7d91ad;

  font-size: 22px;
  line-height: 1;

  cursor: pointer;

  transition: 0.2s ease;
}

.popup-close:hover {
  background: #e8f2ff;
  color: #0865d8;
}

.popup-icon {
  width: 68px;
  height: 68px;

  margin: 0 auto 18px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: #eaf4ff;
  color: #0865d8;
}

.popup-icon svg {
  width: 34px;
  height: 34px;
}

.validation-popup h3 {
  margin: 0;

  color: #102b50;

  font-size: 21px;
  font-weight: 700;
}

.popup-message {
  margin: 8px auto 20px;

  color: #7d91ad;

  font-size: 13px;
  line-height: 1.5;
}

.popup-fields {
  display: flex;
  flex-direction: column;
  gap: 9px;

  margin-bottom: 22px;
  padding: 14px;

  border-radius: 13px;

  background: #f7fbff;

  text-align: left;
}

.popup-field {
  display: flex;
  align-items: center;
  gap: 9px;

  color: #526b88;

  font-size: 12px;
  font-weight: 500;
}

.popup-check {
  width: 20px;
  height: 20px;

  flex: 0 0 20px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: #e4f1ff;
  color: #0865d8;

  font-size: 11px;
  font-weight: 700;
}

.popup-button {
  width: 100%;
  min-height: 48px;

  border: 0;
  border-radius: 10px;

  background: #0865d8;
  color: #fff;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;
}

.popup-button:hover {
  background: #0754b5;
  transform: translateY(-1px);
}

@keyframes popupShow {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes popupOverlay {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

</style>