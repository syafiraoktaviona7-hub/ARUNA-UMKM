<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useCart } from "@/composables/useCart";
<<<<<<< Updated upstream
import { useKatalog } from "@/composables/useKatalog";
import { customer as customerApi } from "@/services/api";
=======
import { saveOrder } from "@/composables/useOrders";
>>>>>>> Stashed changes

const router = useRouter();
const { user } = useAuth();
const cart = useCart();
const { loadProduk } = useKatalog();
const submitting = ref(false);

const CHECKOUT_KEY = "aruna_checkout";

function loadCheckout() {
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const checkout = ref(loadCheckout() || {
  shop: "",
  whatsapp: "",
  items: [],
});

const customer = user.value || {};

const form = ref({
  nama: customer.name || "",
  nomorHp: customer.nomorHp || "",
  email: customer.email || "",

  provinsi: customer.provinsi || "",
  kota: customer.kota || "",
  kecamatan: customer.kecamatan || "",
  kelurahan: customer.kelurahan || "",
  kodePos: customer.kodePos || "",
  alamatLengkap: customer.alamatLengkap || "",

  pengiriman: "jne",
  pembayaran: "transfer",

  catatan: "",
});

const shippingMethods = [
  {
    id: "jne",
    name: "JNE Regular",
    description: "Estimasi 2–3 hari",
    price: 15000,
  },
  {
    id: "jnt",
    name: "J&T Express",
    description: "Estimasi 2–3 hari",
    price: 17000,
  },
];

const paymentMethods = [
  {
    id: "transfer",
    name: "Transfer Bank",
    description: "Transfer manual ke rekening penjual",
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    description: "DANA, OVO, GoPay, ShopeePay",
  },
  {
    id: "cod",
    name: "Bayar di Tempat (COD)",
    description: "Pembayaran saat barang diterima",
  },
];

const items = computed(() => checkout.value.items || []);

const shop = computed(() => checkout.value.shop || "");

const subtotal = computed(() => {
  return items.value.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
});

const selectedShipping = computed(() => {
  return (
    shippingMethods.find(
      (method) => method.id === form.value.pengiriman
    ) || shippingMethods[0]
  );
});

const shippingCost = computed(() => {
  return selectedShipping.value.price;
});

const totalPayment = computed(() => {
  return subtotal.value + shippingCost.value;
});

const rupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

function increaseQty(item) {
  if (item.qty < Math.min(99, item.stok ?? 99)) {
    item.qty++;
  }

  saveCheckout();
}

function decreaseQty(item) {
  if (item.qty > 1) {
    item.qty--;
  }

  saveCheckout();
}

function saveCheckout() {
  try {
    localStorage.setItem(
      "aruna_checkout",
      JSON.stringify(checkout.value)
    );
  } catch (error) {
    console.error("Gagal menyimpan perubahan checkout:", error);
  }
}

function removeItem(index) {
  items.value.splice(index, 1);
  saveCheckout();
}

function backToCart() {
  router.push("/");
}

async function submitOrder() {
  if (submitting.value) return;

  if (!form.value.nama.trim()) {
    alert("Silakan isi nama lengkap.");
    return;
  }

  if (!form.value.nomorHp.trim()) {
    alert("Silakan isi nomor handphone.");
    return;
  }

  if (!form.value.provinsi.trim()) {
    alert("Silakan isi provinsi.");
    return;
  }

  if (!form.value.kota.trim()) {
    alert("Silakan isi kota/kabupaten.");
    return;
  }

  if (!form.value.kecamatan.trim()) {
    alert("Silakan isi kecamatan.");
    return;
  }

  if (!form.value.kelurahan.trim()) {
    alert("Silakan isi kelurahan/desa.");
    return;
  }

  if (!form.value.kodePos.trim()) {
    alert("Silakan isi kode pos.");
    return;
  }

  if (!form.value.alamatLengkap.trim()) {
    alert("Silakan isi alamat lengkap.");
    return;
  }

  if (!items.value.length) {
    alert("Keranjang pesanan kosong.");
    return;
  }

<<<<<<< Updated upstream
  submitting.value = true;

  try {
    const alamat = [
      form.value.alamatLengkap.trim(),
      `Kel. ${form.value.kelurahan}`,
      `Kec. ${form.value.kecamatan}`,
      form.value.kota,
      form.value.provinsi,
      form.value.kodePos,
    ].join(", ");

    const res = await customerApi.buatPesanan({
      items: items.value.map((item) => ({ id: item.id, qty: item.qty })),
      nama_penerima: form.value.nama.trim(),
      no_hp_penerima: form.value.nomorHp.trim(),
      alamat_kirim: alamat,
      catatan: form.value.catatan,
      metode_bayar: form.value.pembayaran,
      pengiriman: form.value.pengiriman,
    });

    const order = res.orders[0];

    items.value.forEach((item) => {
      cart.remove(item.key);
    });
    localStorage.removeItem(CHECKOUT_KEY);
    loadProduk(true); // muat ulang katalog supaya stok terbaru tampil
=======
const orderData = {
  id: `ARN-${Date.now()}`,
  customerKey: user.value?.id != null
    ? `id:${user.value.id}`
    : user.value?.email
      ? `email:${user.value.email.trim().toLowerCase()}`
      : null,
  createdAt: new Date().toISOString(),
  status: "Menunggu Konfirmasi",

  shop: shop.value,
    items: items.value,
    customer: {
      nama: form.value.nama,
      nomorHp: form.value.nomorHp,
      email: form.value.email,
    },
    address: {
      provinsi: form.value.provinsi,
      kota: form.value.kota,
      kecamatan: form.value.kecamatan,
      kelurahan: form.value.kelurahan,
      kodePos: form.value.kodePos,
      alamatLengkap: form.value.alamatLengkap,
    },
    shipping: selectedShipping.value,
    payment: form.value.pembayaran,
    catatan: form.value.catatan,
    subtotal: subtotal.value,
    shippingCost: shippingCost.value,
    total: totalPayment.value,
  };

 if (!orderData.customerKey) {
  alert("Silakan login terlebih dahulu sebelum membuat pesanan.");
  return;
}

try {
  saveOrder(orderData);
} catch (error) {
  console.error("Gagal menyimpan pesanan:", error);
  alert("Pesanan gagal disimpan. Silakan coba kembali.");
  return;
}

items.value.forEach((item) => {
  cart.remove(item.key);
});
alert("Pesanan berhasil dibuat!");
>>>>>>> Stashed changes

    let pesan = `Pesanan ${order.kode} berhasil dibuat!\nTotal pembayaran ${rupiah(order.total)}.`;
    if (form.value.pembayaran === "transfer" && order.umkm.no_rekening) {
      pesan += `\n\nTransfer ke ${order.umkm.bank} ${order.umkm.no_rekening} a.n. ${order.umkm.nama_rekening}.`;
    } else if (order.umkm.whatsapp) {
      pesan += `\n\nHubungi penjual lewat WhatsApp: ${order.umkm.whatsapp}`;
    }
    alert(pesan);

    router.push("/");
  } catch (error) {
    alert(error.status === 403 ? "Hanya akun customer yang bisa membuat pesanan." : error.message);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="checkout-page">

    <!-- Breadcrumb -->
    <div class="checkout-container">
      <div class="breadcrumb">
        <span @click="router.push('/')">⌂</span>
        <span>›</span>
        <span @click="router.push('/')">Beranda</span>
        <span>›</span>
        <span>Keranjang</span>
        <span>›</span>
        <strong>Checkout</strong>
      </div>

      <!-- Header -->
      <div class="checkout-heading">
        <div class="checkout-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 4H5L7.5 16H18L21 7H6" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
          </svg>
        </div>

        <div>
          <h1>Checkout</h1>
          <p>
            Lengkapi data berikut untuk menyelesaikan pesanan Anda.
          </p>
        </div>
      </div>

      <div class="checkout-layout">

        <!-- ================= LEFT ================= -->
        <div class="checkout-left">

          <!-- DATA PENERIMA -->
          <section class="checkout-card">
            <div class="section-title">
              <span class="number">1</span>
              <h2>Data Penerima</h2>
            </div>

            <div class="form-grid two-column">

              <div class="form-group">
                <label>
                  Nama Lengkap <span>*</span>
                </label>

                <div class="input-wrapper">
                 <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle
                        cx="12"
                        cy="7.5"
                        r="3.2"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />

                      <path
                        d="M5.5 20c.7-3.8 3-5.8 6.5-5.8s5.8 2 6.5 5.8"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>

                  <input
                    v-model="form.nama"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>
                  Nomor Handphone <span>*</span>
                </label>

                <div class="input-wrapper">
                 <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect
                        x="7"
                        y="3"
                        width="10"
                        height="18"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />

                      <path
                        d="M10 6h4"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />

                      <circle
                        cx="12"
                        cy="18"
                        r="0.9"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <input
                    v-model="form.nomorHp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

            </div>

            <div class="form-group full">
              <label>Email (Opsional)</label>

              <div class="input-wrapper">
                <span class="input-icon">✉</span>

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Masukkan email"
                />
              </div>
            </div>
          </section>


          <!-- ALAMAT -->
          <section class="checkout-card">

            <div class="section-heading-row">
              <div class="section-title">
                <span class="number">2</span>
                <h2>Alamat Pengiriman</h2>
              </div>

              <label class="profile-address">
                <input
                  type="checkbox"
                  :checked="!!customer.alamatLengkap"
                  disabled
                />
                Gunakan alamat dari profil saya
              </label>
            </div>

            <div class="form-grid three-column">

              <div class="form-group">
                <label>
                  Provinsi <span>*</span>
                </label>

                <div class="input-wrapper">
                  <input
                    v-model="form.provinsi"
                    type="text"
                    placeholder="Provinsi"
                  />
                  <span class="select-arrow">⌄</span>
                </div>
              </div>

              <div class="form-group">
                <label>
                  Kota / Kabupaten <span>*</span>
                </label>

                <div class="input-wrapper">
                  <input
                    v-model="form.kota"
                    type="text"
                    placeholder="Kota / Kabupaten"
                  />
                  <span class="select-arrow">⌄</span>
                </div>
              </div>

              <div class="form-group">
                <label>
                  Kecamatan <span>*</span>
                </label>

                <div class="input-wrapper">
                  <input
                    v-model="form.kecamatan"
                    type="text"
                    placeholder="Kecamatan"
                  />
                  <span class="select-arrow">⌄</span>
                </div>
              </div>

            </div>

            <div class="form-grid address-bottom">

              <div class="form-group">
                <label>
                  Kelurahan / Desa <span>*</span>
                </label>

                <div class="input-wrapper">
                  <input
                    v-model="form.kelurahan"
                    type="text"
                    placeholder="Kelurahan / Desa"
                  />
                  <span class="select-arrow">⌄</span>
                </div>
              </div>

              <div class="form-group">
                <label>
                  Kode Pos <span>*</span>
                </label>

                <div class="input-wrapper">
                  <input
                    v-model="form.kodePos"
                    type="text"
                    placeholder="Kode Pos"
                  />
                </div>
              </div>

              <div class="form-group address-field">
                <label>
                  Alamat Lengkap <span>*</span>
                </label>

                <textarea
                  v-model="form.alamatLengkap"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>

            </div>
          </section>


          <!-- PENGIRIMAN -->
          <section class="checkout-card">

            <div class="section-title">
              <span class="number">3</span>
              <h2>Metode Pengiriman</h2>
            </div>

            <div class="option-grid">

              <label
                v-for="method in shippingMethods"
                :key="method.id"
                class="shipping-option"
                :class="{
                  selected: form.pengiriman === method.id
                }"
              >

                <input
                  v-model="form.pengiriman"
                  type="radio"
                  :value="method.id"
                />

                <span class="radio-circle"></span>

                <div class="shipping-logo">
                  {{ method.id === "jne" ? "JNE" : "J&T" }}
                </div>

                <div class="option-info">
                  <strong>{{ method.name }}</strong>
                  <small>{{ method.description }}</small>
                </div>

                <strong class="option-price">
                  {{ rupiah(method.price) }}
                </strong>

              </label>

            </div>
          </section>


          <!-- PEMBAYARAN -->
          <section class="checkout-card">

            <div class="section-title">
              <span class="number">4</span>
              <h2>Metode Pembayaran</h2>
            </div>

            <div class="payment-grid">

              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-option"
                :class="{
                  selected: form.pembayaran === method.id
                }"
              >

                <input
                  v-model="form.pembayaran"
                  type="radio"
                  :value="method.id"
                />

                <span class="radio-circle"></span>

               <div class="payment-icon">
  <!-- TRANSFER BANK -->
  <svg
    v-if="method.id === 'transfer'"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 9h18"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <path
      d="M4 9l8-5 8 5"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M5 9v8M9 9v8M15 9v8M19 9v8"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <path
      d="M3 19h18"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
  </svg>

  <!-- E-WALLET -->
  <svg
    v-else-if="method.id === 'ewallet'"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 17.5v-11Z"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
    />

    <path
      d="M4 7h14"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <path
      d="M15 12h5v4h-5a2 2 0 0 1 0-4Z"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
    />

    <circle
      cx="16.5"
      cy="14"
      r="0.8"
      fill="currentColor"
    />
  </svg>

  <!-- COD -->
  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
    />

    <path
      d="M4.5 7.5 12 11l7.5-3.5"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
    />

    <path
      d="M12 11v9"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <path
      d="m8.5 15 2 2 4-4"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

                <div class="option-info">
                  <strong>{{ method.name }}</strong>
                  <small>{{ method.description }}</small>
                </div>

              </label>

            </div>
          </section>


          <!-- CATATAN -->
          <section class="checkout-card notes-card">

            <div class="section-title">
              <span class="number">5</span>
              <h2>
                Catatan Pesanan
                <small>(Opsional)</small>
              </h2>
            </div>

            <textarea
              v-model="form.catatan"
              maxlength="200"
              placeholder="Contoh: Tolong dikemas dengan aman ya, terima kasih."
            ></textarea>

            <div class="character-count">
              {{ form.catatan.length }}/200
            </div>

          </section>

        </div>


        <!-- ================= RIGHT ================= -->
        <aside class="checkout-right">

          <section class="summary-card">

            <div class="summary-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 4H5L7.5 16H18L21 7H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
              </svg>

              <h2>Ringkasan Pesanan</h2>
            </div>

            <div class="shop-name">
              {{ shop }}
            </div>

            <div
              v-for="(item, index) in items"
              :key="item.key"
              class="summary-product"
            >

              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
              />

              <div class="summary-product-info">
                <strong>{{ item.name }}</strong>
                <span>{{ shop }}</span>

                <div class="summary-qty">
                  <button
                    type="button"
                    @click="decreaseQty(item)"
                  >
                    −
                  </button>

                  <span>{{ item.qty }}</span>

                  <button
                    type="button"
                    @click="increaseQty(item)"
                  >
                    +
                  </button>
                </div>
              </div>

              <strong class="product-price">
                {{ rupiah(item.price * item.qty) }}
              </strong>

              <button
                type="button"
                class="delete-item"
                @click="removeItem(index)"
              >
                ♜
              </button>

            </div>


            <div class="summary-divider"></div>

            <div class="summary-row">
              <span>Subtotal Produk</span>
              <strong>{{ rupiah(subtotal) }}</strong>
            </div>

            <div class="summary-row">
              <span>
                Ongkos Kirim
                ({{ selectedShipping.name }})
              </span>

              <strong>
                {{ rupiah(shippingCost) }}
              </strong>
            </div>


            <div class="grand-total">
              <span>Total Pembayaran</span>
              <strong>{{ rupiah(totalPayment) }}</strong>
            </div>


            <!-- TRANSAKSI AMAN -->
            <div class="secure-box">

              <div class="secure-icon">
                ✓
              </div>

              <div>
                <strong>Transaksi Aman</strong>

                <p>
                  Data pengiriman dan pembayaran Anda
                  aman dan terjamin kerahasiaannya.
                </p>
              </div>

            </div>


            <button
              type="button"
              class="order-button"
              :disabled="submitting"
              @click="submitOrder"
            >
              <span>♙</span>
              Pesan Sekarang
            </button>

          </section>

        </aside>

      </div>
    </div>

  </main>
</template>


<style scoped>
.checkout-page {
  min-height: calc(100vh - 68px);
  background: #f3f9ff;
  color: #142d4e;
  padding-bottom: 70px;
}

.checkout-container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}


