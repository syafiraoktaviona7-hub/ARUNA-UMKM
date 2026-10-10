// DRAF. Semua isi di sini contoh. Ganti dengan data usaha yang sebenarnya.
const WA_CONTOH = "6280000000000"; // GANTI dengan nomor WhatsApp penyedia (format 62812..., tanpa +)

// ===== INFORMASI UMUM PER JENIS JASA =====
export const jasaCategoryInfo = {
  Katering: {
    intro:
      "Layanan katering untuk acara keluarga, kantor, arisan, dan kebutuhan harian. Menu bisa disesuaikan dengan selera dan anggaran, dan makanan diolah setelah pesanan dikonfirmasi agar tetap segar.",
    includes: [
      "Makanan sesuai menu paket yang dipilih",
      "Kemasan saji (kotak atau wadah)",
      "Pengantaran ke lokasi dalam area layanan",
    ],
    excludes: [
      "Dekorasi dan penataan prasmanan",
      "Alat makan tambahan di luar paket",
      "Ongkos antar di luar area layanan",
    ],
    prepare: [
      "Tanggal, jam, dan alamat pengantaran",
      "Jumlah porsi dan anggaran per porsi",
      "Pantangan atau alergi makanan peserta",
    ],
    payment:
      "Uang muka (DP) untuk mengunci jadwal, pelunasan saat makanan diantar. Metode transfer bank atau tunai sesuai kesepakatan.",
    cancel:
      "Perubahan jumlah atau jadwal sebaiknya disampaikan minimal 1 hari sebelumnya. Pembatalan mendadak setelah bahan disiapkan dapat memengaruhi pengembalian DP.",
    warranty:
      "Jika pesanan tidak sesuai kesepakatan, laporkan dengan foto saat makanan diterima agar bisa ditindaklanjuti.",
    faqs: [
      {
        q: "Berapa lama sebelumnya harus memesan?",
        a: "Disarankan memesan beberapa hari sebelum acara, dan lebih awal untuk jumlah besar atau akhir pekan, supaya jadwal dan bahan aman.",
      },
      {
        q: "Apakah menu bisa disesuaikan?",
        a: "Bisa, selama bahan tersedia. Sampaikan selera dan pantangan lewat WhatsApp sebelum pesanan dikonfirmasi.",
      },
      {
        q: "Bagaimana jika ada peserta yang alergi?",
        a: "Beri tahu jenis alergi sejak awal agar menu disesuaikan. Dapur yang mengolah banyak bahan tidak dapat menjamin bebas jejak alergen.",
      },
      {
        q: "Apakah ada ongkos antar?",
        a: "Pengantaran di dalam area layanan dibahas saat konfirmasi. Di luar area bisa dikenakan biaya tambahan.",
      },
    ],
  },

  Servis: {
    intro:
      "Layanan perbaikan dan perawatan oleh teknisi lokal. Sampaikan keluhanmu lebih dulu lewat WhatsApp, lalu teknisi memberi perkiraan biaya sebelum pekerjaan dimulai.",
    includes: [
      "Pengecekan awal dan diagnosis kerusakan",
      "Pengerjaan sesuai paket yang dipilih",
      "Pembersihan area kerja setelah selesai",
    ],
    excludes: [
      "Suku cadang atau bahan tambahan (diinformasikan dan disetujui dulu)",
      "Perbaikan di luar keluhan yang disepakati",
    ],
    prepare: [
      "Jenis, merek, dan keluhan perangkat atau kendaraan",
      "Foto atau video kerusakan jika memungkinkan",
      "Alamat dan jam yang cocok untuk kunjungan",
    ],
    payment:
      "Pembayaran setelah pekerjaan selesai dan kamu puas dengan hasilnya. Transfer bank atau tunai sesuai kesepakatan.",
    cancel:
      "Jadwal kunjungan bisa diubah dengan memberi kabar minimal beberapa jam sebelumnya.",
    warranty:
      "Pekerjaan bergaransi untuk keluhan yang sama dalam jangka waktu yang disebutkan penyedia. Simpan bukti pembayaran untuk klaim garansi.",
    faqs: [
      {
        q: "Apakah ada biaya pengecekan?",
        a: "Tanyakan saat konfirmasi. Biasanya biaya pengecekan sudah termasuk bila pekerjaan dilanjutkan.",
      },
      {
        q: "Bagaimana jika butuh suku cadang?",
        a: "Teknisi menyebutkan jenis dan harga suku cadang lebih dulu. Penggantian dilakukan hanya setelah kamu setuju.",
      },
      {
        q: "Apakah ada garansi servis?",
        a: "Ada garansi pekerjaan untuk keluhan yang sama. Lama dan syaratnya tercantum di tab Ketentuan.",
      },
    ],
  },

  Jahit: {
    intro:
      "Layanan jahit dan permak sesuai ukuran. Kamu bisa membawa kain sendiri atau meminta saran bahan, dan model dibahas bersama sebelum kain dipotong.",
    includes: [
      "Pengukuran badan atau pakaian",
      "Pola dan penjahitan sesuai model yang disepakati",
      "Finishing dan penyetrikaan",
    ],
    excludes: [
      "Kain dan aksesori (kecuali disebutkan)",
      "Perubahan model setelah kain dipotong",
    ],
    prepare: [
      "Foto model atau referensi yang kamu suka",
      "Ukuran badan atau pakaian yang akan dipermak",
      "Kain dan aksesori jika membawa sendiri",
    ],
    payment:
      "DP saat kain diterima dan ukuran disepakati, pelunasan saat pakaian diambil.",
    cancel:
      "Pembatalan sebelum kain dipotong tidak dikenakan biaya. Setelah dipotong, DP menyesuaikan pekerjaan yang sudah berjalan.",
    warranty:
      "Jika ukuran tidak sesuai dengan yang disepakati, penyedia membantu memperbaikinya tanpa biaya tambahan dalam batas wajar.",
    faqs: [
      {
        q: "Berapa lama pengerjaannya?",
        a: "Permak lebih cepat dibanding jahit dari awal. Estimasi lengkap ada di tab Area & Jadwal, dan bisa lebih lama saat musim ramai.",
      },
      {
        q: "Apakah bisa fitting dulu?",
        a: "Bisa. Fitting dijadwalkan sebelum finishing agar ukuran bisa disesuaikan.",
      },
      {
        q: "Bagaimana jika ukurannya kurang pas?",
        a: "Sampaikan segera. Penyedia akan membantu menyesuaikan sesuai kesepakatan awal.",
      },
    ],
  },

  "Foto & Desain": {
    intro:
      "Layanan foto produk dan desain visual untuk usaha. Hasil akhir dikirim dalam format siap pakai untuk toko online dan media sosial.",
    includes: [
      "Sesi pemotretan atau pengerjaan desain sesuai paket",
      "Penyuntingan dasar (warna dan pencahayaan)",
      "File hasil akhir resolusi tinggi",
    ],
    excludes: [
      "Properti atau produk tambahan di luar paket",
      "Revisi di atas jumlah yang disepakati",
      "Biaya cetak",
    ],
    prepare: [
      "Produk atau brief kebutuhan (nama usaha, warna, gaya)",
      "Contoh gaya yang kamu suka",
      "Tenggat yang diinginkan",
    ],
    payment:
      "DP sebelum pengerjaan dimulai, pelunasan sebelum file akhir dikirim.",
    cancel:
      "Jadwal sesi bisa diubah dengan memberi kabar minimal 1 hari sebelumnya. Pekerjaan yang sudah berjalan tidak dapat dikembalikan DP-nya.",
    warranty:
      "Revisi sesuai jumlah yang tercantum di paket sudah termasuk dalam harga.",
    faqs: [
      {
        q: "Berapa kali bisa revisi?",
        a: "Jumlah revisi tertulis di paket. Revisi tambahan dibahas terpisah.",
      },
      {
        q: "File seperti apa yang saya terima?",
        a: "File siap pakai dengan resolusi tinggi. Format lain, misalnya file sumber, bisa ditanyakan saat konfirmasi.",
      },
      {
        q: "Bolehkah hasilnya dipakai untuk iklan?",
        a: "Hasil dipakai untuk kebutuhan usahamu. Untuk penggunaan khusus seperti iklan besar atau cetak masif, bicarakan dulu dengan penyedia.",
      },
    ],
  },

  Kebersihan: {
    intro:
      "Layanan kebersihan untuk rumah, kos, dan kantor kecil. Petugas membawa perlengkapan dasar dan bekerja sesuai daftar area yang kamu tentukan.",
    includes: [
      "Petugas dan perlengkapan kebersihan dasar",
      "Pembersihan area sesuai kesepakatan",
      "Pembuangan sampah hasil pembersihan ke tempat yang kamu tunjuk",
    ],
    excludes: [
      "Area berisiko tinggi (plafon tinggi, kaca bagian luar gedung)",
      "Perbaikan kerusakan",
      "Bahan pembersih khusus (disepakati dulu)",
    ],
    prepare: [
      "Luas dan jumlah ruangan",
      "Barang berharga disimpan lebih dulu",
      "Air dan listrik tersedia di lokasi",
    ],
    payment:
      "Pembayaran setelah pekerjaan selesai. Transfer bank atau tunai sesuai kesepakatan.",
    cancel:
      "Jadwal bisa diubah dengan memberi kabar minimal beberapa jam sebelum petugas berangkat.",
    warranty:
      "Jika ada area yang terlewat dari daftar yang disepakati, laporkan di hari yang sama agar dibersihkan ulang.",
    faqs: [
      {
        q: "Apakah petugas membawa peralatan sendiri?",
        a: "Ya, perlengkapan dasar dibawa petugas. Untuk kebutuhan khusus, sampaikan saat memesan.",
      },
      {
        q: "Bagaimana jika pekerjaan melebihi durasi paket?",
        a: "Penyedia memberi tahu lebih dulu. Tambahan jam dihitung hanya jika kamu setuju.",
      },
      {
        q: "Apakah bisa berlangganan rutin?",
        a: "Bisa. Tanyakan jadwal mingguan atau bulanan lewat WhatsApp.",
      },
    ],
  },

  Kurir: {
    intro:
      "Layanan antar barang dan makanan dalam kota di hari yang sama. Kamu mendapat kabar saat barang dijemput dan saat tiba di tujuan.",
    includes: [
      "Penjemputan di alamat asal",
      "Pengantaran ke alamat tujuan dalam area layanan",
      "Konfirmasi saat barang diterima",
    ],
    excludes: [
      "Barang terlarang atau berbahaya",
      "Asuransi barang bernilai tinggi (kecuali disepakati)",
      "Pengiriman antar kota",
    ],
    prepare: [
      "Alamat jemput dan alamat tujuan lengkap",
      "Nama dan nomor telepon penerima",
      "Barang sudah dikemas rapi",
    ],
    payment:
      "Bayar tunai ke kurir saat barang dijemput atau diterima, atau transfer sebelum penjemputan, sesuai kesepakatan.",
    cancel: "Pembatalan sebelum barang dijemput tidak dikenakan biaya.",
    warranty:
      "Jika barang rusak atau tidak sampai, laporkan di hari yang sama dengan foto kemasan agar bisa ditindaklanjuti.",
    faqs: [
      {
        q: "Berapa lama pengantarannya?",
        a: "Pengantaran dalam kota dilakukan di hari yang sama. Perkiraan waktu lebih tepat disebutkan saat pesanan dikonfirmasi.",
      },
      {
        q: "Barang apa yang tidak bisa diantar?",
        a: "Barang ilegal, mudah meledak atau terbakar, dan barang yang tidak dikemas dengan layak. Tanyakan dulu jika ragu.",
      },
      {
        q: "Bagaimana jika penerima tidak ada di tempat?",
        a: "Kurir menghubungi penerima dan pengirim. Barang bisa dititipkan hanya atas persetujuan pengirim.",
      },
    ],
  },
};

