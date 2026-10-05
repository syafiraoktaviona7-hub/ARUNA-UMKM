<script setup>
import { computed } from "vue";
import { jasaCategories } from "@/data/jasa";

const props = defineProps({ item: { type: Object, required: true } });

const icon = computed(
  () => jasaCategories.find((c) => c.name === props.item.category)?.icon ?? "",
);
</script>

<template>
  <article class="card">
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

    <h3>{{ item.name }}</h3>
    <p class="desc">{{ item.description }}</p>
    <p class="loc">{{ item.district }}, {{ item.city }}</p>

    <div class="foot">
      <strong>{{ item.price }}</strong>
      <span class="mode">{{ item.mode }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
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
}
.loc {
  color: #526982;
  font-size: 13px;
  font-weight: 500;
}
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
  font-size: 14px;
  font-weight: 700;
}
.mode {
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #e2ecf8;
  color: #526982;
  font-size: 12px;
}
</style>