/* =========================
   BREADCRUMB
========================= */

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 0 18px;
  font-size: 13px;
  color: #607896;
}

.breadcrumb span:first-child {
  font-size: 20px;
  color: #376a9e;
  cursor: pointer;
}

.breadcrumb span {
  cursor: default;
}

.breadcrumb strong {
  color: #0865d8;
}


/* =========================
   HEADER
========================= */

.checkout-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.checkout-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  color: #0865d8;
}

.checkout-icon svg {
  width: 40px;
  height: 40px;
}

.checkout-heading h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #102d55;
}

.checkout-heading p {
  margin: 3px 0 0;
  font-size: 14px;
  color: #617b9b;
}


/* =========================
   LAYOUT
========================= */

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
  align-items: start;
}

.checkout-left {
  display: grid;
  gap: 14px;
}


/* =========================
   CARD
========================= */

.checkout-card,
.summary-card {
  background: #fff;
  border: 1px solid #e2ecf7;
  border-radius: 13px;
  box-shadow: 0 4px 18px rgba(24, 64, 105, 0.035);
}

.checkout-card {
  padding: 18px 20px;
}


/* =========================
   SECTION TITLE
========================= */

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title .number {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #0874e8;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.section-title h2 {
  margin: 0;
  color: #132e56;
  font-size: 16px;
  font-weight: 750;
}

