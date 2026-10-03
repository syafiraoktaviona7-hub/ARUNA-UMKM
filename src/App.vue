<script setup>
import { ref } from "vue";
import AppNavbar from "@/components/AppNavbar.vue";
import HeroSection from "@/components/HeroSection.vue";
import WilayahFilter from "@/components/WilayahFilter.vue";
import CategorySection from "@/components/CategorySection.vue";
import UmkmSection from "@/components/UmkmSection.vue";
import HowItWorks from "@/components/HowItWorks.vue";
import AboutSection from "@/components/AboutSection.vue";
import SellerCta from "@/components/SellerCta.vue";
import ArticleSection from "@/components/ArticleSection.vue";
import FaqSection from "@/components/FaqSection.vue";
import AppFooter from "@/components/AppFooter.vue";

const query = ref("");
const category = ref("Semua");
const area = ref({ province: "", city: "", district: "" });
const filterRef = ref(null);

function resetAll() {
  filterRef.value?.reset();
  category.value = "Semua";
  query.value = "";
}
</script>

<template>
  <AppNavbar v-model:query="query" />
  <main>
    <HeroSection v-model:query="query" @pick-category="category = $event" />
    <WilayahFilter ref="filterRef" @update:area="area = $event" />
    <CategorySection v-model:category="category" />
    <UmkmSection
      v-model:category="category"
      :area="area"
      :query="query"
      @reset="resetAll"
    />
    <HowItWorks />
    <AboutSection />
    <SellerCta />
    <ArticleSection />
    <FaqSection />
  </main>
  <AppFooter />
</template>