// ===== DETAIL KHUSUS TIAP USAHA (berdasarkan id di jasa.js) =====
export const jasaDetailById = {
  1: {
    owner: "Bu Ratna",
    completed: 214,
    response: "Biasanya dibalas dalam 1 jam",
    hours: "Senin–Sabtu, 07.00–18.00",
    duration: "Pesan minimal 2 hari sebelum acara",
    minOrder: "Minimal 20 porsi",
    minQty: 20,
    coverage: ["Gubeng", "Tegalsari", "Genteng", "Tambaksari", "Sukolilo"],
    transport:
      "Antar gratis dalam area layanan untuk pesanan besar. Pesanan lebih kecil dikenakan ongkos sesuai jarak.",
    packages: [
      {
        name: "Nasi Kotak Hemat",
        price: 25000,
        unit: "porsi",
        items: ["Nasi putih", "Ayam goreng", "Sayur", "Sambal dan kerupuk"],
      },
      {
        name: "Nasi Kotak Komplit",
        price: 35000,
        unit: "porsi",
        items: [
          "Nasi putih",
          "Ayam atau ikan",
          "2 lauk pendamping",
          "Buah dan air mineral",
        ],
      },
      {
        name: "Tumpeng Mini (10–12 orang)",
        price: 350000,
        unit: "paket",
        items: ["Nasi kuning", "5 jenis lauk", "Urap", "Hiasan tumpeng"],
      },
    ],
  },
  2: {
    owner: "Mas Hendra",
    completed: 530,
    response: "Biasanya dibalas dalam 15 menit",
    hours: "Setiap hari, 07.00–21.00",
    duration: "Dijemput 30–60 menit setelah dikonfirmasi",
    minOrder: "Tanpa minimal pesanan",
    coverage: [
      "Gubeng",
      "Tegalsari",
      "Genteng",
      "Tambaksari",
      "Sukolilo",
      "Wonokromo",
    ],
    transport:
      "Tarif sudah termasuk jemput dan antar. Jarak di atas 10 km dibahas terpisah.",
    packages: [
      {
        name: "Antar 0–5 km",
        price: 10000,
        unit: "pengiriman",
        items: [
          "Jemput di alamat asal",
          "Antar ke tujuan",
          "Konfirmasi saat diterima",
        ],
      },
      {
        name: "Antar 5–10 km",
        price: 18000,
        unit: "pengiriman",
        items: [
          "Jemput di alamat asal",
          "Antar ke tujuan",
          "Konfirmasi saat diterima",
        ],
      },
      {
        name: "Titip beli lalu antar",
        price: 15000,
        unit: "pesanan",
        items: [
          "Belanja sesuai daftar",
          "Antar ke alamatmu",
          "Harga barang dibayar terpisah",
        ],
      },
    ],
  },
  3: {
    owner: "Pak Dani",
    completed: 176,
    response: "Biasanya dibalas dalam 1–2 jam",
    hours: "Senin–Sabtu, 08.00–17.00",
    duration:
      "Cuci AC sekitar 45–60 menit per unit; kunjungan 1–2 hari setelah pesan",
    minOrder: "Tanpa minimal pesanan",
    coverage: ["Klojen", "Lowokwaru", "Blimbing", "Sukun", "Kedungkandang"],
    transport:
      "Biaya kunjungan di dalam area layanan sudah termasuk. Di luar area dibahas saat konfirmasi.",
    warranty: "Garansi pekerjaan 7 hari untuk keluhan yang sama.",
    packages: [
      {
        name: "Cuci AC (hingga 1 PK)",
        price: 75000,
        unit: "unit",
        items: [
          "Cuci indoor dan outdoor",
          "Pembersihan filter",
          "Uji fungsi setelah selesai",
        ],
      },
      {
        name: "Cuci AC + cek freon",
        price: 120000,
        unit: "unit",
        items: [
          "Semua isi paket cuci AC",
          "Pengecekan tekanan freon",
          "Laporan kondisi AC",
        ],
      },
      {
        name: "Isi freon",
        price: 250000,
        unit: "unit",
        items: [
          "Pengisian freon sesuai jenis AC",
          "Pengecekan kebocoran dasar",
          "Uji pendinginan",
        ],
      },
    ],
  },
  4: {
    owner: "Mbak Sri",
    completed: 98,
    response: "Biasanya dibalas dalam 2 jam",
    hours: "Senin–Sabtu, 08.00–16.00",
    duration: "Permak 2–3 hari; kebaya 10–14 hari",
    minOrder: "Tanpa minimal pesanan",
    coverage: [
      "Pekalongan Timur",
      "Pekalongan Barat",
      "Pekalongan Utara",
      "Pekalongan Selatan",
    ],
    transport:
      "Layanan di tempat usaha. Antar-jemput pakaian bisa ditanyakan terpisah.",
    packages: [
      {
        name: "Permak (ubah ukuran)",
        price: 50000,
        unit: "potong",
        items: [
          "Pengukuran ulang",
          "Pengerjaan permak",
          "Finishing dan setrika",
        ],
      },
      {
        name: "Jahit seragam",
        price: 120000,
        unit: "potong",
        items: [
          "Pengukuran badan",
          "Jahit sesuai model",
          "Kain dari pelanggan",
        ],
      },
      {
        name: "Jahit kebaya",
        price: 350000,
        unit: "potong",
        items: [
          "Pengukuran badan",
          "Fitting sebelum finishing",
          "Kain dari pelanggan",
        ],
      },
    ],
  },
  5: {
    owner: "Kak Rina",
    completed: 142,
    response: "Biasanya dibalas dalam 1 jam",
    hours: "Senin–Sabtu, 09.00–17.00 (dengan janji temu)",
    duration: "Sesi 1–2 jam; hasil edit dikirim 2–3 hari kerja",
    minOrder: "Minimal 1 sesi",
    coverage: ["Coblong", "Bandung Wetan", "Sukajadi", "Cicendo"],
    transport:
      "Pemotretan di studio. Pemotretan di lokasi usahamu dibahas terpisah.",
    packages: [
      {
        name: "Basic",
        price: 150000,
        unit: "sesi",
        items: ["5 foto terpilih", "Latar polos", "Edit dasar"],
      },
      {
        name: "Standard",
        price: 275000,
        unit: "sesi",
        items: ["10 foto terpilih", "Latar polos", "Edit warna dan cahaya"],
      },
      {
        name: "Plus",
        price: 450000,
        unit: "sesi",
        items: ["20 foto terpilih", "2 variasi latar", "Edit warna dan cahaya"],
      },
    ],
  },
  6: {
    owner: "Bu Wati",
    completed: 260,
    response: "Biasanya dibalas dalam 30 menit",
    hours: "Setiap hari, 07.00–17.00",
    duration: "Durasi menyesuaikan luas ruangan, mulai 3 jam",
    minOrder: "Minimal 3 jam",
    minQty: 1,
    coverage: [
      "Kebayoran Baru",
      "Kebayoran Lama",
      "Cilandak",
      "Setiabudi",
      "Mampang Prapatan",
    ],
    transport: "Biaya transport petugas di dalam area layanan sudah termasuk.",
    packages: [
      {
        name: "Reguler 3 jam (1 petugas)",
        price: 80000,
        unit: "sesi",
        items: [
          "Menyapu dan mengepel",
          "Membersihkan kamar mandi",
          "Merapikan ruangan",
        ],
      },
      {
        name: "Reguler 6 jam (1 petugas)",
        price: 150000,
        unit: "sesi",
        items: [
          "Semua isi paket 3 jam",
          "Membersihkan dapur",
          "Membersihkan kaca dalam",
        ],
      },
      {
        name: "Bersih menyeluruh 8 jam (2 petugas)",
        price: 350000,
        unit: "sesi",
        items: [
          "Semua area rumah",
          "Dapur dan kamar mandi detail",
          "Cocok untuk pindahan",
        ],
      },
    ],
  },
  7: {
    owner: "Daeng Ari",
    completed: 310,
    response: "Biasanya dibalas dalam 15 menit",
    hours: "Setiap hari, 07.00–21.00",
    duration: "Dijemput 30–60 menit setelah dikonfirmasi",
    minOrder: "Tanpa minimal pesanan",
    coverage: ["Panakkukang", "Tamalate", "Rappocini", "Manggala", "Makassar"],
    transport:
      "Tarif sudah termasuk jemput dan antar. Jarak di atas 10 km dibahas terpisah.",
    packages: [
      {
        name: "Antar 0–5 km",
        price: 12000,
        unit: "pengiriman",
        items: [
          "Jemput di alamat asal",
          "Antar ke tujuan",
          "Konfirmasi saat diterima",
        ],
      },
      {
        name: "Antar 5–10 km",
        price: 20000,
        unit: "pengiriman",
        items: [
          "Jemput di alamat asal",
          "Antar ke tujuan",
          "Konfirmasi saat diterima",
        ],
      },
    ],
  },
  8: {
    owner: "Kak Lina",
    completed: 187,
    response: "Biasanya dibalas dalam 1 jam",
    hours: "Senin–Sabtu, 07.00–17.00",
    duration: "Pesan minimal 1 hari sebelumnya",
    minOrder: "Minimal 10 porsi",
    minQty: 10,
    coverage: [
      "Medan Petisah",
      "Medan Baru",
      "Medan Sunggal",
      "Medan Polonia",
      "Medan Maimun",
    ],
    transport:
      "Antar gratis dalam area layanan untuk pesanan besar. Pesanan kecil dikenakan ongkos sesuai jarak.",
    packages: [
      {
        name: "Paket Makan Siang",
        price: 30000,
        unit: "porsi",
        items: ["Nasi", "Lauk utama", "Sayur", "Sambal khas"],
      },
      {
        name: "Nasi Box Premium",
        price: 45000,
        unit: "porsi",
        items: [
          "Nasi",
          "2 lauk utama",
          "Sayur dan sambal",
          "Buah dan air mineral",
        ],
      },
    ],
  },
  9: {
    owner: "Pak Wayan",
    completed: 420,
    response: "Biasanya dibalas dalam 1 jam",
    hours: "Senin–Sabtu, 08.00–17.00",
    duration: "Servis rutin 45–60 menit; antrean sesuai urutan datang",
    minOrder: "Tanpa minimal pesanan",
    coverage: [
      "Denpasar Selatan",
      "Denpasar Barat",
      "Denpasar Timur",
      "Denpasar Utara",
    ],
    transport:
      "Layanan di bengkel. Oli dan suku cadang dihitung terpisah dari harga jasa.",
    warranty: "Garansi pekerjaan 7 hari untuk keluhan yang sama.",
    packages: [
      {
        name: "Servis rutin (jasa ganti oli)",
        price: 40000,
        unit: "unit",
        items: [
          "Pengecekan umum",
          "Ganti oli (oli dibayar terpisah)",
          "Pengecekan rem dan rantai",
        ],
      },
      {
        name: "Tune up",
        price: 85000,
        unit: "unit",
        items: [
          "Pembersihan karburator atau injektor",
          "Penyetelan mesin",
          "Pengecekan busi",
        ],
      },
      {
        name: "Servis CVT motor matic",
        price: 120000,
        unit: "unit",
        items: ["Pembersihan CVT", "Pengecekan roller dan belt", "Uji jalan"],
      },
    ],
  },
  10: {
    owner: "Mas Bagas",
    completed: 64,
    response: "Biasanya dibalas dalam 3 jam",
    hours: "Senin–Jumat, 09.00–17.00",
    duration: "Konsep awal 3 hari kerja; tiap revisi 1–2 hari",
    minOrder: "Minimal 1 paket",
    coverage: ["Seluruh Indonesia (online)"],
    transport:
      "Layanan online. Seluruh komunikasi dan pengiriman file lewat WhatsApp atau email.",
    packages: [
      {
        name: "Logo Basic",
        price: 200000,
        unit: "paket",
        items: ["2 konsep logo", "2 kali revisi", "File PNG dan JPG"],
      },
      {
        name: "Logo + Kartu Nama",
        price: 350000,
        unit: "paket",
        items: [
          "2 konsep logo",
          "2 kali revisi",
          "Desain kartu nama siap cetak",
        ],
      },
      {
        name: "Identitas Visual",
        price: 750000,
        unit: "paket",
        items: [
          "Logo dan variasinya",
          "Palet warna dan font",
          "Panduan penggunaan singkat",
        ],
      },
    ],
  },
  11: {
    owner: "Cut Rina",
    completed: 73,
    response: "Biasanya dibalas dalam 2 jam",
    hours: "Senin–Sabtu, 09.00–16.00",
    duration: "Busana songket 14–21 hari",
    minOrder: "Tanpa minimal pesanan",
    coverage: [
      "Kuta Alam",
      "Baiturrahman",
      "Banda Raya",
      "Syiah Kuala",
      "Lueng Bata",
    ],
    transport:
      "Layanan di tempat usaha. Antar-jemput pakaian bisa ditanyakan terpisah.",
    packages: [
      {
        name: "Permak busana songket",
        price: 120000,
        unit: "potong",
        items: ["Pengukuran ulang", "Pengerjaan permak hati-hati", "Finishing"],
      },
      {
        name: "Jahit atasan songket",
        price: 250000,
        unit: "potong",
        items: [
          "Pengukuran badan",
          "Jahit sesuai model",
          "Kain dari pelanggan",
        ],
      },
      {
        name: "Jahit setelan songket",
        price: 450000,
        unit: "setelan",
        items: [
          "Atasan dan bawahan",
          "Fitting sebelum finishing",
          "Kain dari pelanggan",
        ],
      },
    ],
  },
};

// Menggabungkan informasi umum jenis jasa dengan detail khusus usaha
export function getJasaDetail(item) {
  const base = jasaCategoryInfo[item.category] ?? {};
  const own = jasaDetailById[item.id] ?? {};
  return {
    owner: "Pemilik usaha",
    completed: 0,
    response: "Dibalas pada jam layanan",
    hours: "Tanyakan lewat WhatsApp",
    duration: "Dibahas saat konfirmasi",
    minOrder: "Tanpa minimal pesanan",
    minQty: 1,
    coverage: [item.district],
    transport: "Biaya transport atau antar dibahas saat konfirmasi pesanan.",
    warranty: base.warranty,
    whatsapp: WA_CONTOH,
    packages: [{ name: "Layanan standar", price: 0, unit: "sesi", items: [] }],
    ...base,
    ...own,
  };
}
