<script setup>
import { computed } from "vue";
import { useKatalog } from "@/composables/useKatalog";

const props = defineProps({ item: { type: Object, required: true } });

const { jasaCategories, loadJasa } = useKatalog();
loadJasa();

const icon = computed(
  () =>
    jasaCategories.value.find((c) => c.name === props.item.category)?.icon ??
    "",
);
</script>

<template>
  <RouterLink
    :to="`/jasa/${item.id}`"
    class="card"
    :aria-label="`Lihat detail ${item.name}`"
  >
    <!-- TOP -->
    <div class="top">
      <span class="ico">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icon"
        ></svg>
      </span>
      <span class="tag">{{ item.category }}</span>
    </div>

    <!-- BODY -->
    <h3>{{ item.name }}</h3>
    <p class="desc">{{ item.description }}</p>
    <p class="loc">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      {{ item.district }}, {{ item.city }}
    </p>

    <!-- FOOT: HARGA + MODE -->
    <div class="foot">
      <strong>{{ item.price }}</strong>
      <span class="mode">{{ item.mode }}</span>
    </div>

    <!-- CTA: TOMBOL DETAIL FULL WIDTH -->
    <span class="cta">
      <span>Lihat Detail Layanan</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  color: inherit;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(36, 91, 153, 0.12);
  transform: translateY(-3px);
  border-color: #b9d6f7;
}

/* TOP */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.ico {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #eaf4ff;
  color: #0865d8;
}
.ico svg {
  width: 24px;
  height: 24px;
}
.tag {
  padding: 3px 10px;
  border-radius: 20px;
  background: #f2f7fd;
  color: #526982;
  font-size: 12px;
  font-weight: 500;
}

/* BODY */
h3 {
  color: #142d4e;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}
.desc {
  color: #647994;
  font-size: 13px;
  line-height: 1.7;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.loc {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #526982;
  font-size: 13px;
  font-weight: 500;
}
.loc svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #0865d8;
}

/* FOOT: HARGA + MODE */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid #edf3fa;
}
.foot strong {
  color: #0865d8;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.2px;
}
.mode {
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #e2ecf8;
  background: #f8fbff;
  color: #526982;
  font-size: 12px;
  font-weight: 500;
}

/* CTA: TOMBOL DETAIL */
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  margin-top: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a7bf0 0%, #0865d8 100%);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: 0.1px;
  box-shadow: 0 6px 16px rgba(8, 101, 216, 0.22);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.cta svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}
.card:hover .cta {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(8, 101, 216, 0.32);
}
.card:hover .cta svg {
  transform: translateX(4px);
}

/* MOBILE */
@media (max-width: 650px) {
  .card {
    padding: 16px;
    gap: 6px;
  }
  h3 {
    font-size: 15px;
  }
  .desc {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }
  .loc {
    font-size: 12px;
  }
  .foot strong {
    font-size: 14px;
  }
  .mode {
    font-size: 11px;
    padding: 3px 8px;
  }
  .cta {
    height: 40px;
    font-size: 12.5px;
    margin-top: 10px;
  }
}
</style>