.section-title h2 small {
  font-size: 11px;
  font-weight: 400;
  color: #758aa5;
}


/* =========================
   FORM
========================= */

.form-grid {
  display: grid;
  gap: 14px;
}

.two-column {
  grid-template-columns: 1fr 1fr;
}

.three-column {
  grid-template-columns: 1fr 1fr 1fr;
}

.address-bottom {
  grid-template-columns: 1fr 0.55fr 1.8fr;
  margin-top: 14px;
}

.form-group {
  min-width: 0;
}

.form-group.full {
  margin-top: 14px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #233d61;
  font-size: 12px;
  font-weight: 500;
}

.form-group label span {
  color: #e53935;
}

.input-wrapper {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  border: 1px solid #ccdced;
  border-radius: 7px;
  background: #fff;
}

.input-wrapper:focus-within {
  border-color: #1976e8;
  box-shadow: 0 0 0 3px rgba(25, 118, 232, 0.08);
}

.input-wrapper input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 12px;
  color: #233d61;
  font: inherit;
  font-size: 12px;
}

.input-wrapper input::placeholder {
  color: #8da0b7;
}

.input-icon {
  width: 38px;
  height: 100%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #6480a2;
  border-right: 1px solid #e1eaf4;
}

.input-icon svg {
  width: 19px;
  height: 19px;
  display: block;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: #69809d;
  pointer-events: none;
}

