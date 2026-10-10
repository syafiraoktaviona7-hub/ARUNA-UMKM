// services/wilayah.js
const BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";
const cache = new Map();

async function get(path) {
    if (cache.has(path)) return cache.get(path);

    const res = await fetch(`${BASE}/${path}.json`);

    if (!res.ok) {
        throw new Error("Data wilayah gagal dimuat. Coba lagi.");
    }

    const data = await res.json();
    cache.set(path, data);

    return data;
}

export const getProvinces = () => get("provinces");
export const getCities = (provinceId) => get(`regencies/${provinceId}`);
export const getDistricts = (cityId) => get(`districts/${cityId}`);
export const getVillages = (districtId) => get(`villages/${districtId}`);

export const titleCase = (s = "") =>
    s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());