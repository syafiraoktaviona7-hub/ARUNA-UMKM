<script setup>
import { ref, computed } from "vue";

// Foto bagian ini. Taruh filenya di public/images/pertanyaan.png
const photo = ref("/images/Pertanyaan.png");
const photoFailed = ref(false);

// Nomor WhatsApp tim ARUNA. GANTI dengan nomor yang asli (format 62812..., tanpa +)
const WA_ADMIN = "6280000000000";
const contactHref =
  `https://wa.me/${WA_ADMIN}?text=` +
  encodeURIComponent("Halo tim ARUNA, saya ingin bertanya");

const tabs = [
  { key: "pembeli", label: "Untuk Pembeli" },
  { key: "penjual", label: "Untuk Penjual UMKM" },
];

// Draf jawaban. Sesuaikan dengan kebijakan ARUNA yang sebenarnya.
const faqs = {
  pembeli: [
    {
      q: "Apa itu ARUNA dan apa bedanya dengan marketplace lain?",
      a: "ARUNA adalah platform yang mempertemukan pembeli dengan UMKM berdasarkan wilayah. Kamu bisa menemukan produk dan jasa dari pelaku usaha di provinsi, kota, bahkan kecamatanmu sendiri, lalu menghubungi pembuatnya secara langsung.",
    },
    {
      q: "Bagaimana cara mencari produk atau jasa di daerahku?",
      a: "Gunakan filter wilayah di bagian atas halaman: pilih provinsi, lalu kota atau kabupaten, lalu kecamatan. Daftar produk dan jasa langsung menyesuaikan. Kamu juga bisa mempersempit hasil lewat kategori, kolom pencarian, dan filter harga di halaman Semua Produk.",
    },
    {
      q: "Bagaimana cara memesan?",
      a: "Tekan ikon keranjang pada produk untuk memasukkannya ke keranjang, lalu buka keranjang dan pilih Pesan via WhatsApp atau Pesan Online. Kamu juga bisa langsung menghubungi penjual lewat tombol WhatsApp di kartu produk untuk menanyakan stok, varian, atau harga.",
    },
    {
      q: "Apakah semua UMKM menyediakan pengantaran?",
      a: "Tidak. Setiap UMKM punya cara layanan sendiri: ada yang mengantar, ada yang hanya melayani ambil di tempat. Tanyakan opsi pengiriman dan ongkosnya kepada penjual sebelum memesan.",
    },
    {
      q: "Bagaimana cara pembayarannya?",
      a: "Cara pembayaran mengikuti kesepakatan dengan penjual, misalnya transfer atau bayar saat barang diterima. Pastikan kamu sudah sepakat soal total harga, ongkos kirim, dan metode bayar sebelum mengirim uang.",
    },
    {
      q: "Bagaimana memastikan penjual bisa dipercaya?",
      a: "Periksa nama toko dan lokasi usaha pada kartu produk, tanyakan detail produk lewat WhatsApp, dan minta foto atau video tambahan bila perlu. Untuk pembelian pertama, mulailah dari jumlah kecil dan hindari membayar di luar kesepakatan yang sudah jelas.",
    },
    {
      q: "Apa yang harus dilakukan jika ada masalah dengan pesanan?",
      a: "Hubungi penjual lebih dulu lewat WhatsApp dengan menyertakan foto atau bukti pesanan. Jika belum selesai, hubungi tim ARUNA lewat tombol Hubungi Kami di bagian ini.",
    },
  ],
  penjual: [
    {
      q: "Bagaimana cara mendaftarkan UMKM saya?",
      a: "Klik Daftar di pojok kanan atas, pilih peran sebagai penjual UMKM, lalu lengkapi data usaha dan lokasimu. Setelah akunmu aktif, kamu bisa mulai menambahkan produk atau jasa.",
    },
    {
      q: "Apa saja yang perlu saya siapkan sebelum mendaftar?",
      a: "Siapkan nama usaha, wilayah usaha (provinsi sampai kecamatan), nomor WhatsApp aktif, foto produk yang jelas, deskripsi singkat, dan harga. Semakin lengkap datanya, semakin mudah pembeli percaya dan menghubungimu.",
    },
    {
      q: "Apakah saya bisa menjual jasa, bukan hanya produk?",
      a: "Bisa. Selain produk, ARUNA menampilkan jasa UMKM seperti katering, servis, jahit, foto dan desain, kebersihan, dan kurir di bagian Jelajahi Jasa.",
    },
    {
      q: "Bagaimana pembeli menghubungi saya?",
      a: "Pembeli menghubungimu lewat tombol WhatsApp pada produkmu. Pastikan nomornya aktif dan ditulis dengan awalan 62 tanpa tanda plus, misalnya 62812xxxxxxx, supaya tombolnya langsung terhubung.",
    },
    {
      q: "Bagaimana agar produk saya lebih mudah ditemukan?",
      a: "Isi lokasi usaha dengan benar sampai tingkat kecamatan, pilih kategori yang sesuai, dan tulis nama produk yang jelas. Pembeli mencari berdasarkan wilayah, jadi data lokasi yang akurat sangat membantu.",
    },
    {
      q: "Bagaimana cara menentukan harga yang tepat?",
      a: "Hitung dulu modal bahan, tenaga, kemasan, dan biaya lain, baru tambahkan keuntungan yang wajar, lalu bandingkan dengan produk sejenis di sekitarmu. Panduan lengkapnya ada di artikel tentang menentukan harga jual di bagian Artikel.",
    },
    {
      q: "Foto seperti apa yang disarankan untuk produk saya?",
      a: "Pakai cahaya alami, latar yang sederhana, dan ambil produk dari beberapa sudut, termasuk satu foto dekat untuk memperlihatkan detailnya. Tipsnya ada di artikel tentang memotret produk makanan.",
    },
  ],
};

