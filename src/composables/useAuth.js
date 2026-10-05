import { reactive, computed } from "vue";

const STORAGE_KEY = "aruna_auth";

// PROTOTIPE: akun dummy di kode. Ganti dengan panggilan API saat backend siap.
const ADMIN_ACCOUNTS = [
  {
    id: 1,
    name: "Admin ARUNA",
    email: "admin@aruna.id",
    password: "admin123",
    role: "admin",
  },
];

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// State dibuat di luar fungsi supaya dipakai bersama oleh semua komponen
const state = reactive({ user: loadUser() });

export function useAuth() {
  const user = computed(() => state.user);
  const isLoggedIn = computed(() => !!state.user);
  const isAdmin = computed(() => state.user?.role === "admin");

  async function loginAdmin(email, password) {
    // Simulasi waktu tunggu request ke server
    await new Promise((resolve) => setTimeout(resolve, 600));

    const account = ADMIN_ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    );

    if (!account) {
      throw new Error("Email atau kata sandi salah.");
    }

    const { password: _password, ...safeUser } = account;
    state.user = safeUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  }

  function logout() {
    state.user = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user, isLoggedIn, isAdmin, loginAdmin, logout };
}