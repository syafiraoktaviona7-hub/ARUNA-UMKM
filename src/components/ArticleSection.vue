<script setup>
import { computed } from "vue";
import { articles } from "@/data/articles";

const props = defineProps({
  province: { type: String, default: "" },
});

const national = articles.filter((a) => !a.province);

const local = computed(() =>
  props.province ? articles.filter((a) => a.province === props.province) : [],
);

const shown = computed(() => [...local.value, ...national].slice(0, 3));

const heading = computed(() =>
  props.province
    ? `Artikel dan kabar UMKM di ${props.province}`
    : "Artikel untuk pembeli dan pelaku UMKM",
);

const noLocal = computed(() => props.province && local.value.length === 0);
</script>

<template>
  <section id="artikel" class="articles">
    <div class="wrap">
      <div class="head">
        <h2>{{ heading }}</h2>
      </div>

      <p v-if="noLocal" class="note">
        Belum ada artikel khusus {{ province }}. Ini artikel untuk seluruh
        Indonesia.
      </p>

      <div class="grid">
        <RouterLink
          v-for="a in shown"
          :key="a.id"
          :to="`/artikel/${a.id}`"
          class="card"
        >
          <img :src="a.image" :alt="a.title" loading="lazy" />
          <div class="body">
            <span class="meta">{{ a.tag }} · {{ a.time }}</span>
            <h3>{{ a.title }}</h3>
            <p>{{ a.excerpt }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.articles {
  padding: 80px 0;
  background: #f4f9ff;
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}
.head {
  margin-bottom: 24px;
}
h2 {
  color: #142d4e;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  max-width: 18em;
}
.note {
  margin-bottom: 20px;
  color: #647994;
  font-size: 14px;
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
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.card:hover {
  box-shadow: 0 12px 28px rgba(36, 91, 153, 0.12);
  transform: translateY(-3px);
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
  .wrap {
    width: 88%;
  }
}
</style>
