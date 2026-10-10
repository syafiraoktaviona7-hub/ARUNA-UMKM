<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useWilayahFilter } from "@/composables/useWilayahFilter";
import CustomSelect from "@/components/CustomSelect.vue";

const router = useRouter();
const route = useRoute();
const { registerUser, requestOtp, verifyOtp } = useAuth();

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

// =========================
// POPUP VALIDASI
// =========================
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

// =========================
// FORM STATE
// =========================
const form = ref({
  nama: "",
  nomorHp: "",
  tanggalLahir: "",
  jenisKelamin: "",
  pekerjaan: "",
  kontakNama: "",
  kontakHubungan: "",
  kontakNomorHp: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  alamatLengkap: "",
});

// =========================
// PREFILL nomor HP dari halaman verifikasi
// =========================
const phoneVerified = computed(
  () => route.query.verified === "1" && !!route.query.phone,
);

if (route.query.phone) {
  const raw = String(route.query.phone).replace(/^\+/, "");
  const lokal = raw.startsWith("62") ? "0" + raw.slice(2) : raw;
  form.value.nomorHp = lokal;
}

// =========================
// STATE OTP KONTAK DARURAT
// =========================
const kontakOtp = {
  sent: ref(false),
  verified: ref(false),
  loading: ref(false),
  error: ref(""),
  code: ref(""),
  canonical: ref(""),
  cooldown: ref(0),
};
let kontakCooldownTimer = null;

const kontakOtpCanResend = computed(() => kontakOtp.cooldown.value <= 0);

function startKontakCooldown() {
  kontakOtp.cooldown.value = 60;
  if (kontakCooldownTimer) clearInterval(kontakCooldownTimer);
  kontakCooldownTimer = setInterval(() => {
    kontakOtp.cooldown.value--;
    if (kontakOtp.cooldown.value <= 0) {
      clearInterval(kontakCooldownTimer);
      kontakCooldownTimer = null;
    }
  }, 1000);
}

function onKontakPhoneChange() {
  if (kontakOtp.sent.value && !kontakOtp.verified.value) return;
  if (kontakOtp.verified.value) {
    kontakOtp.verified.value = false;
    kontakOtp.sent.value = false;
    kontakOtp.code.value = "";
    kontakOtp.error.value = "";
  }
}

async function mintaOtpKontak() {
  kontakOtp.error.value = "";

  if (!form.value.kontakNomorHp.trim()) {
    kontakOtp.error.value = "Isi nomor HP kontak darurat dulu.";
    return;
  }
  if (form.value.kontakNomorHp.replace(/\D/g, "").length < 9) {
    kontakOtp.error.value = "Nomor HP terlalu pendek.";
    return;
  }

  kontakOtp.loading.value = true;
  try {
    const nomorLokal = form.value.kontakNomorHp.replace(/\D/g, "");
    const nomorKirim = nomorLokal.startsWith("0")
      ? "62" + nomorLokal.slice(1)
      : nomorLokal;

    await requestOtp(nomorKirim, "register");

    kontakOtp.canonical.value = nomorKirim;
    kontakOtp.sent.value = true;
    kontakOtp.verified.value = false;
    kontakOtp.code.value = "";
    startKontakCooldown();
  } catch (e) {
    kontakOtp.error.value = e.message || "Gagal mengirim OTP.";
    kontakOtp.sent.value = false;
    kontakOtp.canonical.value = "";
  } finally {
    kontakOtp.loading.value = false;
  }
}

async function kirimUlangOtpKontak() {
  if (!kontakOtpCanResend.value) return;
  kontakOtp.error.value = "";
  kontakOtp.loading.value = true;
  try {
    await requestOtp(kontakOtp.canonical.value, "register");
    startKontakCooldown();
  } catch (e) {
    kontakOtp.error.value = e.message || "Gagal mengirim ulang OTP.";
  } finally {
    kontakOtp.loading.value = false;
  }
}

function gantiNomorKontak() {
  kontakOtp.sent.value = false;
  kontakOtp.verified.value = false;
  kontakOtp.code.value = "";
  kontakOtp.error.value = "";
  kontakOtp.canonical.value = "";
  if (kontakCooldownTimer) {
    clearInterval(kontakCooldownTimer);
    kontakCooldownTimer = null;
  }
  kontakOtp.cooldown.value = 0;
}

async function cekOtpKontak() {
  kontakOtp.error.value = "";
  if (kontakOtp.code.value.length < 4) {
    kontakOtp.error.value = "Kode OTP minimal 4 digit.";
    return;
  }

  kontakOtp.loading.value = true;
  try {
    await verifyOtp(
      kontakOtp.canonical.value,
      kontakOtp.code.value,
      "register",
    );
    kontakOtp.verified.value = true;
    kontakOtp.error.value = "";
  } catch (e) {
    kontakOtp.error.value = e.message || "Kode OTP salah.";
    kontakOtp.code.value = "";
  } finally {
    kontakOtp.loading.value = false;
  }
}

