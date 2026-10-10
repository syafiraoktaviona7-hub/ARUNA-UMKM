// DRAF. Semua isi di sini contoh. Ganti dengan data usaha yang sebenarnya.
import { getJasaDetail } from "./jasaDetail";

// ===== PER JENIS JASA: alur kerja dan tarif tambahan =====
export const extraByCategory = {
  Katering: {
    process: [
      {
        t: "Konsultasi menu",
        s: "Kamu menyampaikan jumlah porsi, anggaran, dan selera. Penyedia mengusulkan menu yang sesuai.",
      },
      {
        t: "Konfirmasi dan uang muka",
        s: "Harga, jadwal, dan alamat disepakati, lalu uang muka dibayar untuk mengunci jadwal.",
      },
      {
        t: "Persiapan bahan dan memasak",
        s: "Bahan disiapkan dan dimasak mendekati jam pengantaran agar tetap segar.",
      },
      {
        t: "Pengemasan dan pengantaran",
        s: "Makanan dikemas rapi dan diantar sesuai jam yang disepakati.",
      },
      {
        t: "Serah terima dan pelunasan",
        s: "Kamu memeriksa pesanan saat tiba, lalu melunasi sisa pembayaran.",
      },
    ],
    extraFees: [
      { label: "Alat makan sekali pakai", value: "Rp 1.500 / set" },
      {
        label: "Antar di luar area layanan",
        value: "Mulai Rp 10.000, sesuai jarak",
      },
      {
        label: "Pesanan mendadak (kurang dari 24 jam)",
        value: "Tambahan 10–20% jika jadwal masih tersedia",
      },
    ],
  },

  Servis: {
    process: [
      {
        t: "Sampaikan keluhan",
        s: "Kamu menyebutkan keluhan, lalu penyedia memberi perkiraan biaya awal.",
      },
      {
        t: "Penjadwalan kunjungan",
        s: "Jadwal dan alamat disepakati, lalu teknisi datang sesuai jam.",
      },
      {
        t: "Pengecekan dan persetujuan",
        s: "Teknisi memeriksa dan menjelaskan penyebab serta biayanya. Pekerjaan dilanjutkan hanya setelah kamu setuju.",
      },
      {
        t: "Pengerjaan",
        s: "Perbaikan dilakukan sesuai paket, dengan area kerja dijaga tetap bersih.",
      },
      {
        t: "Uji hasil dan pembayaran",
        s: "Hasil diuji bersamamu, lalu pembayaran dilakukan dan garansi dicatat.",
      },
    ],
    extraFees: [
      {
        label: "Suku cadang",
        value: "Sesuai harga yang kamu setujui sebelum dipasang",
      },
      { label: "Kunjungan di luar area layanan", value: "Mulai Rp 25.000" },
      {
        label: "Pekerjaan di luar jam layanan",
        value: "Tambahan sesuai kesepakatan",
      },
    ],
  },

  Jahit: {
    process: [
      {
        t: "Konsultasi model dan ukuran",
        s: "Kamu membawa referensi model, lalu penyedia mengukur badan atau pakaian yang akan dipermak.",
      },
      {
        t: "Pemilihan bahan dan uang muka",
        s: "Bahan dikonfirmasi, estimasi biaya disepakati, dan uang muka dibayar.",
      },
      {
        t: "Pemotongan dan penjahitan",
        s: "Kain dipotong dan dijahit sesuai pola yang disepakati.",
      },
      {
        t: "Fitting",
        s: "Kamu mencoba pakaian agar ukuran dapat disesuaikan sebelum finishing.",
      },
      {
        t: "Finishing dan pengambilan",
        s: "Pakaian dirapikan dan disetrika, lalu diambil dengan pelunasan.",
      },
    ],
    extraFees: [
      {
        label: "Kain dan aksesori (bila dicarikan penyedia)",
        value: "Sesuai bahan yang dipilih",
      },
      { label: "Pengerjaan kilat", value: "Tambahan 20–30% dari harga jasa" },
      {
        label: "Payet atau bordir tambahan",
        value: "Sesuai tingkat kerumitan",
      },
    ],
  },

  "Foto & Desain": {
    process: [
      {
        t: "Brief kebutuhan",
        s: "Kamu menyampaikan tujuan, gaya, warna, dan tenggat. Contoh referensi sangat membantu.",
      },
      {
        t: "Penjadwalan dan uang muka",
        s: "Jadwal sesi atau konsep awal disepakati, lalu uang muka dibayar.",
      },
      {
        t: "Produksi",
        s: "Pemotretan atau pembuatan desain dikerjakan sesuai paket.",
      },
      {
        t: "Penyuntingan dan peninjauan",
        s: "Hasil awal dikirim untuk kamu tinjau.",
      },
      {
        t: "Revisi dan penyerahan file",
        s: "Revisi dikerjakan sesuai jumlah di paket, lalu file akhir diserahkan setelah pelunasan.",
      },
    ],
    extraFees: [
      { label: "Revisi tambahan di luar paket", value: "Dibahas per kasus" },
      { label: "Properti atau model tambahan", value: "Sesuai kebutuhan" },
      { label: "Pengerjaan kilat", value: "Tambahan sekitar 25%" },
    ],
  },

  Kebersihan: {
    process: [
      {
        t: "Survei singkat",
        s: "Kamu menyebutkan luas, jumlah ruangan, dan area prioritas. Foto membantu penyedia memperkirakan durasi.",
      },
      {
        t: "Penjadwalan petugas",
        s: "Tanggal, jam, dan jumlah petugas disepakati.",
      },
      {
        t: "Pembersihan sesuai daftar",
        s: "Petugas membersihkan area yang sudah disepakati dengan perlengkapan sendiri.",
      },
      {
        t: "Pemeriksaan bersama",
        s: "Kamu memeriksa hasilnya. Area yang terlewat dibersihkan ulang di hari yang sama.",
      },
      { t: "Pembayaran", s: "Pembayaran dilakukan setelah pekerjaan selesai." },
    ],
    extraFees: [
      {
        label: "Tambahan jam kerja",
        value: "Rp 25.000 / jam, atas persetujuanmu",
      },
      {
        label: "Area khusus (plafon tinggi, kaca luar)",
        value: "Dibahas terpisah",
      },
      { label: "Bahan pembersih khusus", value: "Sesuai kebutuhan" },
    ],
  },

  Kurir: {
    process: [
      {
        t: "Kirim detail pengantaran",
        s: "Kamu mengirim alamat jemput, alamat tujuan, dan nomor penerima.",
      },
      {
        t: "Penjemputan",
        s: "Kurir menjemput barang di alamat asal dan memberi kabar saat berangkat.",
      },
      {
        t: "Pengantaran",
        s: "Barang diantar ke alamat tujuan dalam area layanan.",
      },
      {
        t: "Konfirmasi diterima",
        s: "Kamu mendapat kabar dan bukti serah terima saat barang sampai.",
      },
      {
        t: "Pembayaran",
        s: "Pembayaran dilakukan sesuai kesepakatan, tunai atau transfer.",
      },
    ],
    extraFees: [
      { label: "Jarak di atas 10 km", value: "Mulai Rp 3.000 / km tambahan" },
      {
        label: "Antar di luar jam layanan",
        value: "Tambahan sesuai kesepakatan",
      },
      { label: "Menunggu lebih dari 10 menit", value: "Rp 5.000 per 10 menit" },
    ],
  },
};

