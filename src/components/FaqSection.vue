<script setup>
const faqs = [
  {
    q: "Apa itu ARUNA?",
    a: "ARUNA adalah marketplace yang membantu kamu menemukan produk dan toko UMKM berdasarkan wilayah, mulai dari provinsi sampai kecamatan.",
  },
  {
    q: "Bagaimana cara mencari UMKM di daerahku?",
    a: "Pilih provinsi, kota atau kabupaten, lalu kecamatan pada bagian filter wilayah. Daftar UMKM di bawahnya langsung menyesuaikan. Kamu juga bisa mempersempit hasil dengan kategori atau kata kunci.",
  },
  {
    q: "Apakah semua UMKM menyediakan pengantaran?",
    a: "Tidak. Sebagian UMKM hanya melayani ambil di tempat. Opsi yang tersedia akan terlihat di profil masing-masing toko.",
  },
  {
    q: "Bagaimana cara mendaftarkan UMKM saya?",
    a: "Klik tombol Daftar, lalu lengkapi data usaha dan lokasimu. Setelah tokomu aktif, kamu bisa menambahkan produk.",
  },
  {
    q: "Apakah produk di ARUNA benar-benar buatan lokal?",
    a: "ARUNA berfokus pada produk karya pelaku UMKM Indonesia. Karena itu kami menampilkan lokasi usaha di setiap kartu UMKM.",
  },
];
</script>

<template>
  <section id="faq" class="faq">
    <div class="wrap grid">
      <div class="intro">
        <h2>Pertanyaan yang sering diajukan</h2>
        <p>Belum menemukan jawabannya? Hubungi tim ARUNA kapan saja.</p>
      </div>

      <div class="list">
        <details v-for="f in faqs" :key="f.q" class="item">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 80px 0;
  background: #fff;
}
.grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 56px;
  align-items: start;
}
h2 {
  color: #142d4e;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
}
.intro p {
  margin-top: 12px;
  color: #647994;
  font-size: 15px;
  line-height: 1.7;
}
.list {
  display: grid;
  gap: 12px;
}
.item {
  background: #f4f9ff;
  border: 1px solid #e2ecf8;
  border-radius: 12px;
}
summary {
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  list-style: none;
  cursor: pointer;
  color: #142d4e;
  font-size: 15px;
  font-weight: 600;
}
summary::-webkit-details-marker {
  display: none;
}
summary::after {
  content: "+";
  flex-shrink: 0;
  color: #0865d8;
  font-size: 22px;
  line-height: 1;
}
.item[open] summary::after {
  content: "–";
}
.item p {
  padding: 0 22px 20px;
  color: #647994;
  font-size: 14px;
  line-height: 1.8;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 650px) {
  .faq {
    padding: 56px 0;
  }
}
</style>
