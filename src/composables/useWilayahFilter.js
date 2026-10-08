import { ref, computed, watch, onMounted } from "vue";

import {
    getProvinces,
    getCities,
    getDistricts,
    getVillages,
    titleCase,
} from "@/services/wilayah";

export function useWilayahFilter() {
    const provinces = ref([]);
    const cities = ref([]);
    const districts = ref([]);
    const villages = ref([]);

    const provinceId = ref("");
    const cityId = ref("");
    const districtId = ref("");
    const villageId = ref("");

    const loading = ref(false);
    const error = ref("");

    async function load(target, fetcher) {
        loading.value = true;
        error.value = "";

        try {
            const rows = await fetcher();

            target.value = rows.map((r) => ({
                id: r.id,
                name: titleCase(r.name),
            }));
        } catch (e) {
            error.value = e.message;
            target.value = [];
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        load(provinces, getProvinces);
    });

    // Pilihan di bawahnya otomatis di-reset saat induknya berubah
    watch(provinceId, (id) => {
        cityId.value = "";
        districtId.value = "";
        villageId.value = "";

        cities.value = [];
        districts.value = [];
        villages.value = [];

        if (id) {
            load(cities, () => getCities(id));
        }
    });

    watch(cityId, (id) => {
        districtId.value = "";
        villageId.value = "";

        districts.value = [];
        villages.value = [];

        if (id) {
            load(districts, () => getDistricts(id));
        }
    });

    watch(districtId, (id) => {
        villageId.value = "";
        villages.value = [];

        if (id) {
            load(villages, () => getVillages(id));
        }
    });

    const nameOf = (list, id) => {
        const found = list.value.find((x) => x.id === id);

        if (found) {
            return found.name;
        }

        return "";
    };

    const selected = computed(() => ({
        province: nameOf(provinces, provinceId.value),
        city: nameOf(cities, cityId.value),
        district: nameOf(districts, districtId.value),
        village: nameOf(villages, villageId.value),
    }));

    const reset = () => {
        provinceId.value = "";
        cityId.value = "";
        districtId.value = "";
        villageId.value = "";
    };

    return {
        provinces,
        cities,
        districts,
        villages,
        provinceId,
        cityId,
        districtId,
        villageId,
        loading,
        error,
        selected,
        reset,
    };
}