// =========================
// GENERATE email dummy dari nomor HP
// =========================
function generateEmailFromPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  const nomor = digits.startsWith("0") ? digits.slice(1) : digits;
  return `user${nomor}@aruna.local`;
}

// =========================
// NAVIGASI STEP
// =========================
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

  if (currentStep.value === 1) {
    if (!form.value.nama.trim()) emptyFields.push("Nama Lengkap");
    if (!form.value.nomorHp.trim()) emptyFields.push("Nomor HP");
    if (!form.value.tanggalLahir) emptyFields.push("Tanggal Lahir");
    if (!form.value.jenisKelamin) emptyFields.push("Jenis Kelamin");

    const kontakAnyFilled =
      form.value.kontakNama.trim() ||
      form.value.kontakHubungan ||
      form.value.kontakNomorHp.trim();

    if (kontakAnyFilled) {
      if (!form.value.kontakNama.trim())
        emptyFields.push("Nama Kontak Darurat");
      if (!form.value.kontakHubungan) emptyFields.push("Hubungan Kontak");
      if (!form.value.kontakNomorHp.trim())
        emptyFields.push("Nomor HP Kontak Darurat");

      if (
        form.value.kontakNama.trim() &&
        form.value.kontakHubungan &&
        form.value.kontakNomorHp.trim() &&
        !kontakOtp.verified.value
      ) {
        validationPopup.value = {
          show: true,
          title: "Verifikasi Kontak Darurat",
          message:
            "Silakan verifikasi nomor HP kontak darurat Anda dengan kode OTP.",
          fields: [],
        };
        return;
      }
    }

    if (emptyFields.length > 0) {
      showValidationPopup(emptyFields);
      return;
    }
  }

  if (currentStep.value === 2) {
    if (!provinceId.value) emptyFields.push("Provinsi");
    if (!cityId.value) emptyFields.push("Kota / Kabupaten");
    if (!districtId.value) emptyFields.push("Kecamatan");
    if (!villageId.value) emptyFields.push("Kelurahan / Desa");
    if (!form.value.kodePos.trim()) emptyFields.push("Kode Pos");
    if (!form.value.alamatLengkap.trim()) emptyFields.push("Alamat Lengkap");

    if (emptyFields.length > 0) {
      showValidationPopup(emptyFields);
      return;
    }
  }

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

