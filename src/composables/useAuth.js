import { reactive, computed } from "vue";
import { api, getToken, setToken } from "@/services/api";

const STORAGE_KEY = "aruna_auth";

function loadUser() {
  try {
    // Tanpa token berarti sesi lama (sebelum ada backend): anggap belum login
    if (!getToken()) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// State login dibuat bersama agar bisa dipakai semua komponen
const state = reactive({ user: loadUser() });

function simpanSesi(user, token) {
  if (token) setToken(token);
  state.user = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// Foto profil masih disimpan di browser (belum ada upload ke server): jangan sampai hilang
const denganFoto = (u) => (state.user?.photo ? { ...u, photo: state.user.photo } : u);

function hapusSesi() {
  state.user = null;
  setToken(null);
  localStorage.removeItem(STORAGE_KEY);
}

// Token ditolak server (kedaluwarsa / akun diblokir): keluar otomatis
window.addEventListener("aruna:unauthorized", hapusSesi);

export function useAuth() {
  const user = computed(() => state.user);
  const isLoggedIn = computed(() => !!state.user);
  const isAdmin = computed(() => state.user?.role === "admin");
  const isSeller = computed(() => state.user?.role === "penjual");
  const isCustomer = computed(() => state.user?.role === "customer");

  // PENTING: sekarang async. Panggil dengan `await registerUser(...)`.
  // Tidak otomatis login, sama seperti sebelumnya: pengguna lanjut ke halaman login.
  async function registerUser(accountData) {
    const res = await api.post("/auth/register", accountData);
    return res.user;
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    simpanSesi(res.user, res.token);
    return res.user;
  }

  // Tetap disediakan supaya kode lama yang memakai loginAdmin tidak rusak
  async function loginAdmin(email, password) {
    return login(email, password);
  }

  // PENTING: sekarang async. Panggil dengan `await updateUser(...)`.
  async function updateUser(updates) {
    if (!state.user) throw new Error("Tidak ada pengguna yang sedang login.");
    const updated = await api.put("/auth/me", updates);
    const hasil = denganFoto(updated);
    simpanSesi(hasil);
    return hasil;
  }

  // Sinkronkan data user dari server (mis. status UMKM berubah setelah diverifikasi admin)
  async function refreshUser() {
    if (!getToken()) return null;
    const me = await api.get("/auth/me");
    const hasil = denganFoto(me);
    simpanSesi(hasil);
    return hasil;
  }

  function logout() {
    hapusSesi();
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    isSeller,
    isCustomer,
    registerUser,
    login,
    loginAdmin,
    updateUser,
    refreshUser,
    logout,
  };
}
