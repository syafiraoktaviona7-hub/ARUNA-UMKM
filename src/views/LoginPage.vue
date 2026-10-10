<script setup>
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";

const router = useRouter();
const { requestOtp, verifyOtp } = useAuth();

const showRegisterModal = ref(false);

// ===== LOADING SCREEN 3 DETIK =====
const isLoading = ref(true);
const logoSrc = "/images/aruna-logo.png";
const logoFailed = ref(false);

setTimeout(() => {
  isLoading.value = false;
}, 3000);

// ===== FORM OTP =====
const step = ref("phone");
const loading = ref(false);
const error = ref("");

const inputPhone = ref("");
const canonicalPhone = ref("");

// ===== OTP 6 KOTAK =====
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);

function setOtpRef(el, idx) {
  if (el) otpRefs.value[idx] = el;
}

const otpValue = computed(() => otpDigits.value.join(""));

function onOtpInput(e, idx) {
  const raw = e.target.value.replace(/\D/g, "");
  if (raw.length > 1) {
    const digits = raw.slice(0, 6 - idx).split("");
    digits.forEach((d, i) => {
      if (idx + i < 6) otpDigits.value[idx + i] = d;
    });
    const nextIdx = Math.min(idx + digits.length, 5);
    nextTick(() => otpRefs.value[nextIdx]?.focus());
    return;
  }
  otpDigits.value[idx] = raw;
  if (raw && idx < 5) {
    nextTick(() => otpRefs.value[idx + 1]?.focus());
  }
}

function onOtpKeydown(e, idx) {
  if (e.key === "Backspace") {
    if (otpDigits.value[idx]) {
      otpDigits.value[idx] = "";
    } else if (idx > 0) {
      otpDigits.value[idx - 1] = "";
      nextTick(() => otpRefs.value[idx - 1]?.focus());
    }
    e.preventDefault();
  }
  if (e.key === "ArrowLeft" && idx > 0) {
    nextTick(() => otpRefs.value[idx - 1]?.focus());
  }
  if (e.key === "ArrowRight" && idx < 5) {
    nextTick(() => otpRefs.value[idx + 1]?.focus());
  }
}

function onOtpPaste(e) {
  const text = (e.clipboardData || window.clipboardData).getData("text");
  const digits = text.replace(/\D/g, "").slice(0, 6).split("");
  if (!digits.length) return;
  e.preventDefault();
  otpDigits.value = ["", "", "", "", "", ""];
  digits.forEach((d, i) => {
    otpDigits.value[i] = d;
  });
  const nextIdx = Math.min(digits.length, 5);
  nextTick(() => otpRefs.value[nextIdx]?.focus());
}

const cooldown = ref(0);
let cooldownTimer = null;
const canResend = computed(() => cooldown.value <= 0);

function startCooldown() {
  cooldown.value = 60;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
}

function kembaliKeBeranda() {
  router.push("/");
}

function gantiNomor() {
  step.value = "phone";
  otpDigits.value = ["", "", "", "", "", ""];
  error.value = "";
}

async function kirimOtp() {
  error.value = "";
  if (!inputPhone.value.trim()) {
    error.value = "Silakan masukkan nomor WhatsApp Anda.";
    return;
  }

  loading.value = true;
  try {
    const res = await requestOtp(inputPhone.value, "login");
    canonicalPhone.value = res.phone || inputPhone.value;
    step.value = "otp";
    startCooldown();
    nextTick(() => otpRefs.value[0]?.focus());
  } catch (e) {
    error.value = e.message || "Gagal mengirim OTP.";
  } finally {
    loading.value = false;
  }
}

async function kirimUlang() {
  if (!canResend.value) return;
  error.value = "";
  loading.value = true;
  try {
    await requestOtp(canonicalPhone.value, "login");
    startCooldown();
    otpDigits.value = ["", "", "", "", "", ""];
    nextTick(() => otpRefs.value[0]?.focus());
  } catch (e) {
    error.value = e.message || "Gagal mengirim ulang OTP.";
  } finally {
    loading.value = false;
  }
}

