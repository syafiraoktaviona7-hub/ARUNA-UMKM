import { reactive } from "vue";

// PROTOTIPE: data dummy. Ganti dengan panggilan API saat backend siap.
export const db = reactive({
  umkm: [
    { id: 1, nama: "Keripik Tempe Bu Sari", pemilik: "Sari Wulandari", kategori: "Makanan", kota: "Surabaya", tgl: "4 Okt 2026", status: "menunggu" },
    { id: 2, nama: "Batik Kenongo", pemilik: "Hendra Putra", kategori: "Fashion", kota: "Sidoarjo", tgl: "3 Okt 2026", status: "menunggu" },
    { id: 3, nama: "Kopi Arjuna", pemilik: "Rina Mahendra", kategori: "Minuman", kota: "Malang", tgl: "28 Sep 2026", status: "aktif" },
    { id: 4, nama: "Kerajinan Bambu Lestari", pemilik: "Joko Santoso", kategori: "Kerajinan", kota: "Surabaya", tgl: "21 Sep 2026", status: "aktif" },
    { id: 5, nama: "Sambal Mama Dewi", pemilik: "Dewi Anggraini", kategori: "Makanan", kota: "Gresik", tgl: "15 Sep 2026", status: "aktif" },
    { id: 6, nama: "Toko Jamu Sehat", pemilik: "Budi Prasetyo", kategori: "Minuman", kota: "Surabaya", tgl: "2 Sep 2026", status: "ditangguhkan" },
  ],
  produk: [
    { id: 1, nama: "Keripik Tempe Original", umkm: "Keripik Tempe Bu Sari", kategori: "Makanan", harga: 18000, status: "tampil" },
    { id: 2, nama: "Kopi Arabika 250 g", umkm: "Kopi Arjuna", kategori: "Minuman", harga: 65000, status: "tampil" },
    { id: 3, nama: "Keranjang Anyaman", umkm: "Kerajinan Bambu Lestari", kategori: "Kerajinan", harga: 85000, status: "tampil" },
    { id: 4, nama: "Sambal Bawang 200 g", umkm: "Sambal Mama Dewi", kategori: "Makanan", harga: 25000, status: "tampil" },
    { id: 5, nama: "Jamu Kunyit Asam", umkm: "Toko Jamu Sehat", kategori: "Minuman", harga: 12000, status: "disembunyikan" },
  ],
  pengguna: [
    { id: 1, nama: "Rina Mahendra", email: "rina@kopiarjuna.id", peran: "Penjual", status: "aktif" },
    { id: 2, nama: "Joko Santoso", email: "joko@bambulestari.id", peran: "Penjual", status: "aktif" },
    { id: 3, nama: "Andi Pratama", email: "andi@mail.com", peran: "Customer", status: "aktif" },
    { id: 4, nama: "Siti Aminah", email: "siti@mail.com", peran: "Customer", status: "aktif" },
    { id: 5, nama: "Budi Prasetyo", email: "budi@tokojamu.id", peran: "Penjual", status: "diblokir" },
  ],
  pesanan: [
    { id: "#ORD-1042", pelanggan: "Andi Pratama", umkm: "Kopi Arjuna", total: 130000, tgl: "5 Okt 2026", status: "diproses" },
    { id: "#ORD-1041", pelanggan: "Siti Aminah", umkm: "Sambal Mama Dewi", total: 50000, tgl: "5 Okt 2026", status: "dikirim" },
    { id: "#ORD-1040", pelanggan: "Andi Pratama", umkm: "Kerajinan Bambu Lestari", total: 85000, tgl: "4 Okt 2026", status: "selesai" },
    { id: "#ORD-1039", pelanggan: "Siti Aminah", umkm: "Kopi Arjuna", total: 65000, tgl: "3 Okt 2026", status: "selesai" },
    { id: "#ORD-1038", pelanggan: "Andi Pratama", umkm: "Toko Jamu Sehat", total: 24000, tgl: "2 Okt 2026", status: "dibatalkan" },
  ],
  laporan: [
    { id: 1, pelapor: "Andi Pratama", target: "Toko Jamu Sehat", alasan: "Barang tidak sesuai deskripsi", status: "baru" },
    { id: 2, pelapor: "Siti Aminah", target: "Jamu Kunyit Asam", alasan: "Klaim kesehatan berlebihan", status: "baru" },
    { id: 3, pelapor: "Andi Pratama", target: "Sambal Mama Dewi", alasan: "Pesanan terlambat", status: "selesai" },
  ],
});

// Satu konfigurasi dipakai halaman daftar generik (AdminListPage.vue)
export const sections = {
  verifikasi: {
    title: "Verifikasi UMKM", desc: "Pendaftaran baru yang menunggu pemeriksaan.",
    data: "umkm", fixed: "menunggu", statuses: [],
    columns: [["nama", "UMKM"], ["pemilik", "Pemilik"], ["kategori", "Kategori"], ["kota", "Kota"], ["tgl", "Mendaftar"]],
    actions: [{ label: "Setujui", set: "aktif", tone: "ok" }, { label: "Tolak", set: "ditolak", tone: "bad" }],
  },
  umkm: {
    title: "Kelola UMKM", desc: "Semua UMKM yang terdaftar di ARUNA.",
    data: "umkm", statuses: ["aktif", "menunggu", "ditangguhkan", "ditolak"],
    columns: [["nama", "UMKM"], ["pemilik", "Pemilik"], ["kategori", "Kategori"], ["kota", "Kota"]],
    actions: [{ label: "Tangguhkan", set: "ditangguhkan", when: ["aktif"], tone: "bad" }, { label: "Aktifkan", set: "aktif", when: ["ditangguhkan"], tone: "ok" }],
  },
  produk: {
    title: "Produk", desc: "Produk dari seluruh UMKM.",
    data: "produk", statuses: ["tampil", "disembunyikan"], money: ["harga"],
    columns: [["nama", "Produk"], ["umkm", "UMKM"], ["kategori", "Kategori"], ["harga", "Harga"]],
    actions: [{ label: "Sembunyikan", set: "disembunyikan", when: ["tampil"], tone: "bad" }, { label: "Tampilkan", set: "tampil", when: ["disembunyikan"], tone: "ok" }],
  },
  pengguna: {
    title: "Pengguna", desc: "Penjual dan customer.",
    data: "pengguna", statuses: ["aktif", "diblokir"],
    columns: [["nama", "Nama"], ["email", "Email"], ["peran", "Peran"]],
    actions: [{ label: "Blokir", set: "diblokir", when: ["aktif"], tone: "bad" }, { label: "Aktifkan", set: "aktif", when: ["diblokir"], tone: "ok" }],
  },
  pesanan: {
    title: "Pesanan", desc: "Pantau pesanan lintas UMKM. Pembayaran dilakukan langsung ke UMKM.",
    data: "pesanan", statuses: ["diproses", "dikirim", "selesai", "dibatalkan"], money: ["total"],
    columns: [["id", "No. pesanan"], ["pelanggan", "Customer"], ["umkm", "UMKM"], ["total", "Total"], ["tgl", "Tanggal"]],
    actions: [],
  },
  laporan: {
    title: "Laporan customer", desc: "Keluhan terhadap UMKM atau produk.",
    data: "laporan", statuses: ["baru", "selesai"],
    columns: [["pelapor", "Pelapor"], ["target", "Dilaporkan"], ["alasan", "Alasan"]],
    actions: [{ label: "Tandai selesai", set: "selesai", when: ["baru"], tone: "ok" }],
  },
};