import { reactive, computed, watch } from "vue";

const STORAGE_KEY = "aruna_cart";

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

  function add(item) {
    const key = keyOf(item);
    const found = state.items.find((i) => i.key === key);
    if (found) {
      found.qty = Math.min(found.qty + 1, 99);
    } else {
      state.items.push({
        key,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        whatsapp: item.whatsapp,
        qty: 1,
      });
    }
  }

  function remove(key) {
    state.items = state.items.filter((i) => i.key !== key);
  }

  function setQty(key, qty) {
    if (qty <= 0) return remove(key);
    const found = state.items.find((i) => i.key === key);
    if (found) found.qty = Math.min(qty, 99);
  }

  const clear = () => (state.items = []);
  const open = () => (state.open = true);
  const close = () => (state.open = false);

  return { items, isOpen, count, total, groups, add, remove, setQty, clear, open, close };
}