<script setup>
const steps = [
  {
    title: "Pilih wilayahmu",
    text: "Tentukan provinsi, kota, dan kecamatan untuk melihat UMKM yang paling dekat denganmu.",
  },
  {
    title: "Temukan produknya",
    text: "Telusuri berdasarkan kategori atau cari nama produk dan toko. Setiap UMKM menampilkan lokasi dan jenis usahanya.",
  },
  {
    title: "Pesan sesuai kebutuhan",
    text: "Hubungi UMKM, lalu pilih ambil sendiri di tempat atau minta diantar. Tidak semua UMKM menyediakan pengantaran, jadi cek opsinya di profil toko.",
  },
];
</script>

<template>
  <section id="carakerja" class="how">
    <div class="wrap">
      <div class="head">
        <h2>Belanja dari UMKM sekitar dalam 3 langkah</h2>
        <p>Tanpa perantara. Kamu bertemu langsung dengan pembuat produknya.</p>
      </div>

      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.title" class="step">
          <span class="num">{{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how {
  padding: 80px 0;
  background: #f4f9ff;
}
.head {
  max-width: 620px;
  margin-bottom: 40px;
}
h2 {
  color: #142d4e;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
}
.head p {
  margin-top: 10px;
  color: #647994;
  font-size: 15px;
  line-height: 1.7;
}
.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.step {
  padding: 28px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 16px;
}
.num {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 50%;
  background: #0865d8;
  color: #fff;
  font-weight: 700;
}
.step h3 {
  color: #142d4e;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.step p {
  color: #647994;
  font-size: 14px;
  line-height: 1.75;
}
@media (max-width: 900px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 650px) {
  .how {
    padding: 56px 0;
  }
}
</style>
