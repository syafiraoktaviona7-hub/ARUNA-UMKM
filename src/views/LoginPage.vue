<script setup>
import { ref } from "vue";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login: authLogin } = useAuth();

const showRegisterModal = ref(false);

const email = ref("");
const password = ref("");
const showPassword = ref(false);

function kembaliKeBeranda() {
  router.push("/");
}

function keRegister() {
  router.push("/register");
}

async function login() {
  if (!email.value || !password.value) {
    alert("Silakan isi email dan password terlebih dahulu.");
    return;
  }

  try {
    const user = await authLogin(email.value, password.value);

    alert(`Selamat datang, ${user.name}!`);

    // Customer masuk ke dashboard customer
    if (user.role === "customer") {
      router.push("/");
      return;
    }

    // Admin
    if (user.role === "admin") {
      router.push("/admin");
      return;
    }

    // Penjual belum dibuat dashboardnya
    router.push("/");
  } catch (error) {
    alert(error.message);
  }
}
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
              <p>
                Belanja dengan aman dan nyaman.
              </p>
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

          <button
            class="back-button"
            type="button"
            @click="kembaliKeBeranda"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <span class="back-text">
            Kembali ke Beranda
          </span>

         <div class="register-text">
  Belum punya akun?
  <button
    type="button"
    @click="showRegisterModal = true"
  >
    Daftar
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


        <!-- FORM -->
        <form @submit.prevent="login">

          <!-- EMAIL -->
          <div class="form-group">

            <label for="email">
              Alamat Email
            </label>

            <div class="input-wrapper">

              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                fill="none"
              >
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
                placeholder="Masukkan email Anda"
              />

            </div>

          </div>


          <!-- PASSWORD -->
          <div class="form-group password-group">

            <label for="password">
              Password
            </label>

            <div class="input-wrapper">

              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                fill="none"
              >
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
                placeholder="Masukkan password Anda"
              />

              <button
                class="password-toggle"
                type="button"
                @click="showPassword = !showPassword"
                aria-label="Tampilkan password"
              >

                <svg
                  v-if="!showPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                >
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

                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                >
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
            <button
              type="button"
              class="forgot-password"
            >
              Lupa Password?
            </button>
          </div>


          <!-- LOGIN -->
          <button
            type="submit"
            class="login-submit"
          >
            <span>Masuk Sekarang</span>

            <svg viewBox="0 0 24 24" fill="none">
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

          <span>
            Data Anda aman dan terlindungi bersama ARUNA.
          </span>

        </div>

      </div>

    </section>

  </main>

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
    linear-gradient(
      135deg,
      #f1f9ff 0%,
      #dff1ff 50%,
      #edf8ff 100%
    );

  font-family:
    "Poppins",
    "Figtree",
    Arial,
    sans-serif;
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

  box-shadow:
    0 14px 35px rgba(56, 118, 177, 0.12);

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

  box-shadow:
    0 18px 55px rgba(49, 101, 155, 0.13);

  position: relative;
}


/* CARD TOP */

.card-top {
  display: flex;
  align-items: center;
  position: relative;
  min-height: 45px;
}

.back-button {
  width: 48px;
  height: 48px;

  border: none;
  border-radius: 50%;

  background: #f1f5fa;
  color: #58739d;

  display: grid;
  place-items: center;

  cursor: pointer;
}

.back-button svg {
  width: 25px;
  height: 25px;
}

.back-text {
  margin-left: 16px;
  color: #6d84aa;
  font-size: 15px;
  font-weight: 500;
}

.register-text {
  margin-left: auto;
  color: #7c91b4;
  font-size: 14px;
}

.register-text button {
  border: none;
  background: transparent;
  padding: 0;

  color: #0865d8;
  font-size: inherit;
  font-weight: 600;

  cursor: pointer;
  text-decoration: underline;
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

  box-shadow:
    0 10px 25px rgba(8, 101, 216, 0.2);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.login-submit:hover {
  background: #0754b5;
  transform: translateY(-1px);
}

.login-submit svg {
  width: 29px;
  height: 29px;
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

  .card-top {
    align-items: flex-start;
  }

  .back-text {
    font-size: 12px;
  }

  .register-text {
    font-size: 11px;
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
}
</style>