// ===== POPUP SELAMAT DATANG =====
const REDIRECT_MS = 2800;
const welcome = ref({ show: false, name: "", role: "", target: "/" });
let redirectTimer = null;

const roleLabel = computed(() => {
  if (welcome.value.role === "admin") return "Administrator";
  if (welcome.value.role === "customer") return "Pelanggan";
  return "Mitra Penjual";
});

const welcomeText = computed(() => {
  if (welcome.value.role === "admin") {
    return "Mengalihkan Anda ke dashboard admin ARUNA.";
  }
  if (welcome.value.role === "customer") {
    return "Yuk, temukan produk dan jasa UMKM terbaik pilihan Anda.";
  }
  return "Senang bertemu lagi. Kelola dan kembangkan usaha Anda bersama ARUNA.";
});

function lanjut() {
  clearTimeout(redirectTimer);
  welcome.value.show = false;
  router.push(welcome.value.target);
}

async function verifikasi() {
  error.value = "";
  const code = otpValue.value;
  if (code.length < 6) {
    error.value = "Kode OTP harus 6 digit.";
    return;
  }

  loading.value = true;
  try {
    const res = await verifyOtp(canonicalPhone.value, code, "login");

    if (!res.registered) {
      router.push({
        name: "customer-register",
        query: { phone: canonicalPhone.value },
      });
      return;
    }

    let target = "/";
    if (res.user.role === "admin") target = "/admin";

    welcome.value = {
      show: true,
      name: res.user.name || "Pengguna",
      role: res.user.role,
      target,
    };

    redirectTimer = setTimeout(lanjut, REDIRECT_MS);
  } catch (e) {
    error.value = e.message || "Kode OTP salah.";
    otpDigits.value = ["", "", "", "", "", ""];
    nextTick(() => otpRefs.value[0]?.focus());
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => {
  clearTimeout(redirectTimer);
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<template>
  <!-- LOADING SCREEN -->
  <Transition name="loader-fade">
    <div v-if="isLoading" class="loader-screen">
      <div class="loader-content">
        <div class="loader-logo">
          <img
            v-if="!logoFailed"
            :src="logoSrc"
            alt="ARUNA"
            @error="logoFailed = true"
          />
          <strong v-else>ARUNA</strong>
          <span class="loader-ring"></span>
          <span class="loader-ring loader-ring-2"></span>
        </div>

        <p class="loader-text">Memuat ARUNA...</p>

        <div class="loader-bar">
          <span></span>
        </div>
      </div>
    </div>
  </Transition>

  <!-- HALAMAN LOGIN -->
  <main v-if="!isLoading" class="login-page">
    <div class="login-card">
      <!-- HEADER — GAMBAR FULL + TEKS OVERLAY -->
      <header class="card-header">
        <div class="hero-image">
          <img src="/images/OTP.png" alt="Ilustrasi ARUNA" />
        </div>

        <div class="hero-overlay" aria-hidden="true"></div>

        <nav class="top-nav" aria-label="Navigasi">
          <button
            type="button"
            class="nav-btn back-btn"
            aria-label="Kembali ke Beranda"
            title="Kembali ke Beranda"
            @click="kembaliKeBeranda"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Kembali</span>
          </button>

          <button
            type="button"
            class="nav-btn register-btn"
            aria-label="Daftar akun baru"
            @click="showRegisterModal = true"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="12"
                cy="8"
                r="3.5"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>Daftar</span>
          </button>
        </nav>

        <div class="hero-title">
          <h1>Masuk</h1>
          <p>Selamat datang kembali di ARUNA</p>
        </div>
      </header>

      <!-- BODY FORM -->
      <section class="card-body">
        <div class="body-title">
          <h2>Masuk ke Akun <span>ARUNA</span></h2>

          <p v-if="step === 'phone'">
            Masukkan nomor WhatsApp Anda. Kami akan mengirim kode OTP untuk
            verifikasi.
          </p>
          <p v-else>
            Kode OTP telah dikirim ke <strong>{{ canonicalPhone }}</strong
            >. Masukkan 6 digit kode untuk melanjutkan.
          </p>
        </div>

        <form
          class="otp-form"
          @submit.prevent="step === 'phone' ? kirimOtp() : verifikasi()"
        >
          <!-- STEP 1 -->
          <template v-if="step === 'phone'">
            <div class="form-group">
              <label for="phone">Nomor WhatsApp</label>
              <div class="input-wrapper">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 3H9L11 8L8.5 9.5C9.6 11.8 12.2 14.4 14.5 15.5L16 13L21 15V18C21 19.1 20.1 20 19 20C10.7 20 4 13.3 4 5C4 3.9 4.9 3 6 3Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="input-prefix">+62</span>
                <input
                  id="phone"
                  v-model="inputPhone"
                  type="tel"
                  inputmode="numeric"
                  placeholder="812 3456 7890"
                  autocomplete="tel"
                />
              </div>
            </div>
          </template>

          <!-- STEP 2 -->
          <template v-else>
            <div class="form-group">
              <label>Kode OTP</label>
              <div class="otp-boxes" @paste.prevent="onOtpPaste">
                <input
                  v-for="(digit, idx) in otpDigits"
                  :key="idx"
                  :ref="(el) => setOtpRef(el, idx)"
                  :value="digit"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  autocomplete="one-time-code"
                  class="otp-box"
                  :class="{ filled: digit }"
                  @input="onOtpInput($event, idx)"
                  @keydown="onOtpKeydown($event, idx)"
                  @focus="$event.target.select()"
                />
              </div>
            </div>

            <div class="otp-actions">
              <!-- TOMBOL KIRIM ULANG -->
              <button
                type="button"
                class="otp-action-btn resend-btn"
                :class="{ cooling: !canResend }"
                :disabled="!canResend || loading"
                @click="kirimUlang"
              >
                <span class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M21 12a9 9 0 1 1-3-6.7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21 4v5h-5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="action-text">
                  <template v-if="canResend">Kirim ulang kode</template>
                  <template v-else>
                    Kirim ulang dalam <b>{{ cooldown }}s</b>
                  </template>
                </span>
              </button>

              <!-- TOMBOL GANTI NOMOR -->
              <button
                type="button"
                class="otp-action-btn change-btn"
                @click="gantiNomor"
              >
                <span class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 3H9L11 8L8.5 9.5C9.6 11.8 12.2 14.4 14.5 15.5L16 13L21 15V18C21 19.1 20.1 20 19 20C10.7 20 4 13.3 4 5C4 3.9 4.9 3 6 3Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                    <path
                      d="m15 5 4 4-4 4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19 9h-7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <span class="action-text">Ganti nomor</span>
              </button>
            </div>
          </template>

          <!-- ERROR -->
          <p v-if="error" class="form-error">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M12 7v6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
            <span>{{ error }}</span>
          </p>

          <!-- SUBMIT -->
          <button type="submit" class="login-submit" :disabled="loading">
            <span v-if="loading" class="spinner" aria-hidden="true"></span>

            <span v-if="step === 'phone'">
              {{ loading ? "Mengirim..." : "Kirim OTP" }}
            </span>
            <span v-else>
              {{ loading ? "Memverifikasi..." : "Verifikasi & Masuk" }}
            </span>

            <svg
              v-if="!loading"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
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
        </form>

        <div class="divider" aria-hidden="true">
          <span>atau</span>
        </div>

        <div class="quick-actions">
          <button type="button" class="quick-btn" @click="kembaliKeBeranda">
            <span class="quick-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 11l9-8 9 8"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 10v10h14V10"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="quick-text">Beranda</span>
          </button>

          <button
            type="button"
            class="quick-btn primary"
            @click="showRegisterModal = true"
          >
            <span class="quick-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="quick-text">Daftar Akun</span>
          </button>
        </div>

        <div class="login-security">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l8 3v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path
              d="m8.5 12 2.2 2.2 4.8-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Data Anda aman dan terlindungi bersama ARUNA.</span>
        </div>
      </section>
    </div>
  </main>

  <!-- POPUP WELCOME -->
  <Transition name="pop">
    <div
      v-if="welcome.show"
      class="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Login berhasil"
    >
      <div class="welcome-card">
        <div class="confetti" aria-hidden="true">
          <span v-for="n in 14" :key="n" :style="{ '--i': n }"></span>
        </div>

        <div class="welcome-check">
          <svg viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <circle class="ring" cx="26" cy="26" r="23" />
            <path class="tick" d="M15 27.5l8 8L38 19" />
          </svg>
        </div>

        <span class="welcome-badge">Login berhasil</span>

        <h3>
          Selamat datang,
          <span>{{ welcome.name }}</span
          >!
        </h3>

        <p class="welcome-text">{{ welcomeText }}</p>

        <div class="welcome-role">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l8 3v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="m8.5 12 2.2 2.2 4.8-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Masuk sebagai {{ roleLabel }}</span>
        </div>

        <button type="button" class="welcome-btn" @click="lanjut">
          <span>Lanjutkan</span>
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

        <div class="welcome-progress" aria-hidden="true">
          <span :style="{ animationDuration: REDIRECT_MS + 'ms' }"></span>
        </div>
        <small>Mengalihkan otomatis...</small>
      </div>
    </div>
  </Transition>

  <RegisterRoleModal
    v-if="showRegisterModal"
    @close="showRegisterModal = false"
  />
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* =========================
   HALAMAN
========================= */

.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background:
    radial-gradient(
      circle at 12% 10%,
      rgba(120, 190, 255, 0.35) 0 180px,
      transparent 181px
    ),
    radial-gradient(
      circle at 88% 90%,
      rgba(120, 190, 255, 0.3) 0 220px,
      transparent 221px
    ),
    linear-gradient(135deg, #eaf4ff 0%, #d7ebff 50%, #eef7ff 100%);
  font-family:
    "Poppins",
    "Figtree",
    -apple-system,
    BlinkMacSystemFont,
    Arial,
    sans-serif;
}

/* =========================
   KARTU LOGIN
========================= */

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(12, 35, 80, 0.18),
    0 10px 24px rgba(12, 35, 80, 0.1);
}

/* =========================
   HEADER — GAMBAR FULL + OVERLAY
========================= */

.card-header {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #0a4fb0 0%, #0865d8 100%);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(12, 35, 80, 0.05) 0%,
    rgba(12, 35, 80, 0.15) 45%,
    rgba(8, 60, 140, 0.85) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* NAV TOMBOL */
.top-nav {
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 6px 16px rgba(12, 35, 80, 0.25);
}

.nav-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.back-btn {
  background: #ffffff;
  color: #0d2051;
}

.back-btn:hover {
  background: #f1f7ff;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(12, 35, 80, 0.3);
}

.register-btn {
  background: #0865d8;
  color: #ffffff;
}

.register-btn:hover {
  background: #0754b5;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.45);
}

.hero-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 24px 24px 22px;
  color: #ffffff;
}

.hero-title h1 {
  margin: 0 0 6px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.hero-title p {
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
}

/* =========================
   BODY (FORM)
========================= */

.card-body {
  padding: 26px 26px 24px;
  background: #ffffff;
}

.body-title {
  margin-bottom: 22px;
}

.body-title h2 {
  margin: 0 0 8px;
  color: #0d2051;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.body-title h2 span {
  color: #0865d8;
}

.body-title p {
  margin: 0;
  color: #7d92b8;
  font-size: 13.5px;
  line-height: 1.55;
}

.body-title p strong {
  color: #0d2051;
  font-weight: 600;
}

/* =========================
   FORM
========================= */

.otp-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #102652;
  font-size: 13px;
  font-weight: 650;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1.5px solid #e0eaf6;
  border-radius: 12px;
  background: #f8fbff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #4e9cff;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(8, 101, 216, 0.08);
}

.input-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #6d84aa;
  display: grid;
  place-items: center;
}

.input-icon svg {
  width: 100%;
  height: 100%;
}

.input-prefix {
  margin-left: 10px;
  padding-right: 10px;
  border-right: 1px solid #dbe6f3;
  color: #0d2051;
  font-size: 14.5px;
  font-weight: 650;
}

.input-wrapper input {
  flex: 1;
  height: 100%;
  padding: 0 0 0 10px;
  border: none;
  background: transparent;
  color: #0d2051;
  font-family: inherit;
  font-size: 15px;
  font-weight: 550;
  outline: none;
  min-width: 0;
}

.input-wrapper input::placeholder {
  color: #a5b6cf;
  font-weight: 500;
}

/* =========================
   OTP 6 KOTAK
========================= */

.otp-boxes {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.otp-box {
  width: 100%;
  height: 58px;
  padding: 0;
  border: 1.5px solid #dbe6f3;
  border-radius: 12px;
  background: #f8fbff;
  color: #0d2051;
  font-family: "Poppins", "Figtree", Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;
  caret-color: #0865d8;
}

.otp-box:hover {
  border-color: #b8d0ea;
}

.otp-box:focus {
  border-color: #0865d8;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(8, 101, 216, 0.12);
  transform: translateY(-2px);
}

.otp-box.filled {
  border-color: #0865d8;
  background: #eaf4ff;
  color: #0865d8;
}

/* =========================
   OTP ACTIONS (2 TOMBOL TERPISAH)
========================= */

.otp-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0 0 18px;
}

.otp-action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;
  text-align: center;
  line-height: 1.15;
  overflow: hidden;
  white-space: nowrap;
}

