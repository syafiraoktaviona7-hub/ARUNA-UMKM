<script setup>
import { ref, computed } from "vue";
import AddToCartButton from "@/components/AddToCartButton.vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const failed = ref(false);
const price = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(props.item.price),
);

const wa = computed(() =>
  `https://wa.me/${props.item.whatsapp}?text=` +
  encodeURIComponent(`Halo, saya tertarik dengan ${props.item.name}`),
);

function loadFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("aruna_favorites") || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const favorites = ref(loadFavorites());
const isFavorite = computed(() =>
  favorites.value.some(
    (product) => String(product.id ?? product.key) === String(props.item.id),
  ),
);

function toggleFavorite() {
  const productId = String(props.item.id);
  if (isFavorite.value) {
    favorites.value = favorites.value.filter(
      (product) => String(product.id ?? product.key) !== productId,
    );
  } else {
    favorites.value = [...favorites.value, { ...props.item }];
  }
  localStorage.setItem("aruna_favorites", JSON.stringify(favorites.value));
}
</script>

<template>
  <article class="card">
    <div class="media">
      <img
        v-if="!failed"
        :src="item.image"
        :alt="item.name"
        loading="lazy"
        @error="failed = true"
      />
      <div v-else class="ph" aria-hidden="true">
        {{ item.name?.charAt(0) || "?" }}
      </div>

      <button
        type="button"
        class="favorite-button"
        :class="{ active: isFavorite }"
        :aria-label="isFavorite ? 'Hapus dari produk favorit' : 'Tambahkan ke produk favorit'"
        :aria-pressed="isFavorite"
        :title="isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'"
        @click.stop="toggleFavorite"
      >
        <svg
          viewBox="0 0 24 24"
          :fill="isFavorite ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z" />
        </svg>
      </button>
    </div>

    <div class="body">
      <h3>
        <RouterLink
          :to="{ name: 'produk-detail', params: { id: item.id } }"
          class="link"
        >
          {{ item.name }}
        </RouterLink>
      </h3>

      <p class="shop">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 10L5 4H19L21 10" />
          <path d="M4 10V20H20V10" />
          <path d="M9 20V14H15V20" />
        </svg>
        {{ item.shop }}
      </p>
      <p class="loc">{{ item.district }}, {{ item.city }}</p>

      <div class="foot">
        <div class="info">
          <strong class="price">{{ price }}</strong>
          <p class="meta">
            <span>{{ item.sold }} terjual</span>
            <span class="badge">{{ item.category }}</span>
          </p>
        </div>

        <div class="actions">
          <AddToCartButton :item="item" :disabled="item.stok < 1" />
          <a
            :href="wa"
            target="_blank"
            rel="noopener noreferrer"
            class="wa"
            :aria-label="`Hubungi ${item.shop} lewat WhatsApp`"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(36, 91, 153, 0.12);
  transform: translateY(-3px);
}
.media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #e9f1f8;
}
.media img { width: 100%; height: 100%; object-fit: cover; }
.ph {
  width: 100%; height: 100%; display: grid; place-items: center;
  background: linear-gradient(135deg, #cfe5ff, #e9f4ff);
  color: #0865d8; font-size: 48px; font-weight: 800;
}
.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid #dce8f5;
  border-radius: 50%;
  background: #fff;
  color: #7d8fa6;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.favorite-button svg { width: 19px; height: 19px; }
.favorite-button:hover, .favorite-button.active {
  color: #e14b67;
  border-color: #f4c6d0;
  background: #fff0f3;
}
.body { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 16px; }
h3 {
  color: #142d4e; font-size: 15px; font-weight: 700; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.8em;
}
.link { color: inherit; }
.link::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.card:hover .link { color: #0865d8; }
.shop { display: flex; align-items: center; gap: 6px; color: #526982; font-size: 12px; }
.shop svg { width: 14px; height: 14px; flex-shrink: 0; color: #0865d8; }
.loc { color: #7d8fa6; font-size: 12px; }
.foot {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #edf3fa;
}
.price { display: block; color: #0865d8; font-size: 16px; font-weight: 800; }
.meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
  margin-top: 4px; color: #526982; font-size: 12px; font-weight: 500;
}
.badge {
  padding: 2px 8px; border-radius: 20px; background: #eaf4ff;
  color: #0865d8; font-size: 11px; font-weight: 600;
}
.actions {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.actions :deep(button) {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 10px !important;
  box-sizing: border-box;
}
.wa {
  width: 44px; height: 44px; min-width: 44px; min-height: 44px;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  padding: 0; margin: 0; box-sizing: border-box;
  border-radius: 10px; background: #25d366; color: #fff;
  transition: background 0.2s;
}
.wa:hover { background: #1faa52; }
.wa svg { width: 20px; height: 20px; }
@media (max-width: 650px) {
  .actions { gap: 4px; }
  .actions :deep(button) {
    width: 32px !important; height: 32px !important;
    min-width: 32px !important; min-height: 32px !important;
    border-radius: 8px !important;
  }
  .wa {
    width: 32px; height: 32px;
    min-width: 32px; min-height: 32px;
    border-radius: 8px;
  }
  .wa svg { width: 16px; height: 16px; }
  .media { aspect-ratio: 1 / 1; }
  .body { padding: 10px; gap: 4px; }
  h3 { font-size: 12px; line-height: 1.3; min-height: 31px; }
  .shop { font-size: 10px; }
  .loc { font-size: 9px; }
  .price { font-size: 13px; }
  .meta { font-size: 9px; }
  .badge { font-size: 8px; padding: 2px 5px; }
}
</style>
