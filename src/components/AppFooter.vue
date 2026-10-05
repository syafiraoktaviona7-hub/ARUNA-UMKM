<script setup>
const columns = [
  {
    title: "Jelajahi",
    links: [
      { label: "Kategori", to: "/#kategori" },
      { label: "Jelajahi Produk", to: "/#umkm" },
      { label: "Jelajahi Jasa", to: "/#jasa" },
      { label: "Cara kerja", to: "/#carakerja" },
      { label: "Artikel", to: "/#artikel" },
    ],
  },
  {
    title: "Untuk penjual",
    links: [
      { label: "Daftarkan UMKM", to: "/#penjual" },
      { label: "Masuk ke toko", to: "/" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pertanyaan umum", to: "/#faq" },
      { label: "Hubungi kami", to: "/" },
      { label: "Kebijakan privasi", to: "/" },
    ],
  },
];
</script>

<template>
  <footer class="footer">
    <div class="wrap top">
      <div class="brand">
        <strong>ARUNA</strong>
        <p>
          Marketplace yang menghubungkan kamu dengan UMKM terdekat di seluruh
          Indonesia.
        </p>
      </div>

      <nav
        v-for="col in columns"
        :key="col.title"
        class="col"
        :aria-label="col.title"
      >
        <h3>{{ col.title }}</h3>
        <RouterLink v-for="l in col.links" :key="l.label" :to="l.to">{{
          l.label
        }}</RouterLink>
      </nav>
    </div>

    <div class="wrap bottom">© 2026 ARUNA. Marketplace UMKM Indonesia.</div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 56px 0 24px;
  background: #0f2744;
  color: #c9d6e8;
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}
.top {
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 40px;
  padding-bottom: 40px;
}
.brand strong {
  color: #fff;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.brand p {
  margin-top: 12px;
  max-width: 24em;
  font-size: 13px;
  line-height: 1.8;
}
.col {
  display: grid;
  gap: 10px;
  align-content: start;
}
.col h3 {
  margin-bottom: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.col a {
  font-size: 13px;
}
.col a:hover {
  color: #fff;
  text-decoration: underline;
}
.bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
}
@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr 1fr;
  }
  .brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 650px) {
  .wrap {
    width: 88%;
  }
}
@media (max-width: 480px) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
