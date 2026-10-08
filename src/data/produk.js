// Data contoh. Ganti dengan data dari backend.
// Nama toko dan lokasi diambil dari umkm.js lewat umkmId, jadi isi data toko cukup di sana.
// jenis hanya diisi untuk kategori Makanan: 'Fast Food Lokal' | 'Frozen Food' | 'Kuliner Lainnya'
import { umkmList } from "@/data/umkm";

const WA_CONTOH = "6280000000000"; // GANTI dengan nomor WhatsApp penjual yang asli

// Sembako dan Sayur dan Buah belum punya foto. Taruh fotonya di public/images
// dengan nama di bawah ini, atau ubah path-nya. Selama belum ada, kartu menampilkan huruf.
const img = {
  Makanan: "/images/kategori-makanan.jpg",
  Minuman: "/images/kategori-minuman.jpg",
  "Fashion & Aksesorisnya": "/images/kategori-fashion.jpg",
  Sembako: "/images/produk-sembako.jpg",
  "Sayur dan Buah": "/images/produk-sayur-buah.jpg",
};

const umkmById = new Map(umkmList.map((x) => [x.id, x]));

// Deskripsi dan stok per produk (kunci = id produk). Ganti stok dengan data asli.
const info = {
  1: { stok: 40, deskripsi: "Ayam geprek krispi dengan tepung renyah dan sambal bawang pedas segar. Satu porsi besar sudah termasuk nasi hangat dan lalapan. Dimasak saat dipesan, tersedia level pedas sesuai selera." },
  2: { stok: 25, deskripsi: "Dimsum ayam frozen isi 10 pcs, dibuat dari daging ayam pilihan dan udang tanpa pengawet. Tinggal dikukus 15 menit. Simpan di freezer, tahan hingga 3 bulan." },
  3: { stok: 18, deskripsi: "Nugget dari daging ikan lele segar, gurih dan minim duri, dengan lapisan tepung renyah. Cukup digoreng 5 menit. Simpan beku, tahan hingga 3 bulan." },
  4: { stok: 60, deskripsi: "Keripik tempe tipis dan renyah dengan bumbu rempah khas, dibuat dari kedelai pilihan. Kemasan 250 gram, cocok untuk camilan keluarga atau oleh-oleh." },
  5: { stok: 30, deskripsi: "Sambal roa khas Manado dari ikan roa asap, cabai rawit, dan bawang merah. Rasa pedas gurih dengan aroma asap yang kuat. Cocok untuk nasi, mie, dan lauk." },
  6: { stok: 22, deskripsi: "Kue timphan khas Aceh isi 12 pcs. Kue pulut kenyal berisi srikaya dan dibungkus daun pisang. Lembut, manis, dan cocok untuk sajian acara." },
  7: { stok: 15, deskripsi: "Bika ambon original dengan tekstur kenyal berongga dan aroma pandan serta santan yang harum. Dipanggang segar setiap hari tanpa pengawet." },
  8: { stok: 35, deskripsi: "Burger dengan patty tempe berbumbu rempah, selada, tomat, dan saus spesial di roti lembut. Alternatif burger yang gurih, mengenyangkan, dan ramah di kantong." },
  9: { stok: 50, deskripsi: "Biji kopi robusta Arjuna 200 gram dengan cita rasa kuat, pahit seimbang, dan aroma cokelat. Disangrai medium dan tersedia dalam bentuk biji atau bubuk." },
  10: { stok: 45, deskripsi: "Kopi susu dengan gula aren asli yang manis legit dan creamy. Dibuat dari espresso pilihan dan susu segar, nikmat disajikan dingin." },
  11: { stok: 70, deskripsi: "Wedang jahe instan isi 10 sachet dari jahe merah asli, rempah, dan gula. Menghangatkan badan, praktis diseduh dengan air panas." },
  12: { stok: 80, deskripsi: "Beras pandan wangi kemasan 5 kg dengan butiran bersih. Pulen, harum, dan cocok untuk konsumsi harian maupun usaha makan." },
  13: { stok: 55, deskripsi: "Gula aren cetak asli 500 gram dari nira kelapa, tanpa campuran gula pasir. Aroma harum dan rasa manis alami untuk minuman, kue, dan masakan." },
  14: { stok: 30, deskripsi: "Telur ayam kampung isi 10 butir dari peternakan sendiri, segar dan kuning telurnya pekat. Dikemas aman dalam tray." },
  15: { stok: 8, deskripsi: "Batik tulis pesisir dengan motif khas pantura, dikerjakan manual oleh pengrajin. Kain adem dan nyaman. Setiap lembar punya detail yang sedikit berbeda." },
  16: { stok: 5, deskripsi: "Tenun sutra khas Makassar dengan benang sutra halus dan motif tradisional. Cocok untuk busana adat dan acara resmi. Dikerjakan dengan alat tenun tradisional." },
  17: { stok: 20, deskripsi: "Tas anyaman rotan dengan kerangka kuat dan finishing rapi. Ringan, tahan lama, dan cocok untuk gaya kasual maupun etnik." },
  18: { stok: 40, deskripsi: "Bayam organik 250 gram dipanen segar dari kebun tanpa pestisida kimia. Daun hijau, lembut, dan cocok untuk sayur bening atau tumisan." },
  19: { stok: 60, deskripsi: "Jeruk keprok Batu 1 kg, berkulit tipis, manis segar, dan banyak air. Dipetik langsung dari kebun saat matang." },
  20: { stok: 45, deskripsi: "Mangga arumanis 1 kg dengan daging tebal, manis, dan harum. Dipilih yang matang pohon dan dikemas aman untuk pengiriman." },
};

