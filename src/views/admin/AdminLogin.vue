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
          <div class="win">
            <div class="win-head"><i></i><i></i><i></i></div>
            <div class="win-stats">
              <div><span>UMKM aktif</span><strong>128</strong></div>
              <div><span>Produk</span><strong>842</strong></div>
            </div>
            <svg viewBox="0 0 220 70" preserveAspectRatio="none">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0865d8" stop-opacity=".3" /><stop offset="1" stop-color="#0865d8" stop-opacity="0" /></linearGradient></defs>
              <polygon points="0,70 0,52 37,44 73,48 110,28 147,34 183,12 220,18 220,70" fill="url(#lg)" />
              <polyline points="0,52 37,44 73,48 110,28 147,34 183,12 220,18" fill="none" stroke="#0865d8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            </svg>
          </div>
          <div class="float f1"><span class="ok">✓</span><div><b>Kopi Arjuna disetujui</b><small>baru saja</small></div></div>
          <div class="float f2"><span class="wait">6</span><div><b>Menunggu verifikasi</b><small>perlu diperiksa</small></div></div>
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

/* Pratinjau dashboard */
.stack {
  position: relative;
  height: 290px;
  margin-top: 34px;
}

.win {
  position: absolute;
  top: 0;
  left: 0;
  width: min(300px, 80%);
  padding: 14px 16px 10px;
  color: var(--ink);
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 44px rgba(7, 40, 90, 0.35);
}

.win-head {
  display: flex;
  gap: 5px;
  margin-bottom: 12px;
}

.win-head i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--line);
}

.win-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
}

.win-stats span {
  display: block;
  font-size: 0.75rem;
  color: var(--muted);
}

.win-stats strong {
  font-size: 1.5rem;
  font-weight: 600;
}

.win svg {
  display: block;
  width: 100%;
  height: 70px;
}

.float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: var(--ink);
  background: var(--white);
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(7, 40, 90, 0.3);
}

.float b {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
}

.float small {
  font-size: 0.75rem;
  color: var(--muted);
}

.float span {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  font-weight: 600;
  border-radius: 10px;
}

.float .ok {
  color: #17794a;
  background: #e3f6ec;
}

.float .wait {
  color: #9a6200;
  background: #fff3dc;
}

.f1 {
  top: 110px;
  left: 150px;
}

.f2 {
  top: 188px;
  left: 20px;
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
  background:
    radial-gradient(circle at 90% 8%, rgba(8, 101, 216, 0.1), transparent 38%),
    radial-gradient(circle at 8% 95%, rgba(8, 101, 216, 0.08), transparent 40%),
    var(--bg);
}

.card {
  width: 100%;
  max-width: 420px;
  padding: 36px 34px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(20, 45, 78, 0.08);
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