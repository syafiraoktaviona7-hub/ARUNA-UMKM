import { ref, computed, watch, onMounted } from "vue";
import {
  getProvinces,
  getCities,
  getDistricts,
  titleCase,
} from "@/services/wilayah";

export function useWilayahFilter() {
  const provinces = ref([]);
  const cities = ref([]);
  const districts = ref([]);
  const provinceId = ref("");
  const cityId = ref("");
  const districtId = ref("");
  const loading = ref(false);
  const error = ref("");

  async function load(target, fetcher) {
    loading.value = true;
    error.value = "";
    try {
      const rows = await fetcher();
      target.value = rows.map((r) => ({ id: r.id, name: titleCase(r.name) }));
    } catch (e) {
      error.value = e.message;
      target.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => load(provinces, getProvinces));

  // Pilihan di bawahnya otomatis di-reset saat induknya berubah
  watch(provinceId, (id) => {
    cityId.value = "";
    districtId.value = "";
    cities.value = [];
    districts.value = [];
    if (id) load(cities, () => getCities(id));
  });

  watch(cityId, (id) => {
    districtId.value = "";
    districts.value = [];
    if (id) load(districts, () => getDistricts(id));
  });

  const nameOf = (list, id) => list.value.find((x) => x.id === id)?.name ?? "";

  const selected = computed(() => ({
    province: nameOf(provinces, provinceId.value),
    city: nameOf(cities, cityId.value),
    district: nameOf(districts, districtId.value),
  }));

  const reset = () => {
    provinceId.value = "";
  };

  return {
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
  };
}