.action-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.action-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.action-text {
  display: inline-block;
}

.action-text b {
  font-weight: 800;
}

/* TOMBOL KIRIM ULANG */
.resend-btn {
  border: 1.5px solid #cfe2f7;
  background: #eff6ff;
  color: #0865d8;
}

.resend-btn:hover:not(:disabled) {
  border-color: #0865d8;
  background: #dbeaff;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(8, 101, 216, 0.2);
}

.resend-btn:hover:not(:disabled) .action-icon {
  animation: spin-icon 0.8s ease;
}

@keyframes spin-icon {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.resend-btn.cooling {
  border-color: #e2e8f0;
  background: #f7fafc;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.resend-btn.cooling .action-icon {
  color: #b8c6d9;
}

/* TOMBOL GANTI NOMOR */
.change-btn {
  border: 1.5px solid #e0eaf6;
  background: #ffffff;
  color: #0d2051;
}

.change-btn:hover {
  border-color: #4e9cff;
  background: #f8fbff;
  color: #0865d8;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(8, 101, 216, 0.12);
}

.change-btn:hover .action-icon {
  animation: swap-icon 0.5s ease;
}

@keyframes swap-icon {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

/* =========================
   ERROR
========================= */

.form-error {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff4f4;
  border: 1px solid #fde0e0;
  color: #dc2626;
  font-size: 13px;
  line-height: 1.45;
}

.form-error svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

/* =========================
   SUBMIT
========================= */

.login-submit {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a7bf0 0%, #0865d8 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: inherit;
  font-size: 15.5px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.login-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(8, 101, 216, 0.32);
}

.login-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.login-submit svg {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   DIVIDER
========================= */

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  color: #98abc5;
  font-size: 12px;
  font-weight: 500;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5eef8;
}

/* =========================
   QUICK ACTIONS
========================= */

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quick-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 12px;
  border: 1.5px solid #e0eaf6;
  border-radius: 12px;
  background: #f8fbff;
  color: #0d2051;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.quick-btn:hover {
  border-color: #4e9cff;
  background: #ffffff;
  transform: translateY(-1px);
}

.quick-btn.primary {
  border-color: transparent;
  background: #eaf4ff;
  color: #0865d8;
}

.quick-btn.primary:hover {
  background: #dbeaff;
}

.quick-icon {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
}

.quick-icon svg {
  width: 100%;
  height: 100%;
}

/* =========================
   SECURITY
========================= */

.login-security {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eef3fa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8198bd;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
}

.login-security svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #1faa52;
}

