<script setup>
const perks = [
  "Tokomu tampil di pencarian berdasarkan wilayah",
  "Cocok untuk usaha dengan pengantaran maupun hanya ambil di tempat",
  "Tampilkan produk dan lokasi usahamu dalam satu halaman",
];
</script>

<template>
  <section id="penjual" class="cta">
    <div class="wrap inner">
      <div>
        <h2>Punya usaha? Daftarkan UMKM-mu di ARUNA.</h2>
        <p>Biarkan warga di sekitarmu menemukan produkmu.</p>
        <a href="#" class="btn">Daftar sebagai penjual</a>
      </div>

      <ul class="perks">
        <li v-for="p in perks" :key="p">
          <span class="check" aria-hidden="true">✓</span>
          {{ p }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 64px 0;
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
  color: #fff;
}
.inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  align-items: center;
}
h2 {
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
}
p {
  margin-top: 10px;
  font-size: 15px;
  opacity: 0.9;
}
.btn {
  display: inline-block;
  margin-top: 24px;
  padding: 14px 28px;
  border-radius: 10px;
  background: #fff;
  color: #0865d8;
  font-size: 14px;
  font-weight: 700;
}
.btn:hover {
  background: #eaf4ff;
}
.perks {
  list-style: none;
  display: grid;
  gap: 14px;
}
.perks li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}
.check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 800;
}
@media (max-width: 900px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 650px) {
  .cta {
    padding: 48px 0;
  }
}
</style>
