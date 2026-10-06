<script setup>
import { ref } from "vue";

const failed = ref(false);
</script>

<template>
  <main class="nf">
    <div class="wrap">
      <img
        v-if="!failed"
        class="art"
        src="/images/404-aruna.png"
        alt="Error 404, halaman tidak ditemukan"
        @error="failed = true"
      />
      <p v-else class="big" aria-hidden="true">404</p>

      <h1>Halaman tidak ditemukan</h1>
      <p class="desc">
        Alamat yang kamu buka tidak tersedia atau sudah dipindahkan. Periksa
        kembali penulisan alamatnya, atau kembali ke beranda ARUNA.
      </p>

      <div class="actions">
        <RouterLink to="/" class="btn solid">Kembali ke Beranda</RouterLink>
        <RouterLink to="/produk" class="btn ghost"
          >Lihat Semua Produk</RouterLink
        >
      </div>
    </div>
  </main>
</template>

<style scoped>
.nf {
  min-height: 70vh;
  display: grid;
  align-items: center;
  padding: 56px 0;
  background: linear-gradient(110deg, #f4f9ff, #e4f1ff);
}
.wrap {
  width: 85.5%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.art {
  display: block;
  width: min(520px, 100%);
  height: auto;
  margin: 0 auto 24px;
}
.big {
  margin-bottom: 8px;
  color: #0865d8;
  font-size: clamp(96px, 18vw, 180px);
  font-weight: 800;
  letter-spacing: -4px;
  line-height: 1;
}

h1 {
  color: #142d4e;
  font-size: clamp(26px, 3.4vw, 38px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.2;
}
.desc {
  max-width: 34em;
  margin: 12px auto 0;
  color: #647994;
  font-size: 15px;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
.btn {
  height: 46px;
  padding: 0 26px;
  display: inline-flex;
  align-items: center;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #0865d8;
  transition: background 0.2s;
}
.solid {
  background: #0865d8;
  color: #fff;
}
.solid:hover {
  background: #0754b5;
}
.ghost {
  background: #fff;
  color: #0865d8;
}
.ghost:hover {
  background: #eaf4ff;
}

@media (max-width: 650px) {
  .wrap {
    width: 88%;
  }
}
</style>
