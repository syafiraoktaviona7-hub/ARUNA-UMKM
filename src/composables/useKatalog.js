import { ref } from "vue";
import { katalog } from "@/services/api";

// Data dimuat sekali dari API lalu dipakai bersama semua halaman dan komponen.
// Bentuk datanya sama dengan file di src/data/ (produk, umkm, jasa, articles).
const produkList = ref([]);
const umkmList = ref([]);
const jasaList = ref([]);
const jasaCategories = ref([]);
const articles = ref([]);
const error = ref("");

const req = {};

function muat(kunci, force, ambil) {
  if (!req[kunci] || force) {
    req[kunci] = ambil().catch((e) => {
      error.value = e.message;
      req[kunci] = null; // boleh dicoba lagi
      return null;
    });
  }
  return req[kunci];
}

export function useKatalog() {
  // force = true: ambil ulang (mis. setelah checkout supaya stok terbaru tampil)
  const loadProduk = (force = false) =>
    muat("produk", force, async () => {
      produkList.value = await katalog.produk({ limit: 500 });
    });

  const loadUmkm = (force = false) =>
    muat("umkm", force, async () => {
      umkmList.value = await katalog.umkm({ limit: 500 });
    });

  const loadJasa = (force = false) =>
    muat("jasa", force, async () => {
      const [kategori, daftar] = await Promise.all([katalog.jasaKategori(), katalog.jasa({ limit: 500 })]);
      jasaCategories.value = kategori;
      jasaList.value = daftar;
    });

  const loadArtikel = (force = false) =>
    muat("artikel", force, async () => {
      articles.value = await katalog.artikel({ limit: 100 });
    });

  return {
    produkList, umkmList, jasaList, jasaCategories, articles, error,
    loadProduk, loadUmkm, loadJasa, loadArtikel,
  };
}
