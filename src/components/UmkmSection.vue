<script setup>
import { ref, computed } from "vue";
import { umkmList, categories } from "@/data/umkm";
import UmkmCard from "./UmkmCard.vue";

const props = defineProps({
  area: { type: Object, required: true },
  query: { type: String, default: "" },
});

const activeCategory = ref("Semua");

// "Kota Surabaya" dan "Surabaya" dianggap sama
const norm = (s = "") =>
  s
    .toLowerCase()
    .replace(/^(kota|kabupaten|kab\.)\s+/, "")
    .trim();

const results = computed(() => {
  const { province, city, district } = props.area;
  const q = props.query.toLowerCase().trim();
  return umkmList.filter(
    (u) =>
      (!province || norm(u.province) === norm(province)) &&
      (!city || norm(u.city) === norm(city)) &&
      (!district || norm(u.district) === norm(district)) &&
      (activeCategory.value === "Semua" ||
        u.category === activeCategory.value) &&
      (!q || `${u.name} ${u.category}`.toLowerCase().includes(q)),
  );
});

const areaLabel = computed(
  () =>
    [props.area.district, props.area.city, props.area.province]
      .filter(Boolean)
      .join(", ") || "seluruh Indonesia",
);
</script>

<template>
  <section id="umkm" class="section">
    <div class="container">
      <h2>Produk UMKM di {{ areaLabel }}</h2>
      <p class="count" aria-live="polite">
        {{ results.length }} produk ditemukan
      </p>

      <div class="chips" role="group" aria-label="Kategori">
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          class="chip"
          :class="{ on: activeCategory === c }"
          :aria-pressed="activeCategory === c"
          @click="activeCategory = c"
        >
          {{ c }}
        </button>
      </div>

      <div v-if="results.length" class="grid">
        <UmkmCard v-for="u in results" :key="u.id" :item="u" />
      </div>
      <p v-else class="empty">
        Belum ada UMKM di wilayah ini. Coba pilih kota atau kecamatan lain, atau
        ganti kategori.
      </p>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 56px 0 72px;
}
h2 {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
  letter-spacing: -0.5px;
}
.count {
  margin-top: 4px;
  color: var(--muted);
  font-size: 14px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}
.chip {
  padding: 7px 16px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--white);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}
.chip.on {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.empty {
  padding: 40px 0;
  color: var(--muted);
}
</style>