/* =========================
   POPUP WELCOME
========================= */

.welcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 35, 80, 0.45);
  backdrop-filter: blur(6px);
  font-family:
    "Poppins",
    "Figtree",
    -apple-system,
    BlinkMacSystemFont,
    Arial,
    sans-serif;
}

.welcome-card {
  position: relative;
  overflow: hidden;
  width: min(420px, 100%);
  padding: 42px 34px 28px;
  text-align: center;
  background:
    radial-gradient(circle at 50% -10%, #dff0ff 0, transparent 60%), #ffffff;
  border-radius: 28px;
  box-shadow: 0 30px 70px rgba(12, 35, 80, 0.3);
}

.welcome-check {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8f8ee;
  animation: bump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.welcome-check svg {
  width: 60px;
  height: 60px;
}

.welcome-check .ring {
  stroke: #1faa52;
  stroke-width: 3;
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: draw 0.7s 0.15s ease forwards;
}

.welcome-check .tick {
  stroke: #1faa52;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.45s 0.7s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes bump {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.welcome-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #188a43;
  font-size: 12.5px;
  font-weight: 650;
}

.welcome-card h3 {
  margin: 14px 0 8px;
  color: #0d2051;
  font-size: 26px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: -0.5px;
  word-break: break-word;
}

.welcome-card h3 span {
  color: #0865d8;
}

.welcome-text {
  margin: 0 auto 18px;
  max-width: 300px;
  color: #6d86ad;
  font-size: 14px;
  line-height: 1.55;
}

.welcome-role {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  margin-bottom: 20px;
  border-radius: 999px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
}

.welcome-role svg {
  width: 18px;
  height: 18px;
}

.welcome-btn {
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a7bf0, #0865d8);
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

.welcome-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(8, 101, 216, 0.32);
}

.welcome-btn svg {
  width: 20px;
  height: 20px;
}

.welcome-progress {
  height: 5px;
  margin-top: 22px;
  overflow: hidden;
  border-radius: 99px;
  background: #e6eef8;
}

.welcome-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4e9cff, #0865d8);
  transform-origin: left;
  animation: fill linear forwards;
}

@keyframes fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.welcome-card small {
  display: block;
  margin-top: 8px;
  color: #91a5c8;
  font-size: 12px;
}

/* =========================
   KONFETI
========================= */

.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti span {
  position: absolute;
  top: 110px;
  left: calc(var(--i) * 6.6%);
  width: 9px;
  height: 14px;
  border-radius: 3px;
  background: #4e9cff;
  opacity: 0;
  animation: burst 1.6s calc(var(--i) * 0.06s + 0.55s) ease-out forwards;
}

.confetti span:nth-child(3n) {
  background: #ffc83d;
}

.confetti span:nth-child(3n + 1) {
  background: #ff6b7a;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.confetti span:nth-child(4n) {
  background: #1faa52;
}

@keyframes burst {
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

/* =========================
   TRANSISI POPUP
========================= */

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.3s ease;
}

.pop-enter-active .welcome-card,
.pop-leave-active .welcome-card {
  transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .welcome-card,
.pop-leave-to .welcome-card {
  transform: scale(0.85) translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  .welcome-check,
  .welcome-check .ring,
  .welcome-check .tick,
  .confetti span,
  .spinner {
    animation-duration: 0.01ms;
    animation-delay: 0s;
  }
}

/* =========================
   LOADING SCREEN
========================= */

.loader-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 50% 30%,
      rgba(120, 190, 255, 0.35) 0 200px,
      transparent 201px
    ),
    linear-gradient(135deg, #eaf4ff 0%, #d7ebff 50%, #eef7ff 100%);
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.loader-logo {
  position: relative;
  width: 130px;
  height: 130px;
  display: grid;
  place-items: center;
}

.loader-logo img {
  max-width: 90px;
  max-height: 90px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 8px 20px rgba(8, 101, 216, 0.25));
  animation: logo-pulse 1.6s ease-in-out infinite;
}

.loader-logo strong {
  color: #0865d8;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
  animation: logo-pulse 1.6s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.9;
  }
}

.loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #0865d8;
  border-right-color: #4e9cff;
  animation: ring-spin 1.1s linear infinite;
}

.loader-ring-2 {
  inset: 10px;
  border-top-color: #4e9cff;
  border-right-color: transparent;
  border-bottom-color: #0865d8;
  animation-duration: 1.6s;
  animation-direction: reverse;
}

@keyframes ring-spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-text {
  margin: 0;
  color: #0865d8;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.loader-bar {
  width: 180px;
  height: 5px;
  border-radius: 99px;
  background: rgba(8, 101, 216, 0.15);
  overflow: hidden;
}

.loader-bar span {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4e9cff, #0865d8);
  transform-origin: left;
  animation: loader-fill 3s ease-in-out forwards;
}

@keyframes loader-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 480px) {
  .login-page {
    padding: 20px 14px;
  }

  .login-card {
    border-radius: 20px;
  }

  .top-nav {
    top: 14px;
    padding: 0 14px;
  }

  .nav-btn {
    height: 36px;
    padding: 0 12px;
    font-size: 12px;
    gap: 6px;
  }

  .nav-btn svg {
    width: 16px;
    height: 16px;
  }

  .hero-title {
    padding: 20px 20px 18px;
  }

  .hero-title h1 {
    font-size: 26px;
  }

  .hero-title p {
    font-size: 12.5px;
  }

  .card-body {
    padding: 22px 20px 22px;
  }

  .body-title h2 {
    font-size: 20px;
  }

  .body-title p {
    font-size: 12.5px;
  }

  .input-wrapper {
    height: 50px;
  }

  .input-wrapper input {
    font-size: 14px;
  }

  .otp-boxes {
    gap: 6px;
  }

  .otp-box {
    height: 52px;
    font-size: 20px;
    border-radius: 10px;
  }

  .login-submit {
    height: 50px;
    font-size: 14.5px;
  }

  .quick-btn {
    height: 44px;
    font-size: 12.5px;
  }

  .welcome-card {
    padding: 34px 22px 22px;
    border-radius: 22px;
  }

  .welcome-card h3 {
    font-size: 22px;
  }

  .welcome-check {
    width: 78px;
    height: 78px;
  }

  .welcome-check svg {
    width: 52px;
    height: 52px;
  }

  .loader-logo {
    width: 110px;
    height: 110px;
  }

  .loader-logo img {
    max-width: 75px;
    max-height: 75px;
  }
}