// =========================
// DAFTAR SEKARANG
// =========================
async function daftarSekarang() {
  const namaDari = (daftar, id) =>
    daftar.value.find((x) => x.id === id)?.name || "";

  try {
    const autoEmail = generateEmailFromPhone(form.value.nomorHp);
    const autoPassword = `aruna_${form.value.nomorHp.replace(/\D/g, "")}`;

    await registerUser({
      name: form.value.nama,
      email: autoEmail,
      password: autoPassword,
      role: "customer",
      nomorHp: form.value.nomorHp,
      tanggalLahir: form.value.tanggalLahir,
      jenisKelamin: form.value.jenisKelamin,
      pekerjaan: form.value.pekerjaan || null,
      kontakNama: form.value.kontakNama || null,
      kontakHubungan: form.value.kontakHubungan || null,
      kontakNomorHp: form.value.kontakNomorHp || null,
      provinsi: namaDari(provinces, provinceId.value),
      kota: namaDari(cities, cityId.value),
      kecamatan: namaDari(districts, districtId.value),
      kelurahan: namaDari(villages, villageId.value),
      kodePos: form.value.kodePos,
      alamatLengkap: form.value.alamatLengkap,
    });

    showSuccessPopup.value = true;
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// COMPUTED
// =========================
const alamatCounter = computed(() => form.value.alamatLengkap.length);

const tanggalLahirFormatted = computed(() => {
  if (!form.value.tanggalLahir) return "-";
  const tanggal = new Date(form.value.tanggalLahir);
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// =========================
// POPUP SUKSES
// =========================
const showSuccessPopup = ref(false);

function bukaLogin() {
  showSuccessPopup.value = false;
  router.push("/login");
}

// =========================
// POPUP PHONE ERROR
// =========================
const showPhoneError = ref(false);

function handlePhoneInput(event) {
  if (phoneVerified.value) return;
  const value = event.target.value;
  if (/[^0-9]/.test(value)) showPhoneError.value = true;
  form.value.nomorHp = value.replace(/[^0-9]/g, "");
}

function closePhoneError() {
  showPhoneError.value = false;
}

// =========================
// OPTIONS untuk CustomSelect
// =========================
const provinceOptions = computed(() =>
  provinces.value.map((p) => ({ value: p.id, label: p.name })),
);
const cityOptions = computed(() =>
  cities.value.map((c) => ({ value: c.id, label: c.name })),
);
const districtOptions = computed(() =>
  districts.value.map((d) => ({ value: d.id, label: d.name })),
);
const villageOptions = computed(() =>
  villages.value.map((v) => ({ value: v.id, label: v.name })),
);
const hubunganOptions = [
  { value: "Ayah", label: "Ayah" },
  { value: "Ibu", label: "Ibu" },
  { value: "Suami", label: "Suami" },
  { value: "Istri", label: "Istri" },
  { value: "Anak", label: "Anak" },
  { value: "Saudara", label: "Saudara" },
  { value: "Kerabat", label: "Kerabat" },
  { value: "Teman", label: "Teman" },
  { value: "Lainnya", label: "Lainnya" },
];
</script>

<template>
  <main class="customer-register-page">
    <!-- BAGIAN KIRI -->
    <section class="left-section">
      <div class="left-content">
        <div class="left-title">
          <h1>Bergabung sebagai <span>Customer</span></h1>
          <p>
            Temukan berbagai produk dan jasa UMKM Indonesia dalam satu platform.
            Daftar sekarang dan mulai dukung produk lokal!
          </p>
        </div>

        <div class="customer-illustration">
          <img src="/images/customer-register.png" alt="Customer ARUNA" />
        </div>

        <div class="benefit-card">
          <div class="benefit-item">
            <div class="benefit-icon">🛍️</div>
            <div>
              <h3>Beragam Produk UMKM</h3>
              <p>Dari makanan, fashion, hingga kerajinan tangan lokal.</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div>
              <h3>Transaksi Aman</h3>
              <p>Belanja dengan aman dan nyaman.</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon heart">♥</div>
            <div>
              <h3>Dukung UMKM Indonesia</h3>
              <p>Setiap transaksi membantu pertumbuhan pelaku usaha lokal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BAGIAN KANAN -->
    <section class="right-section">
      <div class="register-card">
        <!-- CARD TOP -->
        <div class="card-top">
          <button class="back-button" type="button" @click="kembali">
            <span>←</span>
          </button>
          <span class="back-text">Kembali</span>
          <div class="login-text">
            Sudah punya akun? <a href="/login">Masuk</a>
          </div>
        </div>

        <!-- TITLE -->
        <div class="register-title">
          <h2>Daftar Akun <span>Customer</span></h2>
          <p>
            Lengkapi data diri Anda untuk membuat akun baru di platform ARUNA.
          </p>
        </div>

        <!-- PROGRESS -->
        <div class="progress-wrapper">
          <div class="progress-line">
            <div
              class="progress-active"
              :class="{
                'step-two': currentStep === 2,
                'step-three': currentStep === 3,
              }"
            ></div>
          </div>
          <div
            class="progress-step"
            :class="{
              active: currentStep === 1,
              completed: currentStep === 2 || currentStep === 3,
            }"
          >
            <div class="step-circle">1</div>
            <span>Data Diri</span>
          </div>
          <div
            class="progress-step"
            :class="{
              active: currentStep === 2,
              completed: currentStep === 3,
            }"
          >
            <div class="step-circle">2</div>
            <span>Alamat</span>
          </div>
          <div class="progress-step" :class="{ active: currentStep === 3 }">
            <div class="step-circle">3</div>
            <span>Konfirmasi</span>
          </div>
        </div>

        <!-- STEP 1 : DATA DIRI -->
        <div v-if="currentStep === 1" class="form-section">
          <h3>Data Diri</h3>
          <p class="form-description">
            Masukkan informasi dasar Anda dengan benar.
          </p>

          <div class="form-grid">
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

            <div class="form-group">
              <label>Nomor Handphone</label>
              <div class="input-wrapper verified-input">
                <span class="input-icon">⌕</span>
                <input
                  v-model="form.nomorHp"
                  type="tel"
                  placeholder="08xxxxxxxx"
                  :readonly="phoneVerified"
                  :disabled="phoneVerified"
                  @input="handlePhoneInput"
                />
                <span v-if="phoneVerified" class="verified-badge">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <circle cx="12" cy="12" r="10" fill="#22c55e" />
                    <path
                      d="m8 12.5 2.5 2.5L16 9.5"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </div>
              <small v-if="phoneVerified" class="phone-hint verified-hint">
                ✓ Nomor sudah terverifikasi via WhatsApp
              </small>
              <small v-else class="phone-hint">
                Nomor akan diverifikasi via OTP WhatsApp.
              </small>
            </div>

            <div class="form-group">
              <label>Tanggal Lahir</label>
              <div class="input-wrapper">
                <span class="input-icon">▣</span>
                <input v-model="form.tanggalLahir" type="date" />
              </div>
            </div>

            <div class="form-group">
              <label>Pekerjaan</label>
              <div class="input-wrapper">
                <span class="input-icon">▤</span>
                <input
                  v-model="form.pekerjaan"
                  type="text"
                  placeholder="Contoh: Karyawan, Mahasiswa, Wirausaha"
                />
              </div>
            </div>

            <div class="form-group gender-group">
              <label>Jenis Kelamin</label>
              <div class="gender-options">
                <button
                  type="button"
                  class="gender-option"
                  :class="{ selected: form.jenisKelamin === 'Laki-laki' }"
                  @click="form.jenisKelamin = 'Laki-laki'"
                >
                  <span class="gender-symbol male">♂</span>
                  <span>Laki-laki</span>
                  <span class="radio"></span>
                </button>
                <button
                  type="button"
                  class="gender-option"
                  :class="{ selected: form.jenisKelamin === 'Perempuan' }"
                  @click="form.jenisKelamin = 'Perempuan'"
                >
                  <span class="gender-symbol female">♀</span>
                  <span>Perempuan</span>
                  <span class="radio"></span>
                </button>
              </div>
            </div>

            <!-- KONTAK DARURAT -->
            <div class="form-group full-width emergency-section">
              <div class="emergency-header">
                <div class="emergency-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s-7-4.4-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.6-7 10-7 10"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4>
                    Kontak Darurat <small class="optional">(opsional)</small>
                  </h4>
                  <p>
                    Isi kontak yang bisa dihubungi penjual/kurir jika Anda tidak
                    dapat dihubungi. Kalau diisi, wajib diverifikasi via OTP.
                  </p>
                </div>
              </div>

              <div class="form-grid emergency-grid">
                <div class="form-group">
                  <label>Nama Kontak</label>
                  <div class="input-wrapper">
                    <span class="input-icon">♙</span>
                    <input
                      v-model="form.kontakNama"
                      type="text"
                      placeholder="Contoh: Ibu Siti"
                      :disabled="
                        kontakOtp.sent.value || kontakOtp.verified.value
                      "
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Hubungan</label>
                  <CustomSelect
                    v-model="form.kontakHubungan"
                    :disabled="kontakOtp.sent.value || kontakOtp.verified.value"
                    :options="hubunganOptions"
                    placeholder="Pilih hubungan"
                    :searchable="false"
                    icon='<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
                  />
                </div>

                <div class="form-group full-width">
                  <label>Nomor HP Kontak</label>
                  <div class="phone-row">
                    <div
                      class="input-wrapper verified-input"
                      :class="{ 'is-verified': kontakOtp.verified.value }"
                    >
                      <span class="input-icon">⌕</span>
                      <input
                        v-model="form.kontakNomorHp"
                        type="tel"
                        placeholder="08xxxxxxxx"
                        :disabled="
                          kontakOtp.sent.value || kontakOtp.verified.value
                        "
                        @input="
                          form.kontakNomorHp = form.kontakNomorHp.replace(
                            /\D/g,
                            '',
                          );
                          onKontakPhoneChange();
                        "
                      />
                      <span
                        v-if="kontakOtp.verified.value"
                        class="verified-badge"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <circle cx="12" cy="12" r="10" fill="#22c55e" />
                          <path
                            d="m8 12.5 2.5 2.5L16 9.5"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                    </div>

                    <button
                      v-if="!kontakOtp.verified.value && !kontakOtp.sent.value"
                      type="button"
                      class="verify-phone-btn"
                      :disabled="
                        kontakOtp.loading.value || !form.kontakNomorHp.trim()
                      "
                      @click="mintaOtpKontak"
                    >
                      <span v-if="kontakOtp.loading.value">...</span>
                      <span v-else>Kirim OTP</span>
                    </button>

                    <button
                      v-else-if="
                        kontakOtp.sent.value && !kontakOtp.verified.value
                      "
                      type="button"
                      class="verify-phone-btn"
                      @click="gantiNomorKontak"
                    >
                      Ganti Nomor
                    </button>
                  </div>
                </div>

                <div
                  v-if="kontakOtp.sent.value && !kontakOtp.verified.value"
                  class="form-group full-width"
                >
                  <label>Kode OTP Kontak Darurat</label>
                  <div class="phone-row">
                    <div class="input-wrapper">
                      <span class="input-icon">🔒</span>
                      <input
                        v-model="kontakOtp.code.value"
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        placeholder="6 digit kode"
                        autocomplete="one-time-code"
                      />
                    </div>
                    <button
                      type="button"
                      class="verify-phone-btn solid"
                      :disabled="
                        kontakOtp.loading.value ||
                        kontakOtp.code.value.length < 4
                      "
                      @click="cekOtpKontak"
                    >
                      Cek Kode
                    </button>
                  </div>
                  <small class="phone-hint">
                    Kode dikirim ke
                    <strong>+{{ kontakOtp.canonical.value }}</strong>
                    <button
                      type="button"
                      class="resend-inline"
                      :disabled="!kontakOtpCanResend || kontakOtp.loading.value"
                      @click="kirimUlangOtpKontak"
                    >
                      {{
                        kontakOtpCanResend
                          ? "Kirim ulang"
                          : `Ulangi dalam ${kontakOtp.cooldown.value}s`
                      }}
                    </button>
                  </small>
                </div>

                <p v-if="kontakOtp.error.value" class="otp-error full-width">
                  {{ kontakOtp.error.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2 : ALAMAT -->
        <div v-if="currentStep === 2" class="form-section address-section">
          <h3>Alamat</h3>
          <p class="form-description">
            Masukkan alamat lengkap Anda untuk memudahkan proses pengiriman dan
            layanan.
          </p>

          <div class="address-form-group">
            <label>Provinsi</label>
            <CustomSelect
              v-model="provinceId"
              :options="provinceOptions"
              placeholder="Pilih provinsi"
              icon='<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>'
            />
          </div>

          <div class="address-form-group">
            <label>Kota / Kabupaten</label>
            <CustomSelect
              v-model="cityId"
              :disabled="!provinceId"
              :options="cityOptions"
              placeholder="Pilih kota / kabupaten"
              icon='<svg viewBox="0 0 24 24" fill="none"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" stroke="currentColor" stroke-width="1.8"/><path d="M16 9h3a1 1 0 0 1 1 1v11" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h2M8 11h2M8 15h2M13 7h1M13 11h1M13 15h1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
            />
          </div>

          <div class="address-form-group">
            <label>Kecamatan</label>
            <CustomSelect
              v-model="districtId"
              :disabled="!cityId"
              :options="districtOptions"
              placeholder="Pilih kecamatan"
              icon='<svg viewBox="0 0 24 24" fill="none"><path d="M4 6l6-3 4 3 6-3v15l-6 3-4-3-6 3V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 3v15M14 6v15" stroke="currentColor" stroke-width="1.8"/></svg>'
            />
          </div>

          <div class="address-form-group">
            <label>Kelurahan / Desa</label>
            <CustomSelect
              v-model="villageId"
              :disabled="!districtId"
              :options="villageOptions"
              placeholder="Pilih kelurahan / desa"
              icon='<svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 10.5V20h13v-9.5" stroke="currentColor" stroke-width="1.8"/><path d="M9 20v-5h6v5" stroke="currentColor" stroke-width="1.8"/></svg>'
            />
          </div>

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
                @input="
                  form.kodePos = form.kodePos.replace(/\D/g, '').slice(0, 5)
                "
              />
            </div>
          </div>

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
              <span class="address-counter">{{ alamatCounter }}/200</span>
            </div>
          </div>
        </div>

        <!-- STEP 3 : KONFIRMASI -->
        <div v-if="currentStep === 3" class="form-section confirmation-section">
          <h3>Konfirmasi Data</h3>
          <p class="form-description">
            Periksa kembali data Anda sebelum membuat akun Customer ARUNA.
          </p>

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
              <button type="button" class="edit-button" @click="ubahDataDiri">
                <span>✎</span> Ubah
              </button>
            </div>

            <div class="confirmation-divider"></div>

            <div class="confirmation-data-grid">
              <div class="confirmation-data">
                <span>Nama Lengkap</span>
                <strong>{{ form.nama || "-" }}</strong>
              </div>
              <div class="confirmation-data">
                <span>Nomor Handphone</span>
                <strong>
                  {{ form.nomorHp || "-" }}
                  <span v-if="phoneVerified" class="verified-tag"
                    >✓ Terverifikasi</span
                  >
                </strong>
              </div>
              <div class="confirmation-data">
                <span>Tanggal Lahir</span>
                <strong>{{ tanggalLahirFormatted }}</strong>
              </div>
              <div class="confirmation-data">
                <span>Jenis Kelamin</span>
                <strong>{{ form.jenisKelamin || "-" }}</strong>
              </div>
              <div v-if="form.pekerjaan" class="confirmation-data">
                <span>Pekerjaan</span>
                <strong>{{ form.pekerjaan }}</strong>
              </div>
              <div
                v-if="form.kontakNomorHp"
                class="confirmation-data confirmation-full"
              >
                <span>Kontak Darurat</span>
                <strong>
                  {{ form.kontakNama }} ({{ form.kontakHubungan }}) —
                  {{ form.kontakNomorHp }}
                  <span v-if="kontakOtp.verified.value" class="verified-tag">
                    ✓ Terverifikasi
                  </span>
                </strong>
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
              <button type="button" class="edit-button" @click="ubahAlamat">
                <span>✎</span> Ubah
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
              <div class="confirmation-data">
                <span>Kode Pos</span>
                <strong>{{ form.kodePos || "-" }}</strong>
              </div>
              <div class="confirmation-data confirmation-full">
                <span>Alamat Lengkap</span>
                <strong>{{ form.alamatLengkap || "-" }}</strong>
              </div>
            </div>
          </div>

          <!-- AGREEMENT -->
          <label class="agreement-box">
            <input type="checkbox" />
            <span class="agreement-check">✓</span>
            <span class="agreement-text">
              Dengan melanjutkan, saya menyatakan bahwa data yang saya masukkan
              sudah benar dan menyetujui
              <a href="#" @click.prevent>syarat & ketentuan</a>
              penggunaan platform ARUNA.
            </span>
          </label>
        </div>

        <!-- BUTTON NAVIGASI -->
        <div class="button-wrapper">
          <button
            v-if="currentStep === 2 || currentStep === 3"
            class="back-form-button"
            type="button"
            @click="kembali"
          >
            <span class="button-arrow">←</span>
            <span>Kembali</span>
          </button>

          <button
            v-if="currentStep === 1 || currentStep === 2"
            class="continue-button"
            type="button"
            @click="lanjutkan"
          >
            <span>Lanjutkan</span>
            <span class="arrow">→</span>
          </button>

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

        <!-- POPUP NOMOR HP INVALID -->
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
            <div class="phone-error-icon">!</div>
            <h3>Nomor HP Tidak Valid</h3>
            <p>
              Nomor HP hanya boleh diisi menggunakan <strong>angka</strong>.
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

        <!-- POPUP VALIDASI -->
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
                <circle cx="12" cy="16.5" r="1" fill="currentColor" />
              </svg>
            </div>
            <h3>{{ validationPopup.title }}</h3>
            <p class="popup-message">{{ validationPopup.message }}</p>
            <div v-if="validationPopup.fields.length" class="popup-fields">
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

        <!-- POPUP SUKSES REGISTRASI -->
        <Transition name="pop">
          <div
            v-if="showSuccessPopup"
            class="success-overlay"
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-label="Pendaftaran berhasil"
          >
            <div class="success-card">
              <div class="success-confetti" aria-hidden="true">
                <span v-for="n in 16" :key="n" :style="{ '--i': n }"></span>
              </div>

              <div class="success-check">
                <svg viewBox="0 0 52 52" fill="none" aria-hidden="true">
                  <circle class="success-ring" cx="26" cy="26" r="23" />
                  <path class="success-tick" d="M15 27.5l8 8L38 19" />
                </svg>
              </div>

              <span class="success-badge">Pendaftaran Berhasil</span>

              <h3>
                Selamat datang,<br />
                <span>{{ form.nama || "Customer" }}</span
                >!
              </h3>

              <p class="success-text">
                Akun Customer ARUNA Anda telah berhasil dibuat. Silakan masuk
                menggunakan nomor WhatsApp
                <strong>{{ form.nomorHp || "-" }}</strong> untuk mulai
                berbelanja.
              </p>

              <div class="success-info">
                <div class="success-info-item">
                  <span class="success-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6 3H9L11 8L8.5 9.5C9.6 11.8 12.2 14.4 14.5 15.5L16 13L21 15V18C21 19.1 20.1 20 19 20C10.7 20 4 13.3 4 5C4 3.9 4.9 3 6 3Z"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <small>Nomor WhatsApp</small>
                    <strong>{{ form.nomorHp || "-" }}</strong>
                  </div>
                </div>

                <div class="success-info-item">
                  <span class="success-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle
                        cx="12"
                        cy="8"
                        r="3.5"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />
                      <path
                        d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <small>Nama Akun</small>
                    <strong>{{ form.nama || "-" }}</strong>
                  </div>
                </div>
              </div>

              <button type="button" class="success-button" @click="bukaLogin">
                <span>Masuk Sekarang</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h13"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="m13 6 6 6-6 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <small class="success-footer">
                Terima kasih telah bergabung dengan ARUNA 💙
              </small>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* =========================
   HALAMAN
========================= */
.customer-register-page {
  min-height: 100vh;
  display: flex;
  background: radial-gradient(
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
   LEFT SIDE
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
   RIGHT SIDE
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
  box-shadow: 0 12px 40px rgba(52, 108, 164, 0.1);
}

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

/* PROGRESS */
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

/* FORM */
.form-section {
  margin-top: 20px;
}

.form-section h3 {
  margin: 0;
  font-size: 22px;
  color: #102b56;
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
  position: relative;
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

.input-wrapper.verified-input {
  background: #f0fdf4;
  border-color: #86efac;
}

.input-wrapper.verified-input input {
  color: #166534;
  font-weight: 600;
  cursor: not-allowed;
}

.input-icon {
  width: 27px;
  color: #8095b3;
  font-size: 20px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
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
  background: transparent;
}

.input-wrapper input::placeholder {
  color: #9aabc0;
}

.verified-badge {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.phone-hint {
  display: block;
  margin-top: 6px;
  color: #8298b2;
  font-size: 11px;
  line-height: 1.4;
}

.phone-hint.verified-hint {
  color: #16a34a;
  font-weight: 600;
}

.full-width {
  grid-column: 1 / -1;
}

/* GENDER */
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
  transition: all 0.2s ease;
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
  flex-shrink: 0;
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

/* ADDRESS */
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

.select-wrapper input::placeholder {
  color: #9aabc0;
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

/* CONFIRMATION */
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
  transition: color 0.2s ease;
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
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.confirmation-full {
  grid-column: 1 / -1;
  margin-top: 2px;
}

.verified-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

/* AGREEMENT */
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

/* BUTTON NAVIGASI */
.button-wrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
}

.back-form-button {
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 15px;
  background: #e4efff;
  color: #0865d8;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.back-form-button:hover {
  background: #d7e8ff;
  transform: translateY(-1px);
}

.button-arrow {
  font-size: 24px;
  font-weight: 400;
}

.continue-button {
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 15px;
  background: #0865d8;
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.2);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.continue-button:hover {
  background: #0758bf;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(8, 101, 216, 0.28);
}

.arrow {
  font-size: 24px;
  font-weight: 400;
}

/* KONTAK DARURAT */
.emergency-section {
  margin-top: 8px;
  padding: 18px;
  border: 1.5px dashed #cfe2f7;
  border-radius: 14px;
  background: #f8fbff;
}

.emergency-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.emergency-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eaf4ff;
  color: #0865d8;
}

.emergency-icon svg {
  width: 20px;
  height: 20px;
}

.emergency-header h4 {
  margin: 0 0 4px;
  color: #102b56;
  font-size: 15px;
  font-weight: 700;
}

.emergency-header p {
  margin: 0;
  color: #8195b3;
  font-size: 11.5px;
  line-height: 1.5;
}

.emergency-grid {
  margin: 0;
}

.verified-input.is-verified {
  background: #f0fdf4;
  border-color: #86efac;
}

.verified-input.is-verified input {
  color: #166534;
  font-weight: 600;
  cursor: not-allowed;
}

.optional {
  color: #94a9c3;
  font-size: 11px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  margin-left: 4px;
}

.phone-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
  width: 100%;
}

.phone-row .input-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
}

.verify-phone-btn {
  flex-shrink: 0;
  padding: 0 16px;
  border: 1.5px solid #0865d8;
  border-radius: 11px;
  background: #fff;
  color: #0865d8;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s ease;
}

.verify-phone-btn:hover:not(:disabled) {
  background: #eaf3ff;
}

.verify-phone-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  border-color: #b1c0d4;
  color: #b1c0d4;
}

.verify-phone-btn.solid {
  background: #0865d8;
  color: #fff;
  border-color: #0865d8;
}

.verify-phone-btn.solid:hover:not(:disabled) {
  background: #0754b5;
}

.verify-phone-btn.solid:disabled {
  background: #b1c0d4;
  border-color: #b1c0d4;
  color: #fff;
}

.otp-error {
  margin: -8px 0 8px;
  padding: 10px 14px;
  border-radius: 9px;
  background: #fff4f4;
  border: 1px solid #fde0e0;
  color: #dc2626;
  font-size: 12px;
  line-height: 1.5;
}

.resend-inline {
  margin-left: 8px;
  border: none;
  background: transparent;
  padding: 0;
  color: #0865d8;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.resend-inline:hover:not(:disabled) {
  color: #0754b5;
}

.resend-inline:disabled {
  color: #b1c0d4;
  cursor: not-allowed;
  text-decoration: none;
}

/* POPUP NOMOR HP INVALID */
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
   POPUP VALIDASI
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
   POPUP SUKSES REGISTRASI
========================= */
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 35, 80, 0.5);
  backdrop-filter: blur(6px);
  font-family:
    "Poppins",
    "Figtree",
    -apple-system,
    BlinkMacSystemFont,
    Arial,
    sans-serif;
}

