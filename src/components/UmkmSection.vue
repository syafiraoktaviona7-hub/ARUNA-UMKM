<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useKatalog } from "@/composables/useKatalog";
import { categories } from "@/data/categories";
import ProdukCard from "./ProdukCard.vue";

const props = defineProps({
  area: { type: Object, required: true },
  query: { type: String, default: "" },
});
defineEmits(["reset"]);

const { produkList, loadProduk } = useKatalog();
loadProduk();

const category = defineModel("category", { type: String, default: "Semua" });

// Jumlah kolom mengikuti lebar layar, supaya baris selalu penuh
const calcCols = () => {
  const w = window.innerWidth;
  if (w > 1200) return 5;
  if (w > 900) return 4;
  if (w > 650) return 3;
  return 2;
};
const cols = ref(calcCols());
const updateCols = () => {
  cols.value = calcCols();
};

onMounted(() => window.addEventListener("resize", updateCols));
onUnmounted(() => window.removeEventListener("resize", updateCols));

// 2 baris penuh (di HP 3 baris). Desktop: 5 kolom x 2 baris = 10 produk
const rows = computed(() => (cols.value === 2 ? 3 : 2));
const perPage = computed(() => cols.value * rows.value);

// "Kota Surabaya" dan "Surabaya" dianggap sama
const norm = (s = "") =>
  s
    .toLowerCase()
    .replace(/^(kota|kabupaten|kab\.)\s+/, "")
    .trim();

const results = computed(() => {
  const { province, city, district } = props.area;
  const q = props.query.toLowerCase().trim();
  return produkList.value.filter(
    (u) =>
      (!province || norm(u.province) === norm(province)) &&
      (!city || norm(u.city) === norm(city)) &&
      (!district || norm(u.district) === norm(district)) &&
      (category.value === "Semua" || u.category === category.value) &&
      (!q || `${u.name} ${u.shop} ${u.category}`.toLowerCase().includes(q)),
  );
});

const preview = computed(() => results.value.slice(0, perPage.value));

// Kata pencarian dibawa ke halaman semua produk
const seeAll = computed(() => ({
  path: "/produk",
  query: props.query ? { q: props.query } : {},
}));

const areaLabel = computed(
  () =>
    [props.area.district, props.area.city, props.area.province]
      .filter(Boolean)
      .join(", ") || "seluruh Indonesia",
);
</script>

<template>
  <section id="umkm" class="section">
    <div class="wrap">
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
          :class="{ on: category === c }"
          :aria-pressed="category === c"
          @click="category = c"
        >
          {{ c }}
        </button>

        <RouterLink :to="seeAll" class="chip chip-link">
          Lihat Semua Produk <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <div
        v-if="results.length"
        class="grid"
        :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
      >
        <ProdukCard v-for="u in preview" :key="u.id" :item="u" />
      </div>

      <div v-else class="empty">
        <p>
          Belum ada produk yang cocok dengan pilihanmu. Coba wilayah atau
          kategori lain.
        </p>
        <button type="button" class="empty-btn" @click="$emit('reset')">
          Tampilkan semua produk
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 56px 0 72px;
  background: #fff;
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}
h2 {
  color: #142d4e;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
  letter-spacing: -0.5px;
}
.count {
  margin-top: 4px;
  color: #5c718a;
  font-size: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
}
.chip {
  padding: 7px 16px;
  border: 1px solid #e2ecf8;
  border-radius: 20px;
  background: #fff;
  color: #5c718a;
  font-size: 13px;
  font-weight: 500;
}
.chip.on {
  background: #0865d8;
  border-color: #0865d8;
  color: #fff;
}
.chip-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-color: #0865d8;
  color: #0865d8;
  font-weight: 600;
  transition: background 0.2s;
}
.chip-link:hover {
  background: #eaf4ff;
}

.grid {
  display: grid;
  gap: 20px;
}

.empty {
  padding: 30px 0;
  color: #5c718a;
  display: grid;
  gap: 16px;
  justify-items: start;
}
.empty-btn {
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.empty-btn:hover {
  background: #0754b5;
}

.more-row {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.more-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 28px;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}
.more-btn:hover {
  background: #0754b5;
}
.more-btn span {
  font-size: 18px;
}

@media (max-width: 650px) {
  .wrap {
    width: 88%;
  }
  .grid {
    gap: 12px;
  }
}
</style>
