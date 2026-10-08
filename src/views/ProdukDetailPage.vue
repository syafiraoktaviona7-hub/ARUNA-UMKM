<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { produkList } from "@/data/produk";
import { umkmList } from "@/data/umkm";
import AddToCartButton from "@/components/AddToCartButton.vue";
import ProdukCard from "@/components/ProdukCard.vue";
import { useAuth } from "@/composables/useAuth";
import LoginRequiredModal from "@/components/LoginRequiredModal.vue";

const { isLoggedIn } = useAuth();
const showAuthModal = ref(false);

const route = useRoute();
const router = useRouter();
const failed = ref(false);
const tab = ref("deskripsi");
const qty = ref(1);

const item = computed(() =>
  produkList.find((p) => String(p.id) === String(route.params.id)),
);

const umkm = computed(() =>
  item.value ? umkmList.find((u) => u.id === item.value.umkmId) : null,
);

const stok = computed(() => item.value?.stok ?? 0);
const habis = computed(() => stok.value < 1);

watch(
  () => route.params.id,
  () => {
    failed.value = false;
    tab.value = "deskripsi";
    qty.value = 1;
  },
);

// Jumlah selalu di antara 1 dan stok
function setQty(v) {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) {
    qty.value = 1;
    return;
  }
  qty.value = Math.min(Math.max(n, 1), Math.max(stok.value, 1));
}

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const price = computed(() => (item.value ? rupiah(item.value.price) : ""));
const total = computed(() =>
  item.value ? rupiah(item.value.price * qty.value) : "",
);

const deskripsi = computed(
  () =>
    item.value?.deskripsi ||
    `${item.value.name} dari ${item.value.shop}. Hubungi penjual untuk informasi lebih lanjut.`,
);

const waLink = computed(() => {
  if (!item.value) return "#";
  const text = encodeURIComponent(
    `Halo, saya mau pesan "${item.value.name}" sebanyak ${qty.value} (total ${total.value}). Apakah masih tersedia?`,
  );
  return `https://wa.me/${item.value.whatsapp}?text=${text}`;
});

// Checkout langsung: simpan ke format yang dibaca CheckoutPage, lalu pindah halaman
function checkout() {
  if (!isLoggedIn.value) {
    showAuthModal.value = true;
    return;
  }

  const p = item.value;

  try {
    localStorage.setItem(
      "aruna_checkout",
      JSON.stringify({
        shop: p.shop,
        whatsapp: p.whatsapp,
        items: [
          {
            key: `produk-${p.id}`,
            id: p.id,
            name: p.name,
            price: p.price,
            qty: qty.value,
            image: p.image,
            stok: p.stok,
          },
        ],
      }),
    );
  } catch (error) {
    console.error("Gagal menyimpan data checkout:", error);
    return;
  }

  router.push({ name: "checkout" });
}

const related = computed(() => {
  if (!item.value) return [];
  const others = produkList.filter((p) => p.id !== item.value.id);
  const sameShop = others.filter((p) => p.umkmId === item.value.umkmId);
  const sameCat = others.filter(
    (p) => p.category === item.value.category && p.umkmId !== item.value.umkmId,
  );
  return [...sameShop, ...sameCat].slice(0, 4);
});

const relatedTitle = computed(() =>
  related.value.some((p) => p.umkmId === item.value?.umkmId)
    ? "Produk Lainnya"
    : "Produk Serupa",
);
</script>

