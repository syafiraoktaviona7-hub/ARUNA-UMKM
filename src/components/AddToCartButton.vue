<script setup>
import { ref, onUnmounted } from "vue";
import { useCart } from "@/composables/useCart";
import { useAuth } from "@/composables/useAuth";
import LoginRequiredModal from "@/components/LoginRequiredModal.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  qty: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const cart = useCart();
const { isLoggedIn } = useAuth();

const added = ref(false);
const showAuthModal = ref(false);

let timer;

function addToCart() {
  if (props.disabled) return;

  // BELUM LOGIN
  if (!isLoggedIn.value) {
    showAuthModal.value = true;
    return;
  }

  // SUDAH LOGIN
  const ok = cart.add(props.item, props.qty);

  if (!ok) {
    alert("Jumlah di keranjang sudah mencapai stok yang tersedia.");
    return;
  }

  added.value = true;

  clearTimeout(timer);

  timer = setTimeout(() => {
    added.value = false;
  }, 1200);
}
function closeAuthModal() {
  showAuthModal.value = false;
}

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <button
    type="button"
    class="cart"
    :class="{ done: added }"
    :disabled="disabled"
    :aria-label="`Tambahkan ${item.name} ke keranjang`"
    @click="addToCart"
  >
    <svg
      v-if="!added"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4H5L7.5 16H18L21 7H6"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" />
    </svg>

    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12l5 5 9-10"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <LoginRequiredModal
    v-if="showAuthModal"
    @close="closeAuthModal"
  />
</template>

<style scoped>
.cart {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: #0865d8;
  background: #eaf4ff;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.cart:hover:not(:disabled) {
  background: #d6e8ff;
}
.cart:disabled {
  color: #9aabc0;
  background: #edf1f6;
  cursor: not-allowed;
}
.cart.done {
  color: #fff;
  background: #0865d8;
}
.cart svg {
  width: 20px;
  height: 20px;
}
</style>