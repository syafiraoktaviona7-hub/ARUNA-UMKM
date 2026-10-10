<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login: authLogin } = useAuth();

const showRegisterModal = ref(false);

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");

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

function kembaliKeBeranda() {
  router.push("/");
}

function lanjut() {
  clearTimeout(redirectTimer);
  welcome.value.show = false;
  router.push(welcome.value.target);
}

function clearError() {
  errorMsg.value = "";
}

async function login() {
  if (isLoading.value) return;

  if (!email.value || !password.value) {
    errorMsg.value = "Silakan isi email dan password terlebih dahulu.";
    return;
  }

  errorMsg.value = "";
  isLoading.value = true;

  try {
    const user = await authLogin(email.value, password.value);

    let target = "/";
    if (user.role === "admin") target = "/admin";

    welcome.value = {
      show: true,
      name: user.name || "Pengguna",
      role: user.role,
      target,
    };

    redirectTimer = setTimeout(lanjut, REDIRECT_MS);
  } catch (error) {
    errorMsg.value = error?.message || "Login gagal. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
}

onBeforeUnmount(() => clearTimeout(redirectTimer));
</script>

<template>
  <main class="login-page">
    <!-- =========================
         BAGIAN KIRI
    ========================== -->
    <section class="login-left">
      <div class="left-content">
        <h1>
          Selamat Datang
          <br />
          di <span>ARUNA</span>
        </h1>

        <p class="left-description">
          Masuk ke akun Anda dan lanjutkan
          <br />
          perjalanan mendukung UMKM Indonesia.
          <br />
          Temukan produk lokal berkualitas dan
          <br />
          berbagai peluang usaha dalam satu platform.
        </p>

        <!-- GAMBAR CUSTOMER -->
        <div class="character-wrapper">
          <img
            src="/images/login-customer.png"
            alt="Customer ARUNA"
            class="character-image"
          />
        </div>

        <!-- KEUNGGULAN -->
        <div class="benefit-card">
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8.5V7a6 6 0 0 1 12 0v1.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M5 8.5h14v10H5z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3>Beragam Produk UMKM</h3>
              <p>
                Dari makanan, fashion, hingga kerajinan
                <br />
                tangan lokal.
              </p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none">
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
            </div>

            <div>
              <h3>Transaksi Aman</h3>
              <p>Belanja dengan aman dan nyaman.</p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon heart">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 21s-7.2-4.7-9.5-9C.7 8.5 2.4 5 6.1 5c2.1 0 3.5 1.2 4.3 2.5C11.2 6.2 12.7 5 14.8 5c3.7 0 5.4 3.5 3.6 7-2.3 4.3-9.4 9-9.4 9z"
                />
              </svg>
            </div>

            <div>
              <h3>Dukung UMKM Indonesia</h3>
              <p>
                Setiap transaksi membantu pertumbuhan
                <br />
                pelaku usaha lokal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =========================
         BAGIAN KANAN
    ========================== -->
    <section class="login-right">
      <div class="login-card">
        <!-- HEADER CARD -->
        <div class="card-top">
          <button class="back-pill" type="button" @click="kembaliKeBeranda">
            <span class="back-ic">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <svg
              class="home-ic"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 11 12 4l8.5 7"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 10v9.5h13V10"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linejoin="round"
              />
              <path
                d="M10 19.5v-5h4v5"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linejoin="round"
              />
            </svg>
            <span class="back-label">Kembali ke Beranda</span>
          </button>

          <div class="register-box">
            <span class="register-q">Belum punya akun?</span>
            <button
              class="register-pill"
              type="button"
              @click="showRegisterModal = true"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="9.5"
                  cy="8"
                  r="3.6"
                  stroke="currentColor"
                  stroke-width="1.9"
                />
                <path
                  d="M2.8 20c.5-3.6 3.2-5.6 6.7-5.6 2 0 3.7.6 4.9 1.8"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                />
                <path
                  d="M18 13v6M15 16h6"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                />
              </svg>
              <span>Daftar</span>
            </button>
          </div>
        </div>

        <!-- JUDUL -->
        <div class="login-header">
          <h2>
            Masuk ke Akun
            <span>ARUNA</span>
          </h2>

          <p>
            Masukkan email dan password Anda untuk melanjutkan
            <br />
            ke platform ARUNA.
          </p>
        </div>

        <!-- PESAN ERROR -->
        <Transition name="fade">
          <div v-if="errorMsg" class="error-box" role="alert">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="1.9"
              />
              <path
                d="M12 7.5v5.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle cx="12" cy="16.4" r="1.1" fill="currentColor" />
            </svg>
            <span>{{ errorMsg }}</span>
          </div>
        </Transition>

        <!-- FORM -->
        <form @submit.prevent="login">
          <!-- EMAIL -->
          <div class="form-group">
            <label for="email"> Alamat Email </label>

            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
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
                  d="m3 7 9 6 9-6"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
              </svg>

              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Masukkan email Anda"
                :disabled="isLoading"
                @input="clearError"
              />
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="form-group password-group">
            <label for="password"> Password </label>

            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
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
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>

              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan password Anda"
                :disabled="isLoading"
                @input="clearError"
              />

              <button
                class="password-toggle"
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                "
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
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

                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.7"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.1 8.1C3.8 9.8 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.1-.2 3-.6"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- LUPA PASSWORD -->
          <div class="forgot-wrapper">
            <button type="button" class="forgot-password">
              Lupa Password?
            </button>
          </div>

          <!-- LOGIN -->
          <button type="submit" class="login-submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
            <span>{{ isLoading ? "Memproses..." : "Masuk Sekarang" }}</span>

            <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
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

        <!-- FOOTER -->
        <div class="login-security">
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
              d="M8 10V7a4 4 0 0 1 8 0v3"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>

          <span> Data Anda aman dan terlindungi bersama ARUNA. </span>
        </div>
      </div>
    </section>
  </main>

  <!-- =========================
       POPUP SELAMAT DATANG
  ========================== -->
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
        <!-- konfeti -->
        <div class="confetti" aria-hidden="true">
          <span v-for="n in 14" :key="n" :style="{ '--i': n }"></span>
        </div>

        <!-- centang animasi -->
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

.login-page {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 45% 55%;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 12% 5%,
      rgba(155, 205, 255, 0.55) 0 90px,
      transparent 91px
    ),
    radial-gradient(
      circle at 91% 7%,
      rgba(168, 213, 255, 0.45) 0 150px,
      transparent 151px
    ),
    linear-gradient(135deg, #f1f9ff 0%, #dff1ff 50%, #edf8ff 100%);

  font-family: "Poppins", "Figtree", Arial, sans-serif;
}

/* =========================
   LEFT
========================= */

.login-left {
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 65px 40px 30px;
  overflow: hidden;
}

.login-left::before {
  content: "";
  position: absolute;
  width: 360px;
  height: 360px;
  left: -220px;
  top: 310px;
  border-radius: 50%;
  background: rgba(132, 194, 255, 0.25);
}

.login-left::after {
  content: "";
  position: absolute;
  width: 290px;
  height: 290px;
  right: -170px;
  bottom: 60px;
  border-radius: 50%;
  background: rgba(132, 194, 255, 0.22);
}

.left-content {
  width: 100%;
  max-width: 560px;
  position: relative;
  z-index: 2;
}

.left-content h1 {
  margin: 20px 0 10px;
  color: #0c2350;
  font-size: clamp(40px, 4vw, 58px);
  line-height: 1.12;
  font-weight: 750;
  letter-spacing: -1.5px;
}

.left-content h1 span {
  color: #0865d8;
}

.left-description {
  margin: 0;
  color: #55729f;
  font-size: 19px;
  line-height: 1.4;
  font-weight: 450;
}

/* CHARACTER */

.character-wrapper {
  position: relative;
  width: 560px;
  height: 390px;
  margin-top: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

/* BENEFIT CARD */

.benefit-card {
  position: relative;
  width: 535px;
  margin: -8px auto 0;
  padding: 19px 30px;

  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 25px;

  box-shadow: 0 14px 35px rgba(56, 118, 177, 0.12);

  backdrop-filter: blur(10px);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 70px;
}

.benefit-icon {
  flex: 0 0 58px;
  width: 58px;
  height: 58px;

  display: grid;
  place-items: center;

  background: #e1efff;
  color: #0865d8;
  border-radius: 50%;
}

.benefit-icon svg {
  width: 28px;
  height: 28px;
}

.benefit-icon.heart {
  color: #ff5060;
}

.benefit-item h3 {
  margin: 0 0 3px;
  color: #112a56;
  font-size: 16px;
  font-weight: 700;
}

.benefit-item p {
  margin: 0;
  color: #6d86ad;
  font-size: 12px;
  line-height: 1.4;
}

/* =========================
   RIGHT
========================= */

.login-right {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 50px;
}

.login-card {
  width: min(760px, 100%);
  min-height: 850px;
  padding: 40px 68px 42px;

  background: rgba(255, 255, 255, 0.96);
  border-radius: 30px;

  box-shadow: 0 18px 55px rgba(49, 101, 155, 0.13);

  position: relative;
}

/* CARD TOP */

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 48px;
}

/* tombol kembali (pil) */
.back-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  height: 48px;
  padding: 0 20px 0 6px;

  border: 1.5px solid #dce8f6;
  border-radius: 999px;

  background: #f5f9ff;
  color: #4d6a98;

  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.back-ic {
  width: 36px;
  height: 36px;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #fff;
  color: #0865d8;

  box-shadow: 0 3px 9px rgba(8, 101, 216, 0.14);

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.back-ic svg {
  width: 20px;
  height: 20px;
}

.home-ic {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
}

.back-pill:hover {
  background: #eaf4ff;
  border-color: #b9d7fb;
  color: #0865d8;
  box-shadow: 0 6px 16px rgba(8, 101, 216, 0.1);
}

.back-pill:hover .back-ic {
  transform: translateX(-3px);
  background: #0865d8;
  color: #fff;
}

/* kotak daftar */
.register-box {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.register-q {
  color: #7c91b4;
  font-size: 14px;
}

.register-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  height: 44px;
  padding: 0 20px;

  border: none;
  border-radius: 999px;

  background: linear-gradient(135deg, #1a7bf0, #0865d8);
  color: #fff;

  font-family: inherit;
  font-size: 14.5px;
  font-weight: 650;

  cursor: pointer;

  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.24);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.register-pill svg {
  width: 21px;
  height: 21px;
}

.register-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(8, 101, 216, 0.3);
}

.back-pill:focus-visible,
.register-pill:focus-visible,
.welcome-btn:focus-visible {
  outline: 3px solid rgba(8, 101, 216, 0.35);
  outline-offset: 2px;
}

/* HEADER */

.login-header {
  margin-top: 48px;
}

.login-header h2 {
  margin: 0;
  color: #0d2051;
  font-size: 42px;
  line-height: 1.15;
  font-weight: 750;
  letter-spacing: -1px;
}

.login-header h2 span {
  color: #0865d8;
}

.login-header p {
  margin: 12px 0 35px;
  color: #91a5c8;
  font-size: 17px;
  line-height: 1.45;
}

/* ERROR */

.error-box {
  display: flex;
  align-items: center;
  gap: 12px;

  margin: -12px 0 24px;
  padding: 14px 18px;

  border: 1px solid #ffd0d4;
  border-radius: 14px;

  background: #fff2f3;
  color: #c7323f;

  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.4;
}

.error-box svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

/* FORM */

.form-group {
  margin-bottom: 27px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;

  color: #102652;
  font-size: 16px;
  font-weight: 650;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  height: 64px;

  padding: 0 58px 0 70px;

  border: 1.5px solid #dce8f6;
  border-radius: 14px;

  background: #fff;

  color: #182e59;
  font-family: inherit;
  font-size: 16px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper input:disabled {
  background: #f6f9fd;
  cursor: not-allowed;
}

.input-wrapper input::placeholder {
  color: #a5b1c5;
}

.input-wrapper input:focus {
  border-color: #4e9cff;
  box-shadow: 0 0 0 4px rgba(8, 101, 216, 0.07);
}

.input-icon {
  position: absolute;
  left: 23px;
  top: 50%;
  transform: translateY(-50%);

  width: 26px;
  height: 26px;

  color: #7792bb;
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);

  width: 35px;
  height: 35px;

  border: none;
  background: transparent;

  color: #91a3bf;

  display: grid;
  place-items: center;

  cursor: pointer;
}

.password-toggle svg {
  width: 23px;
  height: 23px;
}

/* FORGOT */

.forgot-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: -14px;
  margin-bottom: 30px;
}

.forgot-password {
  border: none;
  background: transparent;
  padding: 0;

  color: #0865d8;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;
  text-decoration: underline;
}

/* LOGIN BUTTON */

.login-submit {
  width: 100%;
  height: 72px;

  border: none;
  border-radius: 14px;

  background: #0865d8;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;

  font-family: inherit;
  font-size: 20px;
  font-weight: 650;

  cursor: pointer;

  box-shadow: 0 10px 25px rgba(8, 101, 216, 0.2);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.login-submit:hover:not(:disabled) {
  background: #0754b5;
  transform: translateY(-1px);
}

.login-submit:disabled {
  opacity: 0.8;
  cursor: wait;
}

.login-submit svg {
  width: 29px;
  height: 29px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* SECURITY */

.login-security {
  margin-top: 105px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #8198bd;
  font-size: 15px;
}

.login-security svg {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
}

/* =========================
   POPUP SELAMAT DATANG
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

  font-family: "Poppins", "Figtree", Arial, sans-serif;
}

.welcome-card {
  position: relative;
  overflow: hidden;

  width: min(440px, 100%);
  padding: 44px 36px 30px;

  text-align: center;

  background:
    radial-gradient(circle at 50% -10%, #dff0ff 0, transparent 60%), #fff;
  border-radius: 30px;

  box-shadow: 0 30px 70px rgba(12, 35, 80, 0.3);
}

.welcome-check {
  width: 92px;
  height: 92px;
  margin: 0 auto 18px;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #e8f8ee;

  animation: bump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.welcome-check svg {
  width: 64px;
  height: 64px;
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
  font-size: 28px;
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
  max-width: 320px;

  color: #6d86ad;
  font-size: 14.5px;
  line-height: 1.55;
}

.welcome-role {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 9px 16px;
  margin-bottom: 22px;

  border-radius: 999px;
  background: #eaf4ff;
  color: #0865d8;

  font-size: 13.5px;
  font-weight: 600;
}

.welcome-role svg {
  width: 20px;
  height: 20px;
}

.welcome-btn {
  width: 100%;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  border: none;
  border-radius: 14px;

  background: linear-gradient(135deg, #1a7bf0, #0865d8);
  color: #fff;

  font-family: inherit;
  font-size: 16px;
  font-weight: 650;

  cursor: pointer;

  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.25);

  transition: transform 0.2s ease;
}

.welcome-btn:hover {
  transform: translateY(-2px);
}

.welcome-btn svg {
  width: 22px;
  height: 22px;
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

/* konfeti */
.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti span {
  position: absolute;
  top: 118px;
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

/* TRANSISI */

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

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
   RESPONSIVE
========================= */

@media (max-width: 1250px) {
  .login-page {
    grid-template-columns: 43% 57%;
  }

  .login-left {
    padding-left: 35px;
    padding-right: 25px;
  }

  .character-wrapper {
    width: 100%;
    height: 340px;
  }

  .benefit-card {
    width: 100%;
  }

  .login-right {
    padding: 25px 30px;
  }

  .login-card {
    padding-left: 50px;
    padding-right: 50px;
  }
}

@media (max-width: 950px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-left {
    min-height: auto;
    padding: 50px 30px 30px;
  }

  .left-content {
    max-width: 700px;
  }

  .character-wrapper {
    height: 360px;
  }

  .benefit-card {
    margin-top: 0;
  }

  .login-right {
    min-height: auto;
    padding: 20px 30px 50px;
  }

  .login-card {
    min-height: auto;
  }

  .login-security {
    margin-top: 70px;
  }
}

@media (max-width: 600px) {
  .login-left {
    padding: 35px 20px 25px;
  }

  .left-content h1 {
    font-size: 38px;
  }

  .left-description {
    font-size: 15px;
  }

  .character-wrapper {
    height: 280px;
  }

  .benefit-card {
    padding: 15px;
    border-radius: 20px;
  }

  .benefit-item {
    gap: 12px;
  }

  .benefit-icon {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }

  .benefit-item h3 {
    font-size: 14px;
  }

  .benefit-item p {
    font-size: 10px;
  }

  .login-right {
    padding: 10px 15px 35px;
  }

  .login-card {
    padding: 25px 22px 30px;
    border-radius: 22px;
  }

  .back-pill {
    height: 42px;
    gap: 8px;
    padding-right: 14px;
    font-size: 12.5px;
  }

  .back-ic {
    width: 30px;
    height: 30px;
  }

  .home-ic {
    width: 18px;
    height: 18px;
  }

  .register-q {
    display: none;
  }

  .register-pill {
    height: 40px;
    padding: 0 16px;
    font-size: 13px;
  }

  .login-header {
    margin-top: 35px;
  }

  .login-header h2 {
    font-size: 30px;
  }

  .login-header p {
    font-size: 13px;
  }

  .input-wrapper input {
    height: 58px;
    font-size: 14px;
  }

  .login-submit {
    height: 62px;
    font-size: 17px;
  }

  .login-security {
    font-size: 12px;
    margin-top: 60px;
  }

  .welcome-card {
    padding: 36px 22px 24px;
    border-radius: 24px;
  }

  .welcome-card h3 {
    font-size: 23px;
  }
}
</style>
