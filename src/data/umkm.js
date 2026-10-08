// Data contoh. Ganti dengan response API backend (idealnya filter dilakukan di server).
// Sumber data toko: produk.js mengambil nama dan lokasi dari sini lewat umkmId.
export const categories = [
  "Semua",
  "Makanan",
  "Minuman",
  "Fashion & Aksesorisnya",
  "Sembako",
  "Sayur dan Buah",
  "Kerajinan",
  "Home Decor",
];

const img = {
  Makanan: "/images/kategori-makanan.jpg",
  Minuman: "/images/kategori-minuman.jpg",
  "Fashion & Aksesorisnya": "/images/kategori-fashion.jpg",
  Sembako: "/images/produk-sembako.jpg",
  "Sayur dan Buah": "/images/produk-sayur-buah.jpg",
};

const u = (id, name, category, province, city, district, image) => ({
  id,
  name,
  category,
  province,
  city,
  district,
  image: image ?? img[category],
});

export const umkmList = [
  u(1, "Keripik Tempe Bu Sari", "Makanan", "Jawa Timur", "Kota Surabaya", "Gubeng", "/images/produk-1.jpg"),
  u(2, "Kopi Arjuna", "Minuman", "Jawa Timur", "Kota Malang", "Klojen", "/images/produk-2.jpg"),
  u(3, "Batik Tulis Pesisir", "Fashion & Aksesorisnya", "Jawa Tengah", "Kota Pekalongan", "Pekalongan Timur", "/images/produk-3.jpg"),
  u(4, "Anyaman Rotan Lestari", "Kerajinan", "Jawa Barat", "Kota Cirebon", "Harjamukti", "/images/produk-4.jpg"),
  u(5, "Gerabah Kasongan", "Home Decor", "Daerah Istimewa Yogyakarta", "Kabupaten Bantul", "Kasihan", "/images/produk-5.jpg"),
  u(6, "Sambal Roa Manado", "Makanan", "Sulawesi Utara", "Kota Manado", "Wenang", "/images/produk-6.jpg"),

  // Toko dari produk.js yang sebelumnya belum terdaftar
  u(7, "Warung Geprek Mbak Yuni", "Makanan", "Jawa Timur", "Kota Surabaya", "Gubeng"),
  u(8, "Dapur Bu Ratna", "Makanan", "Jawa Timur", "Kota Surabaya", "Gubeng"),
  u(9, "Mina Wijaya", "Makanan", "Jawa Timur", "Kota Malang", "Klojen"),
  u(10, "Dapur Aceh Kuta Alam", "Makanan", "Aceh", "Kota Banda Aceh", "Kuta Alam"),
  u(11, "Bika Ambon Petisah", "Makanan", "Sumatera Utara", "Kota Medan", "Medan Petisah"),
  u(12, "Burger Nusantara", "Makanan", "Jawa Barat", "Kota Bandung", "Coblong"),
  u(13, "Kopi Dago", "Minuman", "Jawa Barat", "Kota Bandung", "Coblong"),
  u(14, "Wedang Jahe Bu Tini", "Minuman", "Jawa Tengah", "Kota Surakarta", "Laweyan"),
  u(15, "Toko Beras Makmur", "Sembako", "Jawa Barat", "Kabupaten Cianjur", "Cianjur"),
  u(16, "Gula Aren Pak Karto", "Sembako", "Jawa Tengah", "Kabupaten Banyumas", "Purwokerto Timur"),
  u(17, "Peternak Sido Makmur", "Sembako", "Jawa Timur", "Kota Malang", "Lowokwaru"),
  u(18, "Tenun Sutra Panakkukang", "Fashion & Aksesorisnya", "Sulawesi Selatan", "Kota Makassar", "Panakkukang"),
  u(19, "Kebun Hijau Lembang", "Sayur dan Buah", "Jawa Barat", "Kabupaten Bandung Barat", "Lembang"),
  u(20, "Kebun Jeruk Bumiaji", "Sayur dan Buah", "Jawa Timur", "Kota Batu", "Bumiaji"),
  u(21, "Kebun Mangga Indramayu", "Sayur dan Buah", "Jawa Barat", "Kabupaten Indramayu", "Indramayu"),
];