const p = (id, name, umkmId, category, jenis, price, sold) => {
  const toko = umkmById.get(umkmId);
  if (!toko) console.warn(`Produk ${id}: umkmId ${umkmId} tidak ada di umkm.js`);

  return {
    id,
    name,
    umkmId,
    shop: toko?.name ?? "",
    category,
    jenis,
    price,
    sold,
    province: toko?.province ?? "",
    city: toko?.city ?? "",
    district: toko?.district ?? "",
    image: img[category],
    whatsapp: WA_CONTOH,
    stok: info[id]?.stok ?? 0,
    deskripsi: info[id]?.deskripsi ?? "",
  };
};

export const produkList = [
  // Makanan
  p(1, "Ayam Geprek Krispi Porsi Besar", 7, "Makanan", "Fast Food Lokal", 18000, 128),
  p(2, "Dimsum Ayam Frozen Isi 10", 8, "Makanan", "Frozen Food", 32000, 96),
  p(3, "Nugget Ikan Lele Frozen", 9, "Makanan", "Frozen Food", 26000, 41),
  p(4, "Keripik Tempe Original 250g", 1, "Makanan", "Kuliner Lainnya", 20000, 210),
  p(5, "Sambal Roa Manado Botol", 6, "Makanan", "Kuliner Lainnya", 35000, 75),
  p(6, "Kue Timphan Isi 12", 10, "Makanan", "Kuliner Lainnya", 28000, 33),
  p(7, "Bika Ambon Original", 11, "Makanan", "Kuliner Lainnya", 45000, 58),
  p(8, "Burger Tempe Lokal", 12, "Makanan", "Fast Food Lokal", 15000, 64),

  // Minuman
  p(9, "Kopi Arjuna Robusta 200g", 2, "Minuman", "", 55000, 142),
  p(10, "Kopi Susu Gula Aren", 13, "Minuman", "", 22000, 88),
  p(11, "Wedang Jahe Instan 10 Sachet", 14, "Minuman", "", 18000, 54),

  // Sembako
  p(12, "Beras Pandan Wangi 5 kg", 15, "Sembako", "", 72000, 180),
  p(13, "Gula Aren Cetak 500g", 16, "Sembako", "", 25000, 96),
  p(14, "Telur Ayam Kampung 10 Butir", 17, "Sembako", "", 32000, 120),

  // Fashion & Aksesorisnya
  p(15, "Batik Tulis Pesisir", 3, "Fashion & Aksesorisnya", "", 285000, 12),
  p(16, "Tenun Sutra Makassar", 18, "Fashion & Aksesorisnya", "", 450000, 7),
  p(17, "Tas Anyaman Rotan", 4, "Fashion & Aksesorisnya", "", 95000, 24),

  // Sayur dan Buah
  p(18, "Bayam Organik 250g", 19, "Sayur dan Buah", "", 8000, 70),
  p(19, "Jeruk Keprok Batu 1 kg", 20, "Sayur dan Buah", "", 35000, 85),
  p(20, "Mangga Arumanis 1 kg", 21, "Sayur dan Buah", "", 28000, 64),
];

