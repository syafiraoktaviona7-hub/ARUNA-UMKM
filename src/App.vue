<script setup>
import { useRoute } from "vue-router";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";

const route = useRoute();
</script>

<template>
  <AppNavbar v-if="!route.meta.bare" />
  <RouterView />
  <AppFooter v-if="!route.meta.bare" />
</template>