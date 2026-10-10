import { reactive, computed } from "vue";
import { api, otp, getToken, setToken } from "@/services/api";

const STORAGE_KEY = "aruna_auth";

function loadUser() {
  try {
    if (!getToken()) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

  // Bersihkan data terkait user
  localStorage.removeItem("aruna_cart");           // keranjang
  localStorage.removeItem("aruna_checkout");       // checkout yang belum selesai
    localStorage.removeItem("aruna_favorites");
  localStorage.removeItem("aruna_riwayat_pesanan");
}

// Token ditolak server (kedaluwarsa / akun diblokir): keluar otomatis
window.addEventListener("aruna:unauthorized", hapusSesi);

export function useAuth() {
  const user = computed(() => state.user);
  const isLoggedIn = computed(() => !!state.user);
  const isAdmin = computed(() => state.user?.role === "admin");
  const isSeller = computed(() => state.user?.role === "penjual");
  const isCustomer = computed(() => state.user?.role === "customer");

  async function registerUser(accountData) {
    const res = await api.post("/auth/register", accountData);
    return res.user;
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    simpanSesi(res.user, res.token);
    return res.user;
  }

  // Login khusus admin — memvalidasi role di sisi frontend
  async function loginAdmin(email, password) {
    const res = await api.post("/auth/login", { email, password });

    if (res.user?.role !== "admin") {
      throw new Error("Akun ini bukan akun admin.");
    }

    simpanSesi(res.user, res.token);
    return res.user;
  }

  async function updateUser(updates) {
    if (!state.user) throw new Error("Tidak ada pengguna yang sedang login.");
    const updated = await api.put("/auth/me", updates);
    const hasil = denganFoto(updated);
    simpanSesi(hasil);
    return hasil;
  }

  async function refreshUser() {
    if (!getToken()) return null;
    const me = await api.get("/auth/me");
    const hasil = denganFoto(me);
    simpanSesi(hasil);
    return hasil;
  }

  // ==================== OTP WhatsApp ====================

  async function requestOtp(phone, tujuan = "login") {
    return otp.request(phone, tujuan);
  }

  async function verifyOtp(phone, code, tujuan = "login") {
    const res = await otp.verify(phone, code, tujuan);

    if (res.registered && res.token && res.user) {
      simpanSesi(res.user, res.token);
    }

    return res;
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
    requestOtp,
    verifyOtp,
  };
}