@media (max-width: 380px) {
  .otp-actions {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .otp-action-btn {
    height: 42px;
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .login-page {
    padding: 14px 10px;
  }

  .top-nav {
    padding: 0 10px;
  }

  .nav-btn {
    height: 34px;
    padding: 0 10px;
    font-size: 11px;
    gap: 5px;
  }

  .nav-btn span {
    display: none;
  }

  .nav-btn svg {
    width: 18px;
    height: 18px;
  }

  .hero-title {
    padding: 18px 16px 16px;
  }

  .hero-title h1 {
    font-size: 22px;
  }

  .hero-title p {
    font-size: 11.5px;
  }

  .card-body {
    padding: 20px 16px 20px;
  }

  .body-title h2 {
    font-size: 18px;
  }

  .body-title p {
    font-size: 12px;
  }

  .input-prefix {
    display: none;
  }

  .input-wrapper input {
    padding-left: 12px;
  }

  .otp-boxes {
    gap: 4px;
  }

  .otp-box {
    height: 44px;
    font-size: 16px;
    border-radius: 8px;
  }

  .quick-btn {
    padding: 0 8px;
    font-size: 11.5px;
    gap: 6px;
  }

  .quick-icon {
    width: 16px;
    height: 16px;
  }
}

@media (min-width: 481px) and (max-width: 820px) {
  .login-card {
    max-width: 440px;
  }
}

@media (min-width: 1400px) {
  .login-card {
    max-width: 440px;
  }
}
</style>