.success-card {
  position: relative;
  overflow: hidden;
  width: min(440px, 100%);
  padding: 44px 36px 30px;
  text-align: center;
  background:
    radial-gradient(circle at 50% -10%, #dff0ff 0, transparent 60%), #ffffff;
  border-radius: 28px;
  box-shadow: 0 30px 70px rgba(12, 35, 80, 0.3);
}

.success-check {
  width: 92px;
  height: 92px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8f8ee;
  animation: successBump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.success-check svg {
  width: 64px;
  height: 64px;
}

.success-ring {
  stroke: #1faa52;
  stroke-width: 3;
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: successDraw 0.7s 0.15s ease forwards;
}

.success-tick {
  stroke: #1faa52;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: successDraw 0.45s 0.7s ease forwards;
}

@keyframes successDraw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes successBump {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #188a43;
  font-size: 12.5px;
  font-weight: 650;
}

.success-card h3 {
  margin: 14px 0 10px;
  color: #0d2051;
  font-size: 26px;
  line-height: 1.3;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.success-card h3 span {
  color: #0865d8;
}

.success-text {
  margin: 0 auto 20px;
  max-width: 340px;
  color: #6d86ad;
  font-size: 13.5px;
  line-height: 1.6;
}

.success-text strong {
  color: #0d2051;
  font-weight: 600;
}

.success-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 22px;
}

.success-info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #f4f9ff;
  border: 1px solid #e0ecfa;
  text-align: left;
}

.success-info-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ffffff;
  color: #0865d8;
  box-shadow: 0 2px 8px rgba(8, 101, 216, 0.08);
}

