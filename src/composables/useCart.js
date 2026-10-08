import { reactive, computed, watch } from "vue";

const STORAGE_KEY = "aruna_cart";
const MAX_QTY = 99;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// State di luar fungsi supaya navbar, kartu produk, dan drawer memakai data yang sama
const state = reactive({ items: load(), open: false });

watch(
  () => state.items,
  (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {
      /* penyimpanan penuh atau dinonaktifkan: abaikan */
    }
  },
  { deep: true },
);

const keyOf = (item) => String(item.id ?? `${item.shop}|${item.name}`);

// Batas jumlah per produk: stok (kalau ada) tapi tidak lebih dari MAX_QTY
const limitOf = (stok) =>
  Math.max(0, Math.min(MAX_QTY, Number.isFinite(stok) ? stok : MAX_QTY));

export function useCart() {
  const items = computed(() => state.items);
  const isOpen = computed(() => state.open);
  const count = computed(() => state.items.reduce((n, i) => n + i.qty, 0));
  const total = computed(() => state.items.reduce((n, i) => n + i.qty * i.price, 0));

  // Kelompokkan per UMKM karena pembayaran dilakukan langsung ke tiap UMKM
  const groups = computed(() => {
    const map = new Map();
    state.items.forEach((i) => {
      if (!map.has(i.shop)) map.set(i.shop, { shop: i.shop, whatsapp: i.whatsapp, items: [], subtotal: 0 });
      const g = map.get(i.shop);
      g.items.push(i);
      g.subtotal += i.qty * i.price;
    });
    return [...map.values()];
  });

  // Tambah ke keranjang sebanyak qty. Mengembalikan true kalau ada yang bertambah,
  // false kalau stok habis atau jumlah di keranjang sudah mencapai batas.
  function add(item, qty = 1) {
    const key = keyOf(item);
    const max = limitOf(item.stok);
    const jumlah = Math.max(1, Math.floor(Number(qty)) || 1);
    const found = state.items.find((i) => i.key === key);

    if (found) {
      found.stok = max;
      const next = Math.min(found.qty + jumlah, max);
      if (next <= found.qty) return false;
      found.qty = next;
      return true;
    }

    if (max < 1) return false;

    state.items.push({
      key,
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      shop: item.shop,
      whatsapp: item.whatsapp,
      stok: max,
      qty: Math.min(jumlah, max),
    });
    return true;
  }

  function remove(key) {
    state.items = state.items.filter((i) => i.key !== key);
  }

  function setQty(key, qty) {
    if (qty <= 0) return remove(key);
    const found = state.items.find((i) => i.key === key);
    if (found) found.qty = Math.min(qty, limitOf(found.stok));
  }

  const clear = () => (state.items = []);
  const open = () => (state.open = true);
  const close = () => (state.open = false);

  return { items, isOpen, count, total, groups, add, remove, setQty, clear, open, close };
}