textarea {
  width: 100%;
  min-height: 58px;
  resize: vertical;
  box-sizing: border-box;
  border: 1px solid #ccdced;
  border-radius: 7px;
  outline: none;
  padding: 11px 13px;
  color: #233d61;
  background: #fff;
  font-family: inherit;
  font-size: 12px;
}

textarea:focus {
  border-color: #1976e8;
  box-shadow: 0 0 0 3px rgba(25, 118, 232, 0.08);
}


/* =========================
   ADDRESS
========================= */

.section-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-address {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #536d8e;
  font-size: 11px;
}

.profile-address input {
  accent-color: #0874e8;
}

.address-field textarea {
  height: 63px;
}


/* =========================
   SHIPPING
========================= */

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.shipping-option,
.payment-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 67px;
  box-sizing: border-box;
  padding: 10px 13px;
  border: 1px solid #dbe6f2;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.shipping-option:hover,
.payment-option:hover {
  border-color: #77adf0;
}

.shipping-option.selected,
.payment-option.selected {
  border-color: #0874e8;
  background: #f6fbff;
  box-shadow: 0 0 0 1px rgba(8, 116, 232, 0.12);
}

.shipping-option input,
.payment-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-circle {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  border: 2px solid #a7b9ce;
  border-radius: 50%;
  position: relative;
}