// ===== PER USAHA (berdasarkan id di jasa.js): profil dan jadwal =====
export const extraById = {
  1: {
    profile: {
      since: 2016,
      team: "6 orang",
      legal: "NIB terdaftar",
      about:
        "Usaha katering rumahan yang melayani pesanan acara keluarga, arisan, dan kantor di Surabaya. Masakan dibuat segar di hari pengantaran dengan menu yang bisa disesuaikan.",
    },
    schedule: [
      ["Senin – Sabtu", "07.00 – 18.00"],
      ["Minggu", "Libur (pesanan khusus dengan perjanjian)"],
    ],
  },
  2: {
    profile: {
      since: 2020,
      team: "8 kurir",
      legal: "NIB terdaftar",
      about:
        "Kurir lokal yang mengantar barang dan makanan di dalam kota pada hari yang sama, dengan kabar penjemputan dan konfirmasi saat barang tiba.",
    },
    schedule: [["Setiap hari", "07.00 – 21.00"]],
  },
  3: {
    profile: {
      since: 2012,
      team: "4 teknisi",
      legal: "NIB terdaftar",
      about:
        "Jasa servis dan cuci AC untuk rumah tangga dan kantor kecil di Malang. Teknisi menjelaskan kondisi AC dan biaya sebelum pekerjaan dimulai.",
    },
    schedule: [
      ["Senin – Sabtu", "08.00 – 17.00"],
      ["Minggu", "Libur"],
    ],
  },
  4: {
    profile: {
      since: 2009,
      team: "3 penjahit",
      legal: "NIB terdaftar",
      about:
        "Penjahit yang berfokus pada kebaya, seragam, dan permak pakaian. Pengukuran dilakukan langsung dan ada fitting sebelum finishing.",
    },
    schedule: [
      ["Senin – Sabtu", "08.00 – 16.00"],
      ["Minggu", "Libur"],
    ],
  },
  5: {
    profile: {
      since: 2019,
      team: "3 orang",
      legal: "NIB terdaftar",
      about:
        "Studio foto produk untuk toko online dan media sosial. Sesi dilakukan dengan janji temu, dan hasil terpilih diedit sebelum dikirim.",
    },
    schedule: [
      ["Senin – Sabtu", "09.00 – 17.00 (dengan janji temu)"],
      ["Minggu", "Libur"],
    ],
  },
  6: {
    profile: {
      since: 2017,
      team: "12 petugas",
      legal: "NIB terdaftar",
      about:
        "Jasa kebersihan rumah, kos, dan kantor kecil dengan petugas terlatih yang membawa perlengkapan sendiri dan bekerja sesuai daftar area.",
    },
    schedule: [["Setiap hari", "07.00 – 17.00"]],
  },
  7: {
    profile: {
      since: 2019,
      team: "10 kurir",
      legal: "NIB terdaftar",
      about:
        "Kurir lokal yang mengantar paket dan makanan di dalam kota Makassar dengan tarif jelas berdasarkan jarak.",
    },
    schedule: [["Setiap hari", "07.00 – 21.00"]],
  },
  8: {
    profile: {
      since: 2018,
      team: "5 orang",
      legal: "NIB terdaftar",
      about:
        "Katering paket makan siang kantor dan pesanan acara dengan cita rasa khas Medan. Menu bisa diatur sesuai kebutuhan.",
    },
    schedule: [
      ["Senin – Sabtu", "07.00 – 17.00"],
      ["Minggu", "Libur"],
    ],
  },
  9: {
    profile: {
      since: 2010,
      team: "5 mekanik",
      legal: "NIB terdaftar",
      about:
        "Bengkel motor untuk servis rutin, tune up, dan perbaikan ringan. Teknisi menjelaskan kondisi motor dan biaya sebelum penggantian suku cadang.",
    },
    schedule: [
      ["Senin – Sabtu", "08.00 – 17.00"],
      ["Minggu", "Libur"],
    ],
  },
  10: {
    profile: {
      since: 2021,
      team: "2 desainer",
      legal: "NIB terdaftar",
      about:
        "Studio desain yang membantu usaha baru membangun identitas visual, dari logo hingga kartu nama, sepenuhnya secara online.",
    },
    schedule: [
      ["Senin – Jumat", "09.00 – 17.00"],
      ["Sabtu – Minggu", "Libur"],
    ],
  },
  11: {
    profile: {
      since: 2014,
      team: "4 penjahit",
      legal: "NIB terdaftar",
      about:
        "Penjahit busana songket dan pakaian adat dengan pengerjaan teliti. Fitting dilakukan sebelum finishing agar ukuran pas.",
    },
    schedule: [
      ["Senin – Sabtu", "09.00 – 16.00"],
      ["Minggu", "Libur"],
    ],
  },
};

// Menggabungkan detail dasar dengan alur kerja, tarif tambahan, dan profil penyedia
export function getJasaFull(item) {
  const base = getJasaDetail(item);
  const cat = extraByCategory[item.category] ?? {};
  const own = extraById[item.id] ?? {};

  return {
    payMethods: ["Transfer bank", "QRIS", "Tunai"],
    process: [],
    extraFees: [],
    schedule: [],
    profile: { since: "-", team: "-", legal: "", about: item.description },
    ...cat,
    ...base,
    ...own,
  };
}
