<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

// Ganti gambar latar panel kiri: taruh file di public/images/ lalu ubah nama di sini
const bgImage = "/images/aruna-hero.png";

const route = useRoute();
const router = useRouter();
const { loginAdmin, logout } = useAuth();

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
    const akun = await loginAdmin(email.value, password.value);
    if (akun.role !== "admin") {
      logout();
      throw new Error("Akun ini bukan akun admin.");
    }

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
    <aside class="hero" :style="{ '--bg-img': `url(${bgImage})` }">
      <span class="tag">Panel Admin</span>
      <div class="copy">
        <h2>Semua UMKM terdaftar, terpantau rapi.</h2>
        <p>Periksa pendaftaran, atur produk, dan tindak laporan customer dari satu panel.</p>
      </div>
    </aside>

    <section class="panel">
      <div class="card">
        <RouterLink to="/" class="logo-link" aria-label="Kembali ke beranda ARUNA">
          <img src="/images/aruna-logo.png" alt="Logo ARUNA" />
        </RouterLink>

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

        <RouterLink to="/" class="back">Kembali ke beranda</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login {
  --danger: #b3261e;

  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  background: var(--bg);
  color: var(--ink);
}

/* Panel kiri: gambar bebas + lapisan biru. Kalau gambar tidak ada, tampil gradasi biru. */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px 44px 48px;
  color: var(--white);
  background-color: var(--blue-dark);
  background-image:
    linear-gradient(180deg, rgba(7, 40, 90, 0.2) 0%, rgba(7, 40, 90, 0.88) 100%),
    var(--bg-img),
    linear-gradient(160deg, var(--blue), var(--blue-dark));
  background-size: cover;
  background-position: center;
}

.tag {
  width: fit-content;
  padding: 7px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

.copy {
  max-width: 440px;
}

.copy h2 {
  margin-bottom: 12px;
  font-size: 2.1rem;
  line-height: 1.2;
  font-weight: 600;
}

.copy p {
  opacity: 0.88;
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

.logo-link {
  display: inline-block;
  margin-bottom: 22px;
}

.logo-link img {
  display: block;
  width: auto;
  height: 54px;
  max-width: 220px;
  object-fit: contain;
}

header h1 {
  margin-bottom: 6px;
  font-size: 1.6rem;
  font-weight: 600;
}

header p {
  margin-bottom: 26px;
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
  background: var(--bg);
  border: 1px dashed var(--line);
  border-radius: 8px;
}

.back {
  display: inline-block;
  margin-top: 18px;
  font-size: 0.9rem;
  color: var(--blue);
}

@media (max-width: 1100px) {
  .hero {
    padding: 28px;
  }

  .copy h2 {
    font-size: 1.7rem;
  }
}

/* Tablet dan HP: gambar jadi banner di atas, form langsung di bawahnya */
@media (max-width: 820px) {
  .login {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }

  .hero {
    min-height: 170px;
    padding: 20px;
  }

  .copy p {
    display: none;
  }

  .copy h2 {
    font-size: 1.25rem;
  }

  .panel {
    align-items: start;
    padding: 20px 16px 32px;
  }

  .card {
    padding: 28px 22px;
  }

  .logo-link img {
    height: 48px;
  }
}
</style>