.success-info-icon svg {
  width: 16px;
  height: 16px;
}

.success-info-item small {
  display: block;
  margin-bottom: 2px;
  color: #7d92b8;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}

.success-info-item strong {
  display: block;
  color: #0d2051;
  font-size: 12.5px;
  font-weight: 700;
  word-break: break-all;
  line-height: 1.3;
}

.success-button {
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #1a7bf0 0%, #0865d8 100%);
  color: #ffffff;
  font-family: inherit;
  font-size: 15.5px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(8, 101, 216, 0.35);
}

.success-button svg {
  width: 20px;
  height: 20px;
}

.success-footer {
  display: block;
  margin-top: 14px;
  color: #91a5c8;
  font-size: 12px;
  font-weight: 500;
}

.success-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.success-confetti span {
  position: absolute;
  top: 118px;
  left: calc(var(--i) * 6.6%);
  width: 9px;
  height: 14px;
  border-radius: 3px;
  background: #4e9cff;
  opacity: 0;
  animation: successBurst 1.6s calc(var(--i) * 0.06s + 0.55s) ease-out forwards;
}

.success-confetti span:nth-child(3n) {
  background: #ffc83d;
}

.success-confetti span:nth-child(3n + 1) {
  background: #ff6b7a;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.success-confetti span:nth-child(4n) {
  background: #1faa52;
}

@keyframes successBurst {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
  100% {
    opacity: 0;
    transform: translateY(calc(-90px - (var(--i) * 6px)))
      translateX(calc((var(--i) - 7) * 5px)) rotate(420deg);
  }
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.3s ease;
}

.pop-enter-active .success-card,
.pop-leave-active .success-card {
  transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .success-card,
.pop-leave-to .success-card {
  transform: scale(0.85) translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  .success-check,
  .success-ring,
  .success-tick,
  .success-confetti span {
    animation-duration: 0.01ms;
    animation-delay: 0s;
  }
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
  .emergency-section {
    padding: 14px;
  }
  .emergency-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
  .emergency-icon svg {
    width: 17px;
    height: 17px;
  }
  .emergency-header h4 {
    font-size: 14px;
  }
  .emergency-header p {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .success-card {
    padding: 34px 22px 24px;
    border-radius: 22px;
  }

  .success-card h3 {
    font-size: 22px;
  }

  .success-check {
    width: 78px;
    height: 78px;
  }

  .success-check svg {
    width: 52px;
    height: 52px;
  }

  .success-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 380px) {
  .button-wrapper {
    gap: 8px;
  }
  .back-form-button,
  .continue-button {
    height: 54px;
    font-size: 14px;
  }
  .arrow,
  .button-arrow {
    font-size: 20px;
  }
}
</style>
