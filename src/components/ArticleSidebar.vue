<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { articles } from "@/data/articles";

const props = defineProps({
  currentId: { type: Number, default: 0 },
});

const slides = [
  {
    title: "Daftarkan UMKM-mu di ARUNA",
    text: "Biarkan warga di sekitarmu menemukan produkmu.",
    cta: "Daftar sebagai penjual",
    to: "/register",
  },
  {
    title: "Temukan UMKM terdekat",
    text: "Pilih provinsi, kota, dan kecamatan untuk melihat usaha di sekitarmu.",
    cta: "Jelajahi UMKM",
    to: "/produk",
  },
  {
    title: "Dukung produk lokal",
    text: "Setiap pembelian membantu usaha kecil tetap berjalan.",
    cta: "Lihat kategori",
    to: "/#kategori",
  },
];

const index = ref(0);
const go = (i) => {
  index.value = (i + slides.length) % slides.length;
};

let timer;
onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) timer = setInterval(() => go(index.value + 1), 5000);
});
onUnmounted(() => clearInterval(timer));

const latest = computed(() =>
  articles.filter((a) => a.id !== props.currentId).slice(0, 5),
);
</script>

<template>
  <aside class="side">
    <div class="promo">
      <div class="track" :style="{ transform: `translateX(-${index * 100}%)` }">
        <div
          v-for="(s, i) in slides"
          :key="s.title"
          class="slide"
          :class="`s${i}`"
          :inert="i !== index"
        >
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <RouterLink :to="s.to" class="cta">{{ s.cta }}</RouterLink>
        </div>
      </div>
    </div>

    <div class="controls">
      <div class="dots">
        <button
          v-for="(s, i) in slides"
          :key="s.title"
          type="button"
          class="dot"
          :class="{ on: i === index }"
          :aria-label="`Tampilkan banner ${i + 1}`"
          @click="go(i)"
        ></button>
      </div>
      <div class="arrows">
        <button
          type="button"
          aria-label="Banner sebelumnya"
          @click="go(index - 1)"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Banner berikutnya"
          @click="go(index + 1)"
        >
          ›
        </button>
      </div>
    </div>

    <h2>Artikel Terbaru</h2>

    <ul class="latest">
      <li v-for="a in latest" :key="a.id">
        <RouterLink :to="`/artikel/${a.id}`" class="item">
          <img :src="a.image" :alt="a.title" loading="lazy" />
          <span>{{ a.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.side {
  position: sticky;
  top: 90px;
  padding-left: 32px;
}

.promo {
  overflow: hidden;
  border-radius: 12px;
}
.track {
  display: flex;
  transition: transform 0.4s ease;
}
.slide {
  min-width: 100%;
  min-height: 190px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  color: #fff;
}
.s0 {
  background: linear-gradient(110deg, #0865d8, #0a4fa8);
}
.s1 {
  background: linear-gradient(110deg, #0a7fb0, #0865d8);
}
.s2 {
  background: linear-gradient(110deg, #0a4fa8, #14396f);
}
.slide h3 {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
}
.slide p {
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.92;
}
.cta {
  align-self: flex-start;
  margin-top: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  background: #fff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 700;
}
.cta:hover {
  background: #eaf4ff;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 28px;
}
.dots {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: #cfdbe9;
  padding: 0;
  transition: all 0.2s;
}
.dot.on {
  width: 22px;
  border-radius: 10px;
  background: #0865d8;
}
.arrows {
  display: flex;
  gap: 10px;
}
.arrows button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: #142d4e;
  font-size: 22px;
  line-height: 1;
  box-shadow: 0 4px 14px rgba(36, 91, 153, 0.18);
}
.arrows button:hover {
  color: #0865d8;
}

h2 {
  color: #142d4e;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
}

.latest {
  list-style: none;
  display: grid;
  gap: 16px;
}
.item {
  display: grid;
  grid-template-columns: 42% 1fr;
  gap: 14px;
  align-items: start;
}
.item img {
  width: 100%;
  aspect-ratio: 2 / 1;
  object-fit: cover;
  border-radius: 8px;
  background: #e9f1f8;
}
.item span {
  color: #142d4e;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
}
.item:hover span {
  color: #0865d8;
}

@media (max-width: 1000px) {
  .side {
    position: static;
    padding: 36px 0 0;
  }
}
</style>
