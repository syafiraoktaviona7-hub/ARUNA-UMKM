<script setup>
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { requestOtp, verifyOtp } = useAuth();

const inputPhone = ref("");
const canonicalPhone = ref("");
const step = ref("phone"); // "phone" | "otp"
const loading = ref(false);
const error = ref("");

// OTP 6 kotak
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
    nextTick(() => otpRefs.value[Math.min(idx + digits.length, 5)]?.focus());
    return;
  }
  otpDigits.value[idx] = raw;
  if (raw && idx < 5) nextTick(() => otpRefs.value[idx + 1]?.focus());
}

function onOtpKeydown(e, idx) {
  if (e.key === "Backspace") {
    if (otpDigits.value[idx]) otpDigits.value[idx] = "";
    else if (idx > 0) {
      otpDigits.value[idx - 1] = "";
      nextTick(() => otpRefs.value[idx - 1]?.focus());
    }
    e.preventDefault();
  }
  if (e.key === "ArrowLeft" && idx > 0)
    nextTick(() => otpRefs.value[idx - 1]?.focus());
  if (e.key === "ArrowRight" && idx < 5)
    nextTick(() => otpRefs.value[idx + 1]?.focus());
}

function onOtpPaste(e) {
  const text = (e.clipboardData || window.clipboardData).getData("text");
  const digits = text.replace(/\D/g, "").slice(0, 6).split("");
  if (!digits.length) return;
  e.preventDefault();
  otpDigits.value = ["", "", "", "", "", ""];
  digits.forEach((d, i) => (otpDigits.value[i] = d));
  nextTick(() => otpRefs.value[Math.min(digits.length, 5)]?.focus());
}

// Cooldown
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
    const res = await requestOtp(inputPhone.value, "register");
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
    await requestOtp(canonicalPhone.value, "register");
    startCooldown();
    otpDigits.value = ["", "", "", "", "", ""];
    nextTick(() => otpRefs.value[0]?.focus());
  } catch (e) {
    error.value = e.message || "Gagal mengirim ulang OTP.";
  } finally {
    loading.value = false;
  }
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
    await verifyOtp(canonicalPhone.value, code, "register");

    // Sukses → arahkan ke biodata customer dengan nomor HP yang sudah terverifikasi
    router.push({
      name: "customer-register",
      query: { phone: canonicalPhone.value, verified: "1" },
    });
  } catch (e) {
    error.value = e.message || "Kode OTP salah.";
    otpDigits.value = ["", "", "", "", "", ""];
    nextTick(() => otpRefs.value[0]?.focus());
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<template>
  <main class="verify-page">
    <div class="verify-card">
      <!-- HEADER -->
      <header class="card-header">
        <div class="hero-image">
          <img src="/images/OTP.png" alt="Verifikasi Nomor" />
        </div>
        <div class="hero-overlay"></div>

        <nav class="top-nav">
          <button class="nav-btn back-btn" @click="kembaliKeBeranda">
            <svg viewBox="0 0 24 24" fill="none">
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
          <button class="nav-btn register-btn" @click="router.push('/login')">
            <svg viewBox="0 0 24 24" fill="none">
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
            <span>Masuk</span>
          </button>
        </nav>

        <div class="hero-title">
          <h1>Daftar Customer</h1>
          <p>Verifikasi nomor WhatsApp Anda dulu</p>
        </div>
      </header>

      <!-- BODY -->
      <section class="card-body">
        <div class="body-title">
          <h2>Verifikasi Nomor <span>WhatsApp</span></h2>
          <p v-if="step === 'phone'">
            Masukkan nomor WhatsApp aktif Anda. Kami akan mengirim kode OTP
            untuk verifikasi.
          </p>
          <p v-else>
            Kode OTP dikirim ke <strong>{{ canonicalPhone }}</strong
            >. Masukkan 6 digit kode.
          </p>
        </div>

        <form
          class="otp-form"
          @submit.prevent="step === 'phone' ? kirimOtp() : verifikasi()"
        >
          <!-- STEP PHONE -->
          <template v-if="step === 'phone'">
            <div class="form-group">
              <label for="phone">Nomor WhatsApp</label>
              <div class="input-wrapper">
                <span class="input-icon">
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

          <!-- STEP OTP -->
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
              <button
                type="button"
                class="otp-action-btn resend-btn"
                :class="{ cooling: !canResend }"
                :disabled="!canResend || loading"
                @click="kirimUlang"
              >
                <span class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 12a9 9 0 1 1-3-6.7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M21 4v5h-5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <span class="action-text">
                  <template v-if="canResend">Kirim ulang</template>
                  <template v-else
                    >Ulangi dalam <b>{{ cooldown }}s</b></template
                  >
                </span>
              </button>

              <button
                type="button"
                class="otp-action-btn change-btn"
                @click="gantiNomor"
              >
                <span class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none">
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

          <p v-if="error" class="form-error">
            <svg viewBox="0 0 24 24" fill="none">
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

          <button type="submit" class="login-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-if="step === 'phone'">{{
              loading ? "Mengirim..." : "Kirim OTP"
            }}</span>
            <span v-else>{{
              loading ? "Memverifikasi..." : "Verifikasi & Lanjutkan"
            }}</span>
            <svg v-if="!loading" viewBox="0 0 24 24" fill="none">
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
      </section>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.verify-page {
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

.verify-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(12, 35, 80, 0.18),
    0 10px 24px rgba(12, 35, 80, 0.1);
}

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
  box-shadow: 0 6px 16px rgba(12, 35, 80, 0.25);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.nav-btn svg {
  width: 18px;
  height: 18px;
}
.back-btn {
  background: #ffffff;
  color: #0d2051;
}
.back-btn:hover {
  background: #f1f7ff;
  transform: translateY(-2px);
}
.register-btn {
  background: #0865d8;
  color: #ffffff;
}
.register-btn:hover {
  background: #0754b5;
  transform: translateY(-2px);
}

