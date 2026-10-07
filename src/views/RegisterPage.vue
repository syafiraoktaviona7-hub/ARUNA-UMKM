<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { registerUser } = useAuth();

const currentStep = ref(1);

const form = ref({
  namaLengkap: "",
  namaToko: "",
  email: "",
  nomorHp: "",
  password: "",
  konfirmasiPassword: "",
agreement: false,

  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  pendidikanTerakhir: "",
  tentangDiri: "",

provinsi: "",
kota: "",
kecamatan: "",
kelurahan: "",
kodePos: "",
alamatLengkap: "",
dokumenUsaha: null,
fotoKtp: null,
fotoSelfie: null,
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const validationPopup = ref({
  show: false,
  title: "Data Belum Lengkap",
  message: "Mohon lengkapi data berikut terlebih dahulu.",
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

function nextStep() {
  let emptyFields = [];

  if (currentStep.value === 1) {
    if (!form.value.namaLengkap.trim()) {
      emptyFields.push("Nama Lengkap");
    }

    if (!form.value.namaToko.trim()) {
      emptyFields.push("Nama Toko / Usaha");
    }

    if (!form.value.email.trim()) {
      emptyFields.push("Email");
    }

    if (!form.value.nomorHp.trim()) {
      emptyFields.push("Nomor HP");
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

    if (!form.value.agreement) {
      emptyFields.push("Persetujuan Syarat & Ketentuan");
    }
  }

  if (currentStep.value === 2) {
    if (!form.value.tempatLahir.trim()) {
      emptyFields.push("Tempat Lahir");
    }

    if (!form.value.tanggalLahir.trim()) {
      emptyFields.push("Tanggal Lahir");
    }

    if (!form.value.jenisKelamin) {
      emptyFields.push("Jenis Kelamin");
    }

    if (!form.value.pendidikanTerakhir) {
      emptyFields.push("Pendidikan Terakhir");
    }

    if (!form.value.tentangDiri.trim()) {
      emptyFields.push("Tentang Diri");
    }
  }

  if (currentStep.value === 3) {
    if (!form.value.provinsi) {
      emptyFields.push("Provinsi");
    }

    if (!form.value.kota) {
      emptyFields.push("Kota / Kabupaten");
    }

    if (!form.value.kecamatan) {
      emptyFields.push("Kecamatan");
    }

    if (!form.value.kelurahan) {
      emptyFields.push("Kelurahan");
    }

    if (!form.value.kodePos.trim()) {
      emptyFields.push("Kode Pos");
    }

    if (!form.value.alamatLengkap.trim()) {
      emptyFields.push("Alamat Lengkap");
    }

    if (!form.value.dokumenUsaha) {
      emptyFields.push("Dokumen Usaha");
    }

    if (!form.value.fotoKtp) {
      emptyFields.push("Foto KTP");
    }
  }

  if (emptyFields.length > 0) {
  showValidationPopup(emptyFields);
  return;
}

  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function submitRegister() {
  let emptyFields = [];

  if (!form.value.provinsi) {
    emptyFields.push("Provinsi");
  }

  if (!form.value.kota) {
    emptyFields.push("Kota / Kabupaten");
  }

  if (!form.value.kecamatan) {
    emptyFields.push("Kecamatan");
  }

  if (!form.value.kelurahan) {
    emptyFields.push("Kelurahan");
  }

  if (!form.value.kodePos.trim()) {
    emptyFields.push("Kode Pos");
  }

  if (!form.value.alamatLengkap.trim()) {
    emptyFields.push("Alamat Lengkap");
  }

  if (!form.value.dokumenUsaha) {
    emptyFields.push("Dokumen Usaha");
  }

  if (!form.value.fotoKtp) {
    emptyFields.push("Foto KTP");
  }

 if (emptyFields.length > 0) {
  showValidationPopup(emptyFields);
  return;
}

try {
  registerUser({
    name: form.value.namaLengkap,
    email: form.value.email,
    password: form.value.password,
    role: "penjual",
    namaToko: form.value.namaToko,
  });

  alert("Pendaftaran berhasil! Silakan login menggunakan akun yang baru dibuat.");

  router.push("/login");
} catch (error) {
  alert(error.message);
}
}

const showPhoneError = ref(false);

function handlePhoneInput(event) {
  const value = event.target.value;

  if (/[^0-9]/.test(value)) {
    showPhoneError.value = true;
  }

  event.target.value = value.replace(/[^0-9]/g, "");

  form.phone = event.target.value;
}

function closePhoneError() {
  showPhoneError.value = false;
}

</script>

<template>
  <main class="register-page">
    <div class="register-background">
      <div class="register-shape shape-one"></div>
      <div class="register-shape shape-two"></div>
      <div class="register-shape shape-three"></div>

      <div class="register-container">

        <!-- =========================
             BAGIAN KIRI
        ========================== -->
        <section class="register-intro">

          <div class="intro-badge">
            <span>✦</span>
            Bergabung dengan ARUNA
          </div>

          <h1>
            Mulai Perjalanan
            <span>Bersama ARUNA</span>
          </h1>

          <p class="intro-description">
            Daftar sekarang dan jadi bagian dari ekosistem
            UMKM Indonesia yang lebih maju, terhubung,
            dan berdaya saing.
          </p>

          <div class="benefit-list">

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 9.5L12 4L20 9.5V20H4V9.5Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 20V12H16V20"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </div>

              <div>
                <h3>Promosikan Produk</h3>
                <p>Jangkau lebih banyak pelanggan di seluruh Indonesia.</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 19V14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10 19V10"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M16 19V5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M3 8L8 4L13 7L21 2"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Kembangkan Usaha</h3>
                <p>Dapatkan peluang dan informasi terbaru.</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="8"
                    cy="9"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <circle
                    cx="16"
                    cy="9"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M2.5 19C2.9 15.8 5 14 8 14C11 14 13.1 15.8 13.5 19"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10.5 19C10.9 15.8 13 14 16 14C19 14 21.1 15.8 21.5 19"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Bersama UMKM</h3>
                <p>Bangun komunitas dan dukungan untuk kemajuan bersama.</p>
              </div>
            </div>

          </div>

          <!-- GANTI DENGAN GAMBAR REGISTER -->
          <div class="register-visual">
            <img
              src="/images/aruna-hero.png"
              alt="UMKM Indonesia"
            />
          </div>

        </section>


        <!-- =========================
             BAGIAN KANAN
        ========================== -->
        <section class="register-card">

          <div class="register-header">
            <h2>
              Buat Akun <span>ARUNA</span>
            </h2>

            <p>Lengkapi data diri untuk mulai bergabung.</p>
          </div>


          <!-- =========================
               PROGRESS
          ========================== -->
          <div class="register-progress">

            <div
              class="progress-step"
              :class="{ active: currentStep >= 1 }"
            >
              <div class="step-number">1</div>
              <span>Data Akun</span>
            </div>

            <div
              class="progress-line"
              :class="{ active: currentStep >= 2 }"
            ></div>

            <div
              class="progress-step"
              :class="{ active: currentStep >= 2 }"
            >
              <div class="step-number">2</div>
              <span>Informasi Pribadi</span>
            </div>

            <div
              class="progress-line"
              :class="{ active: currentStep >= 3 }"
            ></div>

            <div
              class="progress-step"
              :class="{ active: currentStep >= 3 }"
            >
              <div class="step-number">3</div>
              <span>Alamat & Dokumen</span>
            </div>

          </div>


          <!-- =========================
               STEP 1
          ========================== -->
          <div v-if="currentStep === 1" class="form-content">

            <div class="form-grid">

              <div class="form-group">
                <label>Nama Lengkap</label>

                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M5 20C5.5 16.5 8 14.5 12 14.5C16 14.5 18.5 16.5 19 20"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                  </svg>

                  <input
                    v-model="form.namaLengkap"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>


              <div class="form-group">
                <label>Nama Toko / Usaha</label>

                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 10H20V20H4V10Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 10L5 4H19L21 10"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 20V14H15V20"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>

                  <input
                    v-model="form.namaToko"
                    type="text"
                    placeholder="Masukkan nama toko atau usaha"
                  />
                </div>
              </div>


              <div class="form-group">
                <label>Email</label>

                <div class="input-wrapper">
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
                      d="M4 7L12 13L20 7"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>

                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Masukkan email aktif"
                  />
                </div>
              </div>


              <div class="form-group">
                <label>Nomor HP</label>

                <div class="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 3H9L11 8L8.5 9.5C9.6 11.8 12.2 14.4 14.5 15.5L16 13L21 15V18C21 19.1 20.1 20 19 20C10.7 20 4 13.3 4 5C4 3.9 4.9 3 6 3Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <input
                    v-model="form.nomorHp"
                    type="tel"
                    placeholder="Contoh: 0812 3456 7890"
@input="handlePhoneInput"
                  />
                </div>
              </div>

            </div>


            <div class="form-group full">
              <label>Password</label>

              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>

                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Buat password"
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2.5 12C4.5 8 7.7 6 12 6C16.3 6 19.5 8 21.5 12C19.5 16 16.3 18 12 18C7.7 18 4.5 16 2.5 12Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                  </svg>
                </button>
              </div>
            </div>


            <div class="form-group full">
              <label>Konfirmasi Password</label>

              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>

                <input
                  v-model="form.konfirmasiPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Ulangi password"
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2.5 12C4.5 8 7.7 6 12 6C16.3 6 19.5 8 21.5 12C19.5 16 16.3 18 12 18C7.7 18 4.5 16 2.5 12Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                  </svg>
                </button>
              </div>
            </div>


           <label class="agreement">
  <input
    type="checkbox"
    v-model="form.agreement"
  />

  <span>
    Saya setuju dengan
    <a href="#">Syarat & Ketentuan</a>
    dan
    <a href="#">Kebijakan Privasi</a>
    ARUNA.
  </span>
</label>


            <button
              type="button"
              class="primary-button"
              @click="nextStep"
            >
              <span>Lanjutkan</span>

              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M13 6L19 12L13 18"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

          </div>


         <!-- =========================
     STEP 2
========================== -->
<div v-else-if="currentStep === 2" class="form-content">

  <div class="form-grid">

    <!-- TEMPAT LAHIR -->
    <div class="form-group">
      <label>Tempat Lahir</label>

      <div class="input-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10.5L12 3L21 10.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 9.5V20H19V9.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M9 20V14H15V20"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>

        <input
          v-model="form.tempatLahir"
          type="text"
          placeholder="Masukkan tempat lahir"
        />
      </div>
    </div>

    <!-- TANGGAL LAHIR -->
    <div class="form-group">
      <label>Tanggal Lahir</label>

      <div class="input-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M7 3V7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M17 3V7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M3 10H21"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>

        <input
          v-model="form.tanggalLahir"
          type="text"
          placeholder="dd/mm/yyyy"
        />

        <svg
          class="calendar-icon"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M7 3V7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M17 3V7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M3 10H21"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      </div>
    </div>

    <!-- JENIS KELAMIN -->
    <div class="form-group">
      <label>Jenis Kelamin</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="8"
            r="3.5"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M5 20C5.5 16.5 8 14.5 12 14.5C16 14.5 18.5 16.5 19 20"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>

        <select v-model="form.jenisKelamin">
          <option value="" disabled>Pilih jenis kelamin</option>
          <option value="laki-laki">Laki-laki</option>
          <option value="perempuan">Perempuan</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- PENDIDIKAN TERAKHIR -->
    <div class="form-group">
      <label>Pendidikan Terakhir</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 4L21 9L12 14L3 9Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M7 12V17C9.8 19.2 14.2 19.2 17 17V12"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
        </svg>

        <select v-model="form.pendidikanTerakhir">
          <option value="" disabled>Pilih pendidikan terakhir</option>
          <option value="sd">SD / Sederajat</option>
          <option value="smp">SMP / Sederajat</option>
          <option value="sma">SMA / SMK / Sederajat</option>
          <option value="d3">Diploma (D3)</option>
          <option value="s1">Sarjana (S1)</option>
          <option value="s2">Magister (S2)</option>
          <option value="s3">Doktor (S3)</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

  </div>

  <!-- TENTANG DIRI -->
  <div class="form-group full">
    <label>Tentang Diri</label>

    <div class="textarea-wrapper">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3H14L19 8V21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
        <path
          d="M14 3V8H19"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M8 16H13"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>

      <textarea
        v-model="form.tentangDiri"
        maxlength="300"
        placeholder="Ceritakan sedikit tentang diri kamu..."
      ></textarea>

      <span class="character-count">
        {{ form.tentangDiri.length }}/300
      </span>
    </div>
  </div>

  <!-- BUTTON -->
  <div class="step-actions">

    <button
      type="button"
      class="secondary-button"
      @click="previousStep"
    >
      Kembali
    </button>

    <button
      type="button"
      class="primary-button"
      @click="nextStep"
    >
      <span>Lanjutkan</span>

      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12H19"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M13 6L19 12L13 18"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

  </div>

</div>


         <!-- =========================
     STEP 3
========================== -->
<div v-else-if="currentStep === 3" class="form-content step-three">

  <!-- ALAMAT -->
  <div class="form-grid">

    <!-- PROVINSI -->
    <div class="form-group">
      <label>Provinsi</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21C16.5 16.8 19 13.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 13.5 7.5 16.8 12 21Z"
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

        <select v-model="form.provinsi">
          <option value="" disabled>Pilih provinsi</option>
          <option value="jawa-timur">Jawa Timur</option>
          <option value="jawa-tengah">Jawa Tengah</option>
          <option value="jawa-barat">Jawa Barat</option>
          <option value="dki-jakarta">DKI Jakarta</option>
          <option value="bali">Bali</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- KOTA -->
    <div class="form-group">
      <label>Kota / Kabupaten</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5 21V5L12 3L19 5V21"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M8 9H10"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M14 9H16"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M8 13H10"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M14 13H16"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M10 21V17H14V21"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>

        <select v-model="form.kota">
          <option value="" disabled>Pilih kota / kabupaten</option>
          <option value="surabaya">Surabaya</option>
          <option value="malang">Malang</option>
          <option value="sidoarjo">Sidoarjo</option>
          <option value="gresik">Gresik</option>
          <option value="kediri">Kediri</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- KECAMATAN -->
    <div class="form-group">
      <label>Kecamatan</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 5H20V19H4V5Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M4 9L9 7L14 9L20 7"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M4 14L9 12L14 14L20 12"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>

        <select v-model="form.kecamatan">
          <option value="" disabled>Pilih kecamatan</option>
          <option value="genteng">Genteng</option>
          <option value="tegalsari">Tegalsari</option>
          <option value="wonokromo">Wonokromo</option>
          <option value="sukolilo">Sukolilo</option>
          <option value="rungkut">Rungkut</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- KELURAHAN -->
    <div class="form-group">
      <label>Kelurahan</label>

      <div class="input-wrapper select-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11L12 4L21 11"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 10V20H19V10"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M9 20V14H15V20"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>

        <select v-model="form.kelurahan">
          <option value="" disabled>Pilih kelurahan</option>
          <option value="genteng">Genteng</option>
          <option value="keputran">Keputran</option>
          <option value="embong-kaliasin">Embong Kaliasin</option>
        </select>

        <span class="select-arrow">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- KODE POS -->
    <div class="form-group">
      <label>Kode Pos</label>

      <div class="input-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5 4H19V20H5V4Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
          <path
            d="M8 8H16"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>

        <input
          v-model="form.kodePos"
          type="text"
          inputmode="numeric"
          maxlength="5"
          placeholder="Masukkan kode pos"
        />
      </div>
    </div>

    <!-- ALAMAT LENGKAP -->
    <div class="form-group address-field">
      <label>Alamat Lengkap</label>

      <div class="input-wrapper">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21C16.5 16.8 19 13.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 13.5 7.5 16.8 12 21Z"
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

        <input
          v-model="form.alamatLengkap"
          type="text"
          placeholder="Masukkan alamat lengkap"
        />
      </div>
    </div>

  </div>

  <!-- DOKUMEN -->
  <div class="document-section">

    <div class="document-heading">
      <h3>Dokumen Pendukung</h3>
      <p>Unggah dokumen sesuai ketentuan untuk verifikasi akun.</p>
    </div>

    <div class="document-grid">

      <!-- DOKUMEN USAHA -->
      <div class="document-card">
        <h4>Dokumen Usaha</h4>
        <span>(NIB / SIUP / lainnya)</span>

        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M7 9L12 4L17 9"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 15V19H19V15"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <label class="file-button">
          Pilih File
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            @change="form.dokumenUsaha = $event.target.files[0]"
          />
        </label>

        <p>PDF, JPG, PNG<br />Maks. 5 MB</p>
      </div>

      <!-- KTP -->
      <div class="document-card">
        <h4>Foto KTP</h4>

        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M7 9L12 4L17 9"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 15V19H19V15"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <label class="file-button">
          Pilih File
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            @change="form.fotoKtp = $event.target.files[0]"
          />
        </label>

        <p>JPG, PNG<br />Maks. 5 MB</p>
      </div>

      <!-- SELFIE -->
      <div class="document-card">
        <h4>Foto Selfie dengan KTP</h4>
        <span>(Opsional)</span>

        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M7 9L12 4L17 9"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 15V19H19V15"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <label class="file-button">
          Pilih File
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            @change="form.fotoSelfie = $event.target.files[0]"
          />
        </label>

        <p>JPG, PNG<br />Maks. 5 MB</p>
      </div>

    </div>
  </div>

  <!-- BUTTON -->
  <div class="step-actions">

    <button
      type="button"
      class="secondary-button"
      @click="previousStep"
    >
      Kembali
    </button>

    <button
      type="button"
      class="primary-button"
      @click="submitRegister"
    >
      <span>Daftar Sekarang</span>

      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12H19"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M13 6L19 12L13 18"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

  </div>

</div>

          


          <!-- =========================
               LOGIN
          ========================== -->
          <div class="login-divider">
            <span>Sudah punya akun?</span>
          </div>

          <button type="button" class="login-button">
            Masuk di sini
          </button>

        </section>

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
    </div>


  </main>

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

</template>

<style scoped>
.register-page {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
}

.register-background {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 55% 50%,
      rgba(190, 224, 255, 0.95) 0%,
      rgba(225, 241, 255, 0.9) 38%,
      #f5faff 75%
    );
}

.register-container {
  position: relative;
  z-index: 2;
  width: min(1440px, 94%);
  min-height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 50px;
  align-items: center;
  padding: 70px 0 40px;
}


/* =========================
   LEFT
========================= */

.register-intro {
  position: relative;
  height: 100%;
  min-height: 780px;
  padding: 35px 0 0 35px;
}

.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #496582;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 25px rgba(49, 112, 178, 0.08);
}

.intro-badge span {
  color: var(--blue);
  font-size: 20px;
}

.register-intro h1 {
  margin-top: 24px;
  max-width: 610px;
  color: #102b50;
  font-size: clamp(42px, 4vw, 64px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -2px;
}

.register-intro h1 span {
  display: block;
  color: #0865d8;
}

.intro-description {
  max-width: 530px;
  margin-top: 24px;
  color: #6a819d;
  font-size: 18px;
  line-height: 1.55;
}


/* =========================
   BENEFITS
========================= */

.benefit-list {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 34px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 320px;
}

.benefit-icon {
  flex: 0 0 66px;
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #0865d8;
  background: #fff;
  box-shadow: 0 7px 22px rgba(33, 107, 181, 0.12);
}

.benefit-icon svg {
  width: 32px;
  height: 32px;
}

.benefit-item h3 {
  color: #102b50;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.benefit-item p {
  width: 200px;
  max-width: 200px;
  margin-top: 3px;
  color: #67809c;
  font-size: 10px;
  line-height: 1.45;
}


/* =========================
   IMAGE
========================= */

.register-visual {
  position: absolute;
  left: -20px;
  right: -50px;
  bottom: -10px;
  z-index: 1;
  pointer-events: none;
}

.register-visual img {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  object-position: left bottom;
}


/* =========================
   CARD
========================= */

.register-card {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 700px;
  justify-self: end;
  padding: 42px 44px 38px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 20px 55px rgba(49, 103, 155, 0.12);
}

.register-header {
  text-align: center;
}

.register-header h2 {
  color: #102b50;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 700;
}

.register-header h2 span {
  color: #0865d8;
}

.register-header p {
  margin-top: 7px;
  color: #8094ac;
  font-size: 15px;
}


/* =========================
   PROGRESS
========================= */

.register-progress {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  align-items: start;
  margin: 25px 55px 34px;
}

.progress-step {
  position: relative;
  min-width: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8ea0b6;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.step-number {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid #c8d5e5;
  background: #fff;
  color: #73879e;
  font-weight: 600;
}

.progress-step.active {
  color: #0865d8;
}

.progress-step.active .step-number {
  border-color: #0865d8;
  background: #0865d8;
  color: #fff;
}

.progress-step span {
  margin-top: 8px;
  white-space: nowrap;
}

.progress-line {
  height: 2px;
  margin-top: 20px;
  background: #d8e3ef;
}

.progress-line.active {
  background: #0865d8;
}


/* =========================
   FORM
========================= */

.form-content {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group.full {
  margin-top: 20px;
}

.form-group label {
  color: #102b50;
  font-size: 13px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 50px;
  border: 1px solid #dce6f1;
  border-radius: 11px;
  background: #fff;
  transition: 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.input-wrapper > svg {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin-left: 15px;
  color: #8298b2;
}

.input-wrapper input {
  width: 100%;
  height: 48px;
  border: 0;
  outline: none;
  padding: 0 14px;
  background: transparent;
  color: #102b50;
  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: #9aacbf;
}

/* =========================
   STEP 2 - INFORMASI PRIBADI
========================= */

.input-wrapper select {
  width: 100%;
  height: 48px;
  border: 0;
  outline: none;
  padding: 0 42px 0 14px;
  background: transparent;
  color: #102b50;
  font-size: 13px;
  appearance: none;
  cursor: pointer;
}

.input-wrapper select:invalid {
  color: #9aacbf;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 15px;
  display: grid;
  place-items: center;
  color: #8298b2;
  pointer-events: none;
}

.select-arrow svg {
  width: 20px;
  height: 20px;
}

.calendar-icon {
  flex: 0 0 auto;
  width: 21px;
  height: 21px;
  margin-left: auto;
  margin-right: 15px;
  color: #8298b2;
}

/* TEXTAREA */

.textarea-wrapper {
  position: relative;
  min-height: 132px;
  border: 1px solid #dce6f1;
  border-radius: 11px;
  background: #fff;
  transition: 0.2s ease;
}

.textarea-wrapper:focus-within {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.textarea-wrapper > svg {
  position: absolute;
  top: 16px;
  left: 15px;
  width: 22px;
  height: 22px;
  color: #8298b2;
}

.textarea-wrapper textarea {
  width: 100%;
  height: 130px;
  padding: 14px 45px 30px 53px;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: #102b50;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
}

.textarea-wrapper textarea::placeholder {
  color: #9aacbf;
}

.character-count {
  position: absolute;
  right: 15px;
  bottom: 9px;
  color: #8298b2;
  font-size: 11px;
}

.password-toggle {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #8298b2;
}

.password-toggle svg {
  width: 22px;
  height: 22px;
}


/* =========================
   AGREEMENT
========================= */

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
  color: #667d98;
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
}

.agreement input {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  accent-color: #0865d8;
}

.agreement a {
  color: #0865d8;
  font-weight: 500;
}


/* =========================
   BUTTON
========================= */

.primary-button {
  width: 100%;
  min-height: 53px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  border: 0;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s ease;
}

.primary-button:hover {
  background: #0754b5;
}

.primary-button svg {
  width: 22px;
  height: 22px;
}

.step-actions {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 12px;
  margin-top: 20px;
}

.step-actions .primary-button {
  margin-top: 0;
}

.secondary-button {
  min-height: 53px;
  border: 1px solid #0865d8;
  border-radius: 10px;
  background: #fff;
  color: #0865d8;
  font-weight: 600;
}


/* =========================
   LOGIN
========================= */

.login-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 23px 0 17px;
  color: #8b9caf;
  font-size: 12px;
}

.login-divider::before,
.login-divider::after {
  content: "";
  height: 1px;
  flex: 1;
  background: #e0e7ef;
}

.login-divider span {
  padding: 0 14px;
  white-space: nowrap;
}

.login-button {
  width: 100%;
  min-height: 50px;
  border: 1px solid #0865d8;
  border-radius: 10px;
  background: #fff;
  color: #0865d8;
  font-size: 14px;
  font-weight: 600;
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


/* =========================
   BACKGROUND SHAPES
========================= */

.register-shape {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
}

.shape-one {
  width: 470px;
  height: 470px;
  left: -250px;
  bottom: -140px;
  background: rgba(66, 163, 255, 0.13);
}

.shape-two {
  width: 400px;
  height: 400px;
  left: 38%;
  top: 220px;
  border: 90px solid rgba(89, 176, 255, 0.11);
}

.shape-three {
  width: 420px;
  height: 420px;
  right: -230px;
  top: -160px;
  background: rgba(52, 148, 239, 0.12);
}

/* =========================
   STEP 3 - ALAMAT & DOKUMEN
========================= */

.step-three {
  padding-bottom: 0;
}

.step-three .form-grid {
  row-gap: 18px;
}

.step-three .form-group label {
  margin-bottom: 7px;
}

.address-field {
  grid-column: span 1;
}

/* DOKUMEN */

.document-section {
  margin-top: 22px;
}

.document-heading h3 {
  color: #102b50;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
}

.document-heading p {
  color: #7d91ad;
  font-size: 11px;
  line-height: 1.5;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 12px;
}

.document-card {
  min-height: 164px;
  padding: 12px 9px 10px;
  border: 1.5px dashed #b7d2f4;
  border-radius: 11px;
  background: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.document-card h4 {
  color: #102b50;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
}

.document-card > span {
  color: #7187a4;
  font-size: 9px;
  margin-top: 1px;
}

.upload-icon {
  width: 34px;
  height: 34px;
  margin: 8px 0 5px;
  display: grid;
  place-items: center;
  color: #0865d8;
}

.upload-icon svg {
  width: 26px;
  height: 26px;
}

.file-button {
  width: 90%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.file-button:hover {
  background: #dceeff;
}

.file-button input {
  display: none;
}

.document-card > p {
  margin-top: 6px;
  color: #7f94ae;
  font-size: 9px;
  line-height: 1.45;
}

.step-three .step-actions {
  margin-top: 16px;
}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .register-container {
    grid-template-columns: 1fr;
    padding: 40px 0;
  }

  .register-intro {
    min-height: auto;
    padding-left: 0;
  }

  .register-visual {
    position: relative;
    left: auto;
    right: auto;
    bottom: auto;
    margin-top: 25px;
  }

  .register-card {
    justify-self: center;
  }
}

@media (max-width: 700px) {
  .register-container {
    width: 92%;
  }

  .register-card {
    padding: 30px 22px;
    border-radius: 20px;
  }

  .register-intro h1 {
    font-size: 38px;
  }

  .intro-description {
    font-size: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .register-progress {
    margin-left: 0;
    margin-right: 0;
  }

  .progress-step span {
    font-size: 10px;
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

</style>