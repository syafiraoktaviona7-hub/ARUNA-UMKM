<script setup>
import { ref, computed } from "vue";
import { jasaList, jasaCategories } from "@/data/jasa";
import JasaCard from "./JasaCard.vue";

const props = defineProps({
  area: { type: Object, required: true },
  query: { type: String, default: "" },
});
defineEmits(["reset"]);

const category = ref("Semua");

// "Kota Surabaya" dan "Surabaya" dianggap sama
const norm = (s = "") =>
  s
    .toLowerCase()
    .replace(/^(kota|kabupaten|kab\.)\s+/, "")
    .trim();

const pick = (name) => {
  category.value = category.value === name ? "Semua" : name;
};
const countOf = (name) => jasaList.filter((j) => j.category === name).length;

const results = computed(() => {
  const { province, city, district } = props.area;
  const q = props.query.toLowerCase().trim();
  return jasaList.filter(
    (j) =>
      (!province || norm(j.province) === norm(province)) &&
      (!city || norm(j.city) === norm(city)) &&
      (!district || norm(j.district) === norm(district)) &&
      (category.value === "Semua" || j.category === category.value) &&
      (!q ||
        `${j.name} ${j.category} ${j.description}`.toLowerCase().includes(q)),
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
  <section id="jasa" class="jasa">
    <div class="wrap">
      <div class="head">
        <h2>Jelajahi <span>Jasa UMKM</span></h2>
        <p>
          Selain produk, pelaku UMKM juga menawarkan jasa. Pilih jenis jasa,
          lalu lihat siapa yang melayani di wilayahmu.
        </p>
      </div>

      <div class="tiles" role="group" aria-label="Jenis jasa">
        <button
          v-for="c in jasaCategories"
          :key="c.name"
          type="button"
          class="tile"
          :class="{ on: category === c.name }"
          :aria-pressed="category === c.name"
          @click="pick(c.name)"
        >
          <span class="ico">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              v-html="c.icon"
            ></svg>
          </span>
          <strong>{{ c.name }}</strong>
          <span class="desc">{{ c.desc }}</span>
          <span class="count">{{ countOf(c.name) }} layanan</span>
        </button>
      </div>

      <h3 class="result-title">Jasa di {{ areaLabel }}</h3>
      <p class="count-line" aria-live="polite">
        {{ results.length }} jasa ditemukan
      </p>

      <div v-if="results.length" class="grid">
        <JasaCard v-for="j in results" :key="j.id" :item="j" />
      </div>

      <div v-else class="empty">
        <p>
          Belum ada jasa yang cocok dengan pilihanmu. Coba wilayah atau jenis
          jasa lain.
        </p>
        <button type="button" class="empty-btn" @click="$emit('reset')">
          Tampilkan semua
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.jasa {
  padding: 80px 0;
  background: linear-gradient(180deg, #f4f9ff, #e9f3ff);
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

.head {
  max-width: 640px;
  margin-bottom: 32px;
}
.head h2 {
  color: #142d4e;
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.15;
}
.head h2 span {
  color: #0865d8;
}
.head p {
  margin-top: 10px;
  color: #647994;
  font-size: 15px;
  line-height: 1.8;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 40px;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px;
  text-align: left;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  color: inherit;
  transition:
    box-shadow 0.2s,
    border-color 0.2s,
    transform 0.2s;
}
.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(36, 91, 153, 0.12);
}
.tile.on {
  border-color: #0865d8;
  box-shadow: 0 0 0 2px rgba(8, 101, 216, 0.22);
}
.tile .ico {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  margin-bottom: 4px;
  border-radius: 12px;
  background: #eaf4ff;
  color: #0865d8;
}
.tile .ico svg {
  width: 22px;
  height: 22px;
}
.tile strong {
  color: #142d4e;
  font-size: 15px;
  font-weight: 700;
}
.tile .desc {
  color: #647994;
  font-size: 12px;
  line-height: 1.6;
}
.tile .count {
  margin-top: auto;
  padding-top: 6px;
  color: #0865d8;
  font-size: 12px;
  font-weight: 600;
}

.result-title {
  color: #142d4e;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 700;
  letter-spacing: -0.4px;
}
.count-line {
  margin: 4px 0 22px;
  color: #5c718a;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

@media (max-width: 1200px) {
  .tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 650px) {
  .jasa {
    padding: 56px 0;
  }
  .wrap {
    width: 88%;
  }
  .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .tile {
    padding: 14px;
  }
}
</style>