.hero-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 24px;
  color: #ffffff;
}

.hero-title h1 {
  margin: 0 0 6px;
  font-size: 30px;
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

.card-body {
  padding: 26px 26px 24px;
}

.body-title {
  margin-bottom: 22px;
}
.body-title h2 {
  margin: 0 0 8px;
  color: #0d2051;
  font-size: 22px;
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
    box-shadow 0.2s ease;
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
}
.input-wrapper input::placeholder {
  color: #a5b6cf;
}

.otp-boxes {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.otp-box {
  width: 100%;
  height: 58px;
  padding: 0;
  border: 1.5px solid #dbe6f3;
  border-radius: 12px;
  background: #f8fbff;
  color: #0d2051;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
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

.otp-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0 0 18px;
}

.otp-action-btn {
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
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
}
.action-icon svg {
  width: 100%;
  height: 100%;
}

.resend-btn {
  border: 1.5px solid #cfe2f7;
  background: #eff6ff;
  color: #0865d8;
}
.resend-btn:hover:not(:disabled) {
  border-color: #0865d8;
  background: #dbeaff;
  transform: translateY(-1px);
}
.resend-btn.cooling {
  border-color: #e2e8f0;
  background: #f7fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

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
}

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
}
.form-error svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

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
  transition: all 0.2s ease;
}
.login-submit:hover:not(:disabled) {
  transform: translateY(-1px);
}
.login-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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

@media (max-width: 480px) {
  .verify-page {
    padding: 20px 14px;
  }
  .verify-card {
    border-radius: 20px;
  }
  .card-body {
    padding: 22px 20px;
  }
  .body-title h2 {
    font-size: 20px;
  }
  .otp-box {
    height: 52px;
    font-size: 20px;
  }
  .otp-actions {
    grid-template-columns: 1fr;
  }
}
</style>
