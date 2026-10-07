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
</script>

<template>
  <article class="card">
    <img
      v-if="!failed"
      :src="item.image"
      :alt="item.name"
      loading="lazy"
      @error="failed = true"
    />
    <div v-else class="ph" aria-hidden="true">{{ item.name.charAt(0) }}</div>

    <div class="body">
      <h3>{{ item.name }}</h3>
      <p v-if="item.shop" class="shop">{{ item.shop }}</p>
      <p class="loc">{{ item.district }}, {{ item.city }}</p>
      <span class="tag">{{ item.category }}</span>

      <div class="foot">
        <strong class="price">{{ price }}</strong>
        <AddToCartButton :item="item" />
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
  border-radius: 12px;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(36, 91, 153, 0.12);
}
img,
.ph {
  width: 100%;
  height: 180px;
}
img {
  object-fit: cover;
  background: #e9f1f8;
}
.ph {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #cfe5ff, #e9f4ff);
  color: #0865d8;
  font-size: 48px;
  font-weight: 800;
}
.body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
h3 {
  font-size: 16px;
  font-weight: 600;
  color: #142d4e;
}
.shop {
  font-size: 13px;
  color: #526982;
}
.loc {
  font-size: 13px;
  color: #5c718a;
}
.tag {
  align-self: flex-start;
  margin-top: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 500;
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #edf3fa;
}
.price {
  color: #0865d8;
  font-size: 16px;
  font-weight: 800;
}
</style>