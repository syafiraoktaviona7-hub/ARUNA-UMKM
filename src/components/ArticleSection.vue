<script setup>
const articles = [
  {
    title: "Cara memotret produk makanan agar terlihat menarik",
    excerpt:
      "Cahaya alami, latar sederhana, dan satu sudut pengambilan sudah cukup untuk foto produk yang menggugah.",
    tag: "Tips Usaha",
    time: "4 menit baca",
    image: "/images/kategori-makanan.jpg",
  },
  {
    title: "Menentukan harga jual yang adil untuk UMKM",
    excerpt:
      "Hitung modal bahan, tenaga, dan kemasan dulu sebelum menambahkan keuntungan yang masuk akal.",
    tag: "Keuangan",
    time: "5 menit baca",
    image: "/images/kategori-fashion.jpg",
  },
  {
    title: "Kenapa belanja dari UMKM sekitar berdampak besar",
    excerpt:
      "Uang yang kamu belanjakan di usaha lokal berputar kembali di lingkunganmu sendiri.",
    tag: "Komunitas",
    time: "3 menit baca",
    image: "/images/kategori-home-decor.jpg",
  },
];
</script>

<template>
  <section id="artikel" class="articles">
    <div class="wrap">
      <div class="head">
        <h2>Artikel untuk pembeli dan pelaku UMKM</h2>
        <a href="#" class="more">Lihat semua artikel</a>
      </div>

      <div class="grid">
        <a v-for="a in articles" :key="a.title" href="#" class="card">
          <img :src="a.image" :alt="a.title" loading="lazy" />
          <div class="body">
            <span class="meta">{{ a.tag }} · {{ a.time }}</span>
            <h3>{{ a.title }}</h3>
            <p>{{ a.excerpt }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.articles {
  padding: 80px 0;
  background: #f4f9ff;
}
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}
h2 {
  color: #142d4e;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  max-width: 16em;
}
.more {
  color: #0865d8;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.more:hover {
  text-decoration: underline;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 16px;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 12px 28px rgba(36, 91, 153, 0.12);
}
.card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  background: #e9f1f8;
}
.body {
  padding: 20px;
  display: grid;
  gap: 8px;
}
.meta {
  color: #0865d8;
  font-size: 12px;
  font-weight: 600;
}
.body h3 {
  color: #142d4e;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
}
.body p {
  color: #647994;
  font-size: 13px;
  line-height: 1.7;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 650px) {
  .articles {
    padding: 56px 0;
  }
  .head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
