<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useCart } from "@/composables/useCart";
import { useRouter } from "vue-router";

const { items, groups, count, total, isOpen, close, setQty, remove, clear } = useCart();
const closeBtn = ref(null);
const router = useRouter();

function continueShopping() {
  close();

  setTimeout(() => {
    router.push("/produk");
  }, 260);
}

function orderOnline(g) {
  close();

  setTimeout(() => {
    router.push("/checkout");
  }, 260);
}

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);

function waLink(g) {
  const lines = g.items.map(
    (i) => `- ${i.qty}x ${i.name} (${rupiah(i.price)})`
  );

  const text = `Halo ${g.shop}, saya ingin memesan:\n${lines.join(
    "\n"
  )}\nTotal: ${rupiah(g.subtotal)}`;

  return `https://wa.me/${g.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Kunci scroll halaman saat drawer terbuka dan pindahkan fokus ke tombol tutup
watch(isOpen, async (v) => {
  document.body.style.overflow = v ? "hidden" : "";

  if (v) {
    await nextTick();
    closeBtn.value?.focus();
  }
});

function onKey(e) {
  if (e.key === "Escape" && isOpen.value) close();
}

onMounted(() => window.addEventListener("keydown", onKey));

onUnmounted(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition name="cart">
      <div v-if="isOpen" class="cart-root">
        <div class="scrim" @click="close"></div>

        <aside
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang belanja"
        >
          <header>
            <h2>
              Keranjang
              <span v-if="count">({{ count }})</span>
            </h2>

            <button
              ref="closeBtn"
              type="button"
              class="x"
              aria-label="Tutup keranjang"
              @click="close"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div v-if="!items.length" class="empty">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 4H5L7.5 16H18L21 7H6" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>

            <p>
              <b>Keranjangmu masih kosong</b>
            </p>

            <p>
              Tambahkan produk UMKM favoritmu dengan ikon keranjang di kartu
              produk.
            </p>

            <button
              type="button"
              class="ghost"
              @click="continueShopping"
            >
              Lanjut belanja
            </button>
          </div>

          <div v-else class="list">
            <section
              v-for="g in groups"
              :key="g.shop"
              class="shop"
            >
              <h3>{{ g.shop }}</h3>

              <article
                v-for="i in g.items"
                :key="i.key"
                class="row"
              >
                <img
                  v-if="i.image"
                  :src="i.image"
                  :alt="i.name"
                />

                <div
                  v-else
                  class="ph"
                  aria-hidden="true"
                >
                  {{ i.name.charAt(0) }}
                </div>

                <div class="info">
                  <b>{{ i.name }}</b>

                  <span class="price">
                    {{ rupiah(i.price) }}
                  </span>

                  <div class="qty">
                    <button
                      type="button"
                      :aria-label="`Kurangi ${i.name}`"
                      @click="setQty(i.key, i.qty - 1)"
                    >
                      −
                    </button>

                    <output>{{ i.qty }}</output>

                    <button
                      type="button"
                      :aria-label="`Tambah ${i.name}`"
                      @click="setQty(i.key, i.qty + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  class="del"
                  :aria-label="`Hapus ${i.name}`"
                  @click="remove(i.key)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                    />
                  </svg>
                </button>
              </article>

              <div class="sub">
                <span>
                  Subtotal
                  <b>{{ rupiah(g.subtotal) }}</b>
                </span>

                <div class="order-methods">
                  <!-- Pesan via WhatsApp -->
                  <a
                    :href="waLink(g)"
                    target="_blank"
                    rel="noopener"
                    class="order-btn wa"
                  >
                    Pesan via WhatsApp
                  </a>

                  <!-- Pesan Online melalui sistem ARUNA -->
                  <button
                    type="button"
                    class="order-btn online"
                    @click="orderOnline(g)"
                  >
                    Pesan Online
                  </button>
                </div>
              </div>
            </section>
          </div>

          <footer v-if="items.length">
            <div class="total">
              <span>Total</span>
              <strong>{{ rupiah(total) }}</strong>
            </div>

            <p class="note">
              Pembayaran dilakukan langsung ke masing-masing UMKM setelah
              pesanan dikonfirmasi lewat WhatsApp.
            </p>

            <button
              type="button"
              class="clear"
              @click="clear"
            >
              Kosongkan keranjang
            </button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cart-root {
  position: fixed;
  inset: 0;
  z-index: 1100;
}

.scrim {
  position: absolute;
  inset: 0;
  background: rgba(20, 45, 78, 0.45);
}

.panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: min(420px, 100vw);
  background: #fff;
  color: #142d4e;
  box-shadow: -12px 0 40px rgba(7, 40, 90, 0.2);
}

.cart-enter-active,
.cart-leave-active {
  transition: opacity 0.2s ease;
}

.cart-enter-active .panel,
.cart-leave-active .panel {
  transition: transform 0.26s ease;
}

.cart-enter-from,
.cart-leave-to {
  opacity: 0;
}

.cart-enter-from .panel,
.cart-leave-to .panel {
  transform: translateX(100%);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #e2ecf8;
}

header h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

header h2 span {
  color: #5c718a;
  font-weight: 500;
}

.x {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: #142d4e;
  background: #f4f9ff;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.empty {
  flex: 1;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 8px;
  padding: 32px;
  text-align: center;
  color: #5c718a;
}

.empty svg {
  color: #9db8da;
  margin-bottom: 6px;
}

.empty b {
  color: #142d4e;
}

.ghost {
  margin-top: 10px;
  padding: 10px 20px;
  font-weight: 600;
  color: #0865d8;
  background: #fff;
  border: 1px solid #0865d8;
  border-radius: 10px;
  cursor: pointer;
}

.ghost:hover {
  color: #fff;
  background: #0865d8;
}

.list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px 16px;
}

.shop {
  padding: 14px 0;
  border-bottom: 1px solid #e2ecf8;
}

.shop h3 {
  margin-bottom: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #5c718a;
}

.row {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 8px 0;
}

.row img,
.ph {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  background: #e9f1f8;
}

.ph {
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0865d8;
}

.info {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.info b {
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.3;
}

.price {
  color: #0865d8;
  font-weight: 700;
  font-size: 0.9rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid #e2ecf8;
  border-radius: 8px;
}

.qty button {
  width: 30px;
  height: 30px;
  font-size: 1.1rem;
  color: #142d4e;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.qty button:hover {
  color: #0865d8;
}

.qty output {
  min-width: 28px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
}

.del {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #7d8fa6;
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.del:hover {
  color: #b3261e;
  background: #fdecea;
}

.sub {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  font-size: 0.88rem;
  color: #5c718a;
}

.sub b {
  color: #142d4e;
}

.order-methods {
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s ease;
}

.wa {
  color: #fff;
  background: #25d366;
}

.wa:hover {
  background: #1faa52;
}

.online {
  color: #0865d8;
  background: #eef6ff;
  border: 1px solid #0865d8;
}

.online:hover {
  color: #fff;
  background: #0865d8;
}

footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #e2ecf8;
  background: #f9fbff;
}

.total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.total strong {
  font-size: 1.25rem;
  color: #0865d8;
}

.note {
  margin: 8px 0 10px;
  font-size: 0.78rem;
  color: #7d8fa6;
}

.clear {
  padding: 0;
  font-size: 0.82rem;
  color: #b3261e;
  background: transparent;
  border: 0;
  cursor: pointer;
}

@media (max-width: 480px) {
  .sub {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-methods {
    width: 100%;
  }

  .order-btn {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-enter-active,
  .cart-leave-active,
  .cart-enter-active .panel,
  .cart-leave-active .panel {
    transition: none;
  }
}
</style>