const tab = ref("pembeli");
const open = ref(0);

const list = computed(() => faqs[tab.value]);

function setTab(key) {
  tab.value = key;
  open.value = 0;
}

const toggle = (i) => {
  open.value = open.value === i ? -1 : i;
};
</script>

<template>
  <section id="faq" class="faq">
    <div class="wrap grid">
      <!-- KIRI -->
      <div class="side">
        <span class="pill">
          <span class="pill-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"
              />
            </svg>
          </span>
          Pusat Bantuan
        </span>

        <h2>Pertanyaan yang <span>sering diajukan</span></h2>
        <p class="sub">
          Jawaban singkat untuk pembeli dan pelaku UMKM, mulai dari cara mencari
          hingga cara berjualan di ARUNA.
        </p>

        <figure v-if="!photoFailed" class="photo">
          <img
            :src="photo"
            alt="Ilustrasi pusat bantuan ARUNA"
            loading="lazy"
            @error="photoFailed = true"
          />
        </figure>

        <div class="help">
          <div class="help-text">
            <strong>Belum menemukan jawabannya?</strong>
            <span>Tim ARUNA siap membantu kamu.</span>
          </div>
          <a
            :href="contactHref"
            target="_blank"
            rel="noopener"
            class="help-btn"
          >
            Hubungi Kami
          </a>
        </div>
      </div>

      <!-- KANAN -->
      <div class="main">
        <div class="tabs" role="tablist" aria-label="Kelompok pertanyaan">
          <button
            v-for="t in tabs"
            :key="t.key"
            type="button"
            role="tab"
            class="tab"
            :class="{ on: tab === t.key }"
            :aria-selected="tab === t.key"
            @click="setTab(t.key)"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="list" role="tabpanel">
          <div
            v-for="(f, i) in list"
            :key="tab + i"
            class="item"
            :class="{ open: open === i }"
          >
            <h3>
              <button
                type="button"
                class="q"
                :aria-expanded="open === i"
                :aria-controls="`faq-${tab}-${i}`"
                @click="toggle(i)"
              >
                <span class="q-num">{{ i + 1 }}</span>
                <span class="q-text">{{ f.q }}</span>
                <span class="q-icon" aria-hidden="true"></span>
              </button>
            </h3>

            <div :id="`faq-${tab}-${i}`" class="a" role="region">
              <div class="a-inner">
                <p>{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 80px 0;
  background: linear-gradient(180deg, #fff, #f4f9ff);
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}
.grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 56px;
  align-items: start;
}

