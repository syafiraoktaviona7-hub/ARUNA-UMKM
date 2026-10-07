<script setup>
import { ref, computed } from "vue";
import AddToCartButton from "@/components/AddToCartButton.vue";

const props = defineProps({ item: { type: Object, required: true } });

const failed = ref(false);

const price = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(props.item.price),
);

const wa = computed(
  () =>
    `https://wa.me/${props.item.whatsapp}?text=` +
    encodeURIComponent(`Halo, saya tertarik dengan ${props.item.name}`),
);
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
      <div v-else class="ph" aria-hidden="true">{{ item.name.charAt(0) }}</div>
    </div>

    <div class="body">
      <h3>{{ item.name }}</h3>

      <p class="shop">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
          aria-hidden="true"
        >
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
          <AddToCartButton :item="item" />
          <a
            :href="wa"
            target="_blank"
            rel="noopener"
            class="wa"
            :aria-label="`Hubungi ${item.shop} lewat WhatsApp`"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(36, 91, 153, 0.12);
  transform: translateY(-3px);
}

.media {
  aspect-ratio: 4 / 3;
  background: #e9f1f8;
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ph {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #cfe5ff, #e9f4ff);
  color: #0865d8;
  font-size: 48px;
  font-weight: 800;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
}
h3 {
  color: #142d4e;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}
.shop {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #526982;
  font-size: 12px;
}
.shop svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #0865d8;
}
.loc {
  color: #7d8fa6;
  font-size: 12px;
}

.foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #edf3fa;
}
.price {
  display: block;
  color: #0865d8;
  font-size: 16px;
  font-weight: 800;
}
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  color: #526982;
  font-size: 12px;
  font-weight: 500;
}
.badge {
  padding: 2px 8px;
  border-radius: 20px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 11px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.wa {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #25d366;
  color: #fff;
  transition: background 0.2s;
}
.wa:hover {
  background: #1faa52;
}
.wa svg {
  width: 20px;
  height: 20px;
}
</style>