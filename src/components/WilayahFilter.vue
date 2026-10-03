<script setup>
import { watch } from "vue";
import { useWilayahFilter } from "@/composables/useWilayahFilter";

const emit = defineEmits(["update:area"]);

const {
  provinces,
  cities,
  districts,
  provinceId,
  cityId,
  districtId,
  loading,
  error,
  selected,
  reset,
} = useWilayahFilter();

watch(selected, (val) => emit("update:area", val), { deep: true });

defineExpose({ reset });
</script>

<template>
  <section class="filter-wrap" aria-label="Filter wilayah">
    <form class="filter" @submit.prevent>
      <label class="field">
        <span>Provinsi</span>
        <select v-model="provinceId">
          <option value="">Semua provinsi</option>
          <option v-for="p in provinces" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Kota / Kabupaten</span>
        <select v-model="cityId" :disabled="!provinceId">
          <option value="">Semua kota / kabupaten</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Kecamatan</span>
        <select v-model="districtId" :disabled="!cityId">
          <option value="">Semua kecamatan</option>
          <option v-for="d in districts" :key="d.id" :value="d.id">
            {{ d.name }}
          </option>
        </select>
      </label>

      <button
        type="button"
        class="reset"
        :disabled="!provinceId"
        @click="reset"
      >
        Hapus filter
      </button>
    </form>

    <p v-if="error" class="msg error" role="alert">{{ error }}</p>
    <p v-else-if="loading" class="msg">Memuat data wilayah…</p>
  </section>
</template>

<style scoped>
.filter-wrap {
  position: relative;
  z-index: 5;
  max-width: 1440px;
  margin: 28px auto 0;
  padding: 0 7%;
}

.filter {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 14px;
  align-items: end;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(36, 91, 153, 0.12);
}

.field {
  display: grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
}
.field span {
  color: #5c718a;
}

select {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e2ecf8;
  border-radius: 10px;
  background: #fff;
  color: #142d4e;
  font-size: 13px;
}
select:disabled {
  background: #f2f6fb;
  color: #9aabc0;
  cursor: not-allowed;
}

.reset {
  height: 44px;
  padding: 0 20px;
  border: 1px solid #e2ecf8;
  border-radius: 10px;
  background: transparent;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.reset:hover:not(:disabled) {
  border-color: #0865d8;
}
.reset:disabled {
  color: #9aabc0;
  cursor: not-allowed;
}

.msg {
  margin-top: 10px;
  font-size: 13px;
  color: #5c718a;
}
.error {
  color: #c62828;
}

@media (max-width: 1200px) {
  .filter-wrap {
    padding: 0 5%;
  }
}

@media (max-width: 900px) {
  .filter {
    grid-template-columns: 1fr 1fr;
  }
  .reset {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .filter-wrap {
    padding: 0 6%;
  }
  .filter {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