/* KIRI */
.side {
  align-self: start;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  margin-bottom: 16px;
  border: 1px solid #cfe3fb;
  border-radius: 30px;
  background: linear-gradient(110deg, #eaf4ff, #fff);
  color: #0a4fa8;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(8, 101, 216, 0.08);
}
.pill-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #0865d8, #3b95f5);
  color: #fff;
}
.pill-icon svg {
  width: 15px;
  height: 15px;
}

.side h2 {
  color: #142d4e;
  font-size: clamp(30px, 3.4vw, 46px);
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.15;
}
.side h2 span {
  color: #0865d8;
}
.sub {
  max-width: 30em;
  margin: 12px 0 24px;
  color: #647994;
  font-size: 15px;
  line-height: 1.8;
}

/* FOTO: memenuhi lebar kolom, rasio asli, tanpa pita kosong */
.photo {
  margin: 0 0 22px;
  overflow: hidden;
  border-radius: 20px;
  background: #e4f1ff;
  box-shadow: 0 14px 34px rgba(36, 91, 153, 0.16);
}
.photo img {
  display: block;
  width: 100%;
  height: auto;
}

.help {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border-radius: 16px;
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
  color: #fff;
}
.help-text {
  display: grid;
  gap: 2px;
}
.help-text strong {
  font-size: 15px;
  font-weight: 700;
}
.help-text span {
  font-size: 13px;
  opacity: 0.9;
}
.help-btn {
  padding: 10px 20px;
  border-radius: 10px;
  background: #fff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s;
}
.help-btn:hover {
  background: #eaf4ff;
}

/* TAB: jarak diperlebar */
.tabs {
  display: inline-flex;
  gap: 10px;
  padding: 6px;
  margin-bottom: 22px;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(36, 91, 153, 0.06);
}
.tab {
  padding: 11px 26px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #5c718a;
  font-size: 13px;
  font-weight: 600;
  transition:
    background 0.2s,
    color 0.2s;
}
.tab:hover {
  color: #0865d8;
}
.tab.on {
  background: linear-gradient(135deg, #0865d8, #3b95f5);
  color: #fff;
  box-shadow: 0 6px 14px rgba(8, 101, 216, 0.25);
}

/* AKORDEON */
.list {
  display: grid;
  gap: 12px;
}
.item {
  overflow: hidden;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(36, 91, 153, 0.05);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.item.open {
  border-color: #0865d8;
  box-shadow: 0 10px 26px rgba(8, 101, 216, 0.12);
}

.q {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: none;
  background: transparent;
  color: #142d4e;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
}
.q:hover .q-text {
  color: #0865d8;
}
.q-num {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 800;
}
.item.open .q-num {
  background: #0865d8;
  color: #fff;
}
.q-text {
  flex: 1;
  transition: color 0.2s;
}

.q-icon {
  position: relative;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eaf4ff;
}
.q-icon::before,
.q-icon::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 2px;
  margin: -1px 0 0 -6px;
  border-radius: 2px;
  background: #0865d8;
  transition: transform 0.25s ease;
}
.q-icon::after {
  transform: rotate(90deg);
}
.item.open .q-icon::after {
  transform: rotate(0deg);
}

.a {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows 0.3s ease,
    visibility 0.3s;
}
.item.open .a {
  grid-template-rows: 1fr;
  visibility: visible;
}
.a-inner {
  min-height: 0;
  overflow: hidden;
}
.a-inner p {
  padding: 0 20px 20px 60px;
  color: #526982;
  font-size: 14px;
  line-height: 1.85;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 650px) {
  .faq {
    padding: 56px 0;
  }
  .wrap {
    width: 88%;
  }
  .tabs {
    display: flex;
    width: 100%;
    gap: 8px;
  }
  .tab {
    flex: 1;
    padding: 11px 10px;
    font-size: 12px;
  }
  .q {
    padding: 14px;
    gap: 10px;
    font-size: 14px;
  }
  .a-inner p {
    padding: 0 16px 18px 16px;
  }
}
</style>