.selected .radio-circle {
  border-color: #0874e8;
}

.selected .radio-circle::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  left: 3px;
  top: 3px;
  border-radius: 50%;
  background: #0874e8;
}

.shipping-logo {
  width: 48px;
  font-size: 15px;
  font-style: italic;
  font-weight: 900;
  color: #173e74;
}

.option-info {
  display: grid;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.option-info strong {
  color: #203b60;
  font-size: 12px;
}

.option-info small {
  color: #7186a2;
  font-size: 10px;
  line-height: 1.4;
}

.option-price {
  color: #0865d8;
  font-size: 12px;
  white-space: nowrap;
}


/* =========================
   PAYMENT
========================= */

.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.payment-option {
  align-items: flex-start;
  min-height: 78px;
}

.payment-icon {
  width: 31px;
  height: 31px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  color: #0b68d7;
}

.payment-icon svg {
  width: 26px;
  height: 26px;

  display: block;
}


/* =========================
   NOTES
========================= */

.notes-card {
  position: relative;
}

.character-count {
  text-align: right;
  margin-top: -18px;
  padding-right: 10px;
  color: #8094ac;
  font-size: 9px;
  pointer-events: none;
}


/* =========================
   RIGHT SUMMARY
========================= */

.checkout-right {
  position: sticky;
  top: 86px;
}

.summary-card {
  padding: 19px;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 11px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e1eaf4;
}

.summary-title svg {
  width: 27px;
  height: 27px;
  color: #0874e8;
}

.summary-title h2 {
  margin: 0;
  color: #102d55;
  font-size: 18px;
  font-weight: 750;
}

.shop-name {
  margin: 16px 0 11px;
  color: #617895;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.summary-product {
  display: grid;
  grid-template-columns: 65px 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 8px 0 13px;
}

.summary-product img {
  width: 65px;
  height: 65px;
  border-radius: 9px;
  object-fit: cover;
}

.summary-product-info {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.summary-product-info strong {
  color: #19365b;
  font-size: 12px;
  line-height: 1.35;
}

.summary-product-info > span {
  color: #7086a2;
  font-size: 10px;
}

.summary-qty {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  margin-top: 3px;
  border: 1px solid #dce7f3;
  border-radius: 7px;
  overflow: hidden;
}

.summary-qty button {
  width: 25px;
  height: 25px;
  border: 0;
  background: #fff;
  color: #294562;
  cursor: pointer;
}

.summary-qty span {
  width: 22px;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
}

.product-price {
  color: #152f55;
  font-size: 12px;
  white-space: nowrap;
}

.delete-item {
  display: none;
}


/* =========================
   SUMMARY TOTAL
========================= */

.summary-divider {
  height: 1px;
  background: #e2ebf5;
  margin: 3px 0 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 8px;
  color: #617895;
  font-size: 12px;
}

.summary-row strong {
  color: #172f51;
  white-space: nowrap;
}

.grand-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 13px 0;
  padding: 13px 11px;
  border-radius: 9px;
  background: #eff7ff;
}

.grand-total span {
  color: #142f54;
  font-size: 14px;
  font-weight: 700;
}

.grand-total strong {
  color: #0874e8;
  font-size: 18px;
}


/* =========================
   SECURE BOX
========================= */

.secure-box {
  display: flex;
  gap: 11px;
  padding: 13px;
  margin-bottom: 12px;
  border-radius: 9px;
  background: #eef7ff;
}

.secure-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 7px;
  background: #0874e8;
  color: #fff;
  font-weight: 800;
}

.secure-box strong {
  display: block;
  color: #0874e8;
  font-size: 12px;
  margin-bottom: 3px;
}

.secure-box p {
  margin: 0;
  color: #647d9c;
  font-size: 10px;
  line-height: 1.5;
}


/* =========================
   BUTTON
========================= */

.order-button {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 7px;
  background: #0874e8;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.order-button:hover {
  background: #075fbe;
  transform: translateY(-1px);
}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1000px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-right {
    position: static;
  }

  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .checkout-container {
    width: min(100% - 24px, 600px);
  }

  .two-column,
  .three-column,
  .address-bottom {
    grid-template-columns: 1fr;
  }

  .option-grid {
    grid-template-columns: 1fr;
  }

  .section-heading-row {
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }
}
</style>