// Klien API ARUNA. Alamat dasar diatur lewat VITE_API_URL (default "/api" lewat proxy Vite).
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export const TOKEN_KEY = "aruna_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

async function request(method, path, { params, body } = {}) {
  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Token kedaluwarsa atau akun diblokir: beri tahu useAuth supaya logout
    if (res.status === 401 && token) window.dispatchEvent(new Event("aruna:unauthorized"));
    const err = new Error(data?.message || `Permintaan gagal (${res.status}).`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path, params) => request("GET", path, { params }),
  post: (path, body) => request("POST", path, { body }),
  put: (path, body) => request("PUT", path, { body }),
  patch: (path, body) => request("PATCH", path, { body }),
};

// ---- Publik (bentuk datanya sama dengan src/data/*.js) ----
export const katalog = {
  kategori: () => api.get("/kategori"),
  umkm: (params) => api.get("/umkm", params), // kategori, provinsi, kota, kecamatan, q
  umkmDetail: (id) => api.get(`/umkm/${id}`),
  produk: (params) => api.get("/produk", params), // + jenis, umkm, urut (terlaris|termurah|termahal)
  produkDetail: (id) => api.get(`/produk/${id}`),
  jasaKategori: () => api.get("/jasa-kategori"),
  jasa: (params) => api.get("/jasa", params),
  artikel: (params) => api.get("/artikel", params), // provinsi
  artikelDetail: (id) => api.get(`/artikel/${id}`),
};

// ---- OTP WhatsApp ----
export const otp = {
  request: (phone, tujuan = "login") =>
    api.post("/auth/request-otp", { phone, tujuan }),
  verify: (phone, code, tujuan = "login") =>
    api.post("/auth/verify-otp", { phone, code, tujuan }),
};

// ---- Customer ----
export const customer = {
  // items: [{ id, qty }]; opsional: nama_penerima, no_hp_penerima, alamat_kirim, catatan, metode_bayar
  buatPesanan: (body) => api.post("/pesanan", body),
  pesanan: () => api.get("/pesanan"),
  pesananDetail: (id) => api.get(`/pesanan/${id}`),
  batalkanPesanan: (id) => api.patch(`/pesanan/${id}/batal`),
  laporan: (body) => api.post("/laporan", body), // target_tipe, target_id, alasan
};

// ---- Penjual ----
export const penjual = {
  dashboard: () => api.get("/penjual/dashboard"),

  produk: () => api.get("/penjual/produk"),
  produkBuat: (body) => api.post("/penjual/produk", body),
  produkUpdate: (id, body) => api.put(`/penjual/produk/${id}`, body),
  produkHapus: (id) => api.delete(`/penjual/produk/${id}`),

  pesanan: (params) => api.get("/penjual/pesanan", params),
  pesananDetail: (id) => api.get(`/penjual/pesanan/${id}`),
  pesananUbahStatus: (id, status) => api.patch(`/penjual/pesanan/${id}/status`, { status }),

  profil: () => api.get("/penjual/profil"),
  profilUpdate: (body) => api.put("/penjual/profil", body),
};

// ---- Admin ----
export const admin = {
  dashboard: () => api.get("/admin/dashboard"),
  badge: () => api.get("/admin/badge"), // { verifikasi, laporan }
  daftar: (section, params) => api.get(`/admin/${section}`, params), // status, q
  ubahStatus: (section, id, status) => api.patch(`/admin/${section}/${id}/status`, { status }),
};