<template>
  <main class="page">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
        <span>/</span>
        <RouterLink :to="{ name: 'products' }">Produk</RouterLink>
        <template v-if="item">
          <span>/</span>
          <RouterLink
            :to="{ name: 'products', query: { kategori: item.category } }"
          >
            {{ item.category }}
          </RouterLink>
          <span>/</span>
          <b>{{ item.name }}</b>
        </template>
      </nav>

      <template v-if="item">
        <article class="detail">
          <div class="media">
            <img
              v-if="!failed"
              :src="item.image"
              :alt="item.name"
              @error="failed = true"
            />
            <div v-else class="ph" aria-hidden="true">
              {{ item.name.charAt(0) }}
            </div>
          </div>

          <div class="info">
            <span class="tag">{{ item.category }}</span>
            <h1>{{ item.name }}</h1>

            <div class="stats">
              <span><b>{{ item.sold }}</b> terjual</span>
              <span v-if="item.jenis">{{ item.jenis }}</span>
              <span :class="habis ? 'out' : 'in'">
                {{ habis ? "Stok habis" : `Stok: ${stok}` }}
              </span>
            </div>

            <strong class="price">{{ price }}</strong>

            <p class="loc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {{ item.district }}, {{ item.city }}, {{ item.province }}
            </p>

            <!-- JUMLAH -->
            <div class="qty-row">
              <span class="qty-label">Jumlah</span>
              <div class="qty" role="group" aria-label="Jumlah pembelian">
                <button
                  type="button"
                  aria-label="Kurangi"
                  :disabled="habis || qty <= 1"
                  @click="setQty(qty - 1)"
                >
                  −
                </button>
                <input
                  :value="qty"
                  type="number"
                  min="1"
                  :max="stok"
                  inputmode="numeric"
                  :disabled="habis"
                  aria-label="Jumlah"
                  @change="setQty($event.target.value)"
                />
                <button
                  type="button"
                  aria-label="Tambah"
                  :disabled="habis || qty >= stok"
                  @click="setQty(qty + 1)"
                >
                  +
                </button>
              </div>
              <span class="qty-total">Total <b>{{ total }}</b></span>
            </div>

            <!-- AKSI -->
            <div class="actions">
              <div class="cart-wrap" :class="{ off: habis }">
  <AddToCartButton :item="item" :qty="qty" :disabled="habis" />
</div>
              <button
                type="button"
                class="btn btn-main"
                :disabled="habis"
                @click="checkout"
              >
                Checkout
              </button>

              <a
                :href="habis ? undefined : waLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-wa"
                :class="{ off: habis }"
                :aria-disabled="habis"
              >
                Pesan via WA
              </a>
            </div>

            <!-- KARTU PENJUAL -->
            <RouterLink
              v-if="umkm"
              :to="{ name: 'umkm-detail', params: { id: umkm.id } }"
              class="seller"
            >
              <span class="avatar">{{ umkm.name.charAt(0) }}</span>
              <span class="seller-text">
                <small>Dijual oleh</small>
                <b>{{ umkm.name }}</b>
                <em>{{ umkm.city }}</em>
              </span>
              <span class="go">Kunjungi UMKM →</span>
            </RouterLink>
          </div>
        </article>

        <section class="panel">
          <div class="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'deskripsi'"
              :class="{ on: tab === 'deskripsi' }"
              @click="tab = 'deskripsi'"
            >
              Deskripsi
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'info'"
              :class="{ on: tab === 'info' }"
              @click="tab = 'info'"
            >
              Informasi Produk
            </button>
          </div>

          <p v-if="tab === 'deskripsi'" class="desc">{{ deskripsi }}</p>

          <dl v-else class="meta">
            <div><dt>Kategori</dt><dd>{{ item.category }}</dd></div>
            <div v-if="item.jenis"><dt>Jenis</dt><dd>{{ item.jenis }}</dd></div>
            <div><dt>Stok</dt><dd>{{ stok }}</dd></div>
            <div><dt>Toko</dt><dd>{{ item.shop }}</dd></div>
            <div><dt>Kecamatan</dt><dd>{{ item.district }}</dd></div>
            <div><dt>Kota / Kabupaten</dt><dd>{{ item.city }}</dd></div>
            <div><dt>Provinsi</dt><dd>{{ item.province }}</dd></div>
            <div><dt>Terjual</dt><dd>{{ item.sold }}</dd></div>
          </dl>
        </section>

        <section v-if="related.length" class="related">
          <h2>{{ relatedTitle }}</h2>
          <div class="grid">
            <ProdukCard v-for="p in related" :key="p.id" :item="p" />
          </div>
        </section>
      </template>

      <div v-else class="empty">
        <p>Produk tidak ditemukan.</p>
        <RouterLink :to="{ name: 'products' }" class="btn btn-main">
          Lihat semua produk
        </RouterLink>
      </div>
    </div>
        <LoginRequiredModal
      v-if="showAuthModal"
      message="Anda perlu masuk atau mendaftar akun terlebih dahulu untuk melanjutkan ke checkout."
      @close="showAuthModal = false"
    />
  </main>
</template>

<style scoped>
.page {
  background: #f4f9ff;
  min-height: 100vh;
  padding: 24px 0 72px;
}
.wrap {
  width: 85.5%;
  max-width: 1100px;
  margin: 0 auto;
}

.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  color: #5c718a;
  font-size: 13px;
}
.crumbs a {
  color: #0865d8;
}
.crumbs a:hover {
  text-decoration: underline;
}
.crumbs b {
  color: #142d4e;
  font-weight: 600;
}

