<script setup>
import { useRoute } from "vue-router";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import CartDrawer from "@/components/CartDrawer.vue";

const route = useRoute();
</script>

<template>
  <AppNavbar v-if="!route.meta.bare" />
  <RouterView />
  <AppFooter v-if="!route.meta.bare" />
  <CartDrawer v-if="!route.meta.bare" />
</template>