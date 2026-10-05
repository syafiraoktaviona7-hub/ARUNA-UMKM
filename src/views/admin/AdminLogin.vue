<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { loginAdmin } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

async function handleSubmit() {
  error.value = "";

  if (!email.value.trim() || !password.value) {
    error.value = "Isi email dan kata sandi terlebih dahulu.";
    return;
  }

  loading.value = true;
  try {
    await loginAdmin(email.value, password.value);

    // Hanya terima redirect ke halaman admin agar tidak jadi open redirect
    const target = String(route.query.redirect || "");
    router.replace(target.startsWith("/admin") ? target : "/admin");
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="login">
    <aside class="brand">
      <div class="brand-top">
        <span class="mark">A</span>
        <span class="logo">ARUNA</span>
        <span class="logo-sub">Panel Admin</span>
      </div>

      <div class="brand-body">
        <h2>Semua UMKM terdaftar, terpantau rapi.</h2>
        <p class="lead">
          Periksa pendaftaran, atur produk, dan tindak laporan customer dari
          satu panel.
        </p>

        <div class="stack" aria-hidden="true">
          <div class="mini mini-a">
            <span>UMKM aktif</span>
            <strong>128</strong>
          </div>
          <div class="mini mini-b">
            <span>Menunggu verifikasi</span>
            <strong>6</strong>
          </div>
          <div class="mini mini-c">
            <span>Produk tampil</span>
            <strong>842</strong>
          </div>
        </div>
      </div>

      <div class="glow" aria-hidden="true"></div>
    </aside>

    <section class="panel">
      <div class="card">
        <header>
          <h1>Masuk sebagai admin</h1>
          <p>Halaman ini khusus pengelola ARUNA.</p>
        </header>

        <form novalidate @submit.prevent="handleSubmit">
          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="username"
              placeholder="admin@aruna.id"
              :disabled="loading"
            />
          </div>

          <div class="field">
            <label for="password">Kata sandi</label>
            <div class="password-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan kata sandi"
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Sembunyikan" : "Tampilkan" }}
              </button>
            </div>
          </div>

          <p v-if="error" class="error" role="alert">{{ error }}</p>

          <button type="submit" class="submit" :disabled="loading">
            {{ loading ? "Memeriksa..." : "Masuk" }}
          </button>
        </form>

        <p class="demo">
          Akun demo prototipe: <strong>admin@aruna.id</strong> /
          <strong>admin123</strong>
        </p>

        <RouterLink to="/" class="back">Kembali ke beranda</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Memakai variabel dan font dari :root global (--blue, --ink, dst.) */
.login {
  --danger: #b3261e;

  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(320px, 5fr) 6fr;
  background: var(--bg);
  color: var(--ink);
}

/* Panel kiri */
.brand {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 48px;
  background: linear-gradient(160deg, var(--blue), var(--blue-dark));
  color: var(--white);
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  font-weight: 700;
  color: var(--blue);
  background: var(--white);
  border-radius: 10px;
}

.logo {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.logo-sub {
  font-size: 0.9rem;
  opacity: 0.75;
}

.brand-body {
  position: relative;
  z-index: 1;
}

.brand-body h2 {
  max-width: 380px;
  margin-bottom: 14px;
  font-size: 2rem;
  line-height: 1.25;
  font-weight: 600;
}

.lead {
  max-width: 380px;
  opacity: 0.85;
}

/* Kartu ringkasan sebagai pratinjau isi dashboard */
.stack {
  position: relative;
  height: 210px;
  margin-top: 36px;
}

.mini {
  position: absolute;
  display: grid;
  gap: 2px;
  min-width: 170px;
  padding: 14px 18px;
  color: var(--ink);
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: 0 14px 34px rgba(7, 40, 90, 0.28);
}

.mini span {
  font-size: 0.8rem;
  color: var(--muted);
}

.mini strong {
  font-size: 1.7rem;
  font-weight: 600;
}

.mini-a {
  top: 0;
  left: 0;
}

.mini-b {
  top: 56px;
  left: 120px;
  border-left: 4px solid #f5a524;
}

.mini-c {
  top: 124px;
  left: 30px;
}

/* Cahaya fajar (aruna) dari bawah panel */
.glow {
  position: absolute;
  left: 50%;
  bottom: -260px;
  width: 620px;
  height: 620px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.32) 0%,
    rgba(255, 255, 255, 0.1) 42%,
    rgba(255, 255, 255, 0) 70%
  );
}

/* Panel kanan */
.panel {
  display: grid;
  place-items: center;
  padding: 32px 24px;
}

.card {
  width: 100%;
  max-width: 400px;
}

header h1 {
  margin-bottom: 6px;
  font-size: 1.6rem;
  font-weight: 600;
}

header p {
  margin-bottom: 28px;
  color: var(--muted);
}

.field {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 14px;
  color: var(--ink);
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

input::placeholder {
  color: #9db0c6;
}

input:focus-visible {
  border-color: var(--blue);
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 112px;
}

.toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 10px;
  font-size: 0.85rem;
  color: var(--blue);
  background: transparent;
  border: 0;
  border-radius: 8px;
}

.error {
  margin-bottom: 16px;
  padding: 10px 12px;
  font-size: 0.9rem;
  color: var(--danger);
  background: #fdecea;
  border-radius: 8px;
}

.submit {
  width: 100%;
  padding: 13px;
  font-weight: 600;
  color: var(--white);
  background: var(--blue);
  border: 0;
  border-radius: var(--radius);
  transition: background 0.15s;
}

.submit:hover:not(:disabled) {
  background: var(--blue-dark);
}

.submit:disabled {
  opacity: 0.65;
  cursor: wait;
}

.demo {
  margin-top: 20px;
  padding: 10px 12px;
  font-size: 0.85rem;
  color: var(--muted);
  background: var(--white);
  border: 1px dashed var(--line);
  border-radius: 8px;
}

.back {
  display: inline-block;
  margin-top: 20px;
  font-size: 0.9rem;
  color: var(--blue);
}

@media (max-width: 820px) {
  .login {
    grid-template-columns: 1fr;
  }

  .brand {
    padding: 24px;
    gap: 16px;
  }

  .brand-body,
  .glow {
    display: none;
  }
}
</style>