.detail {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 32px;
  padding: 24px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
}
.media img,
.ph {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
}
.media img {
  object-fit: cover;
  background: #e9f1f8;
}
.ph {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #cfe5ff, #e9f4ff);
  color: #0865d8;
  font-size: 96px;
  font-weight: 800;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tag {
  align-self: flex-start;
  padding: 3px 12px;
  border-radius: 20px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 500;
}
h1 {
  color: #142d4e;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  line-height: 1.25;
}
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #5c718a;
  font-size: 13px;
}
.stats span + span {
  padding-left: 14px;
  border-left: 1px solid #e2ecf8;
}
.stats b {
  color: #142d4e;
}
.stats .in {
  color: #1b8a4b;
  font-weight: 600;
}
.stats .out {
  color: #c62828;
  font-weight: 600;
}
.price {
  padding: 14px 16px;
  border-radius: 10px;
  background: #f4f9ff;
  color: #0865d8;
  font-size: 30px;
  font-weight: 800;
}
.loc {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #526982;
  font-size: 14px;
}
.loc svg {
  flex: none;
  width: 16px;
  height: 16px;
}

/* JUMLAH */
.qty-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding-top: 4px;
}
.qty-label {
  color: #5c718a;
  font-size: 13px;
  font-weight: 600;
}
.qty {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #e2ecf8;
  border-radius: 10px;
}
.qty button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f4f9ff;
  color: #0865d8;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
}
.qty button:hover:not(:disabled) {
  background: #eaf4ff;
}
.qty button:disabled {
  color: #9aabc0;
  cursor: not-allowed;
}
.qty input {
  width: 56px;
  height: 40px;
  border: none;
  border-right: 1px solid #e2ecf8;
  border-left: 1px solid #e2ecf8;
  background: #fff;
  color: #142d4e;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}
.qty input::-webkit-outer-spin-button,
.qty input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
}
.qty-total {
  color: #5c718a;
  font-size: 13px;
}
.qty-total b {
  color: #142d4e;
  font-size: 15px;
}

/* AKSI */
.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.cart-wrap.off {
  opacity: 0.5;
  pointer-events: none;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-main {
  background: #0865d8;
}
.btn-main:hover:not(:disabled) {
  background: #0754b5;
}
.btn-wa {
  background: #1fa855;
}
.btn-wa:hover:not(.off) {
  background: #178a45;
}
.btn:disabled,
.btn.off {
  background: #c5d2e2;
  cursor: not-allowed;
  pointer-events: none;
}

.seller {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 14px;
  border: 1px solid #e2ecf8;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.seller:hover {
  border-color: #0865d8;
  box-shadow: 0 6px 18px rgba(36, 91, 153, 0.1);
}
.avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0865d8, #0a4fa8);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
}
.seller-text {
  display: grid;
  min-width: 0;
  font-size: 13px;
}
.seller-text small {
  color: #5c718a;
}
.seller-text b {
  color: #142d4e;
  font-size: 15px;
}
.seller-text em {
  color: #5c718a;
  font-style: normal;
}
.go {
  margin-left: auto;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.panel {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
}
.tabs {
  display: flex;
  border-bottom: 1px solid #edf3fa;
}
.tabs button {
  padding: 14px 22px;
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: #5c718a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.tabs button.on {
  border-bottom-color: #0865d8;
  color: #0865d8;
}
.desc {
  padding: 20px 24px 24px;
  color: #293c57;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-line;
}
.meta {
  display: grid;
  padding: 8px 24px 16px;
}
.meta div {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #edf3fa;
  font-size: 14px;
}
.meta div:last-child {
  border-bottom: none;
}
dt {
  color: #5c718a;
}
dd {
  color: #142d4e;
  font-weight: 500;
}

.related {
  margin-top: 32px;
}
.related h2 {
  margin-bottom: 16px;
  color: #142d4e;
  font-size: 18px;
  font-weight: 800;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}

.empty {
  display: grid;
  gap: 16px;
  justify-items: start;
  padding: 30px 0;
  color: #5c718a;
}

@media (max-width: 800px) {
  .wrap {
    width: 88%;
  }
  .detail {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .meta div {
    grid-template-columns: 120px 1fr;
  }
}
@media (max-width: 650px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .go {
    display: none;
  }
  .btn {
    flex: 1;
    padding: 0 14px;
  }
}
</style>