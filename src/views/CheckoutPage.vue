<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useCart } from "@/composables/useCart";
import { useKatalog } from "@/composables/useKatalog";
import { customer as customerApi } from "@/services/api";

const router = useRouter();
const { user } = useAuth();
const cart = useCart();
const { loadProduk } = useKatalog();

const submitting = ref(false);
const CHECKOUT_KEY = "aruna_checkout";
const RIWAYAT_KEY = "aruna_riwayat_pesanan";

// =========================
// STATE POPUP
// =========================
const alertPopup = ref({
  show: false,
  type: "info",
  title: "",
  message: "",
});

const successPopup = ref({
  show: false,
  kode: "",
  total: 0,
  metode: "transfer",
  bank: "",
  rekening: "",
  namaRekening: "",
  whatsapp: "",
  apiFailed: false,
});

function showAlert(type, title, message) {
  alertPopup.value = { show: true, type, title, message };
}
function closeAlert() {
  alertPopup.value.show = false;
}

// =========================
// LOAD CHECKOUT + FALLBACK
// =========================
function loadCheckout() {
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const savedCheckout = loadCheckout();

function buildCheckoutFromCart() {
  const items = cart.items.value;
  if (!items.length) return { shop: "", whatsapp: "", items: [] };

  const firstShop = items[0].shop;
  const shopItems = items.filter((i) => i.shop === firstShop);

  return {
    shop: firstShop,
    whatsapp: shopItems[0].whatsapp || "",
    items: shopItems.map((i) => ({ ...i })),
  };
}

const checkout = ref(
  savedCheckout &&
    Array.isArray(savedCheckout.items) &&
    savedCheckout.items.length
    ? savedCheckout
    : buildCheckoutFromCart(),
);

const customer = computed(() => user.value || {});

const form = ref({
  nama: customer.value.name || "",
  nomorHp: customer.value.nomorHp || "",
  email: customer.value.email || "",
  provinsi: customer.value.provinsi || "",
  kota: customer.value.kota || "",
  kecamatan: customer.value.kecamatan || "",
  kelurahan: customer.value.kelurahan || "",
  kodePos: customer.value.kodePos || "",
  alamatLengkap: customer.value.alamatLengkap || "",
  pengiriman: "jne",
  pembayaran: "transfer",
  catatan: "",
});

onMounted(() => {
  if (user.value) {
    form.value.nama = form.value.nama || user.value.name || "";
    form.value.nomorHp = form.value.nomorHp || user.value.nomorHp || "";
    form.value.email = form.value.email || user.value.email || "";
    form.value.provinsi = form.value.provinsi || user.value.provinsi || "";
    form.value.kota = form.value.kota || user.value.kota || "";
    form.value.kecamatan = form.value.kecamatan || user.value.kecamatan || "";
    form.value.kelurahan = form.value.kelurahan || user.value.kelurahan || "";
    form.value.kodePos = form.value.kodePos || user.value.kodePos || "";
    form.value.alamatLengkap =
      form.value.alamatLengkap || user.value.alamatLengkap || "";
  }
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

// =========================
// ITEMS COMPUTED (DEFENSIF)
// =========================
const items = computed(() => {
  if (Array.isArray(checkout.value.items) && checkout.value.items.length) {
    return checkout.value.items;
  }
  if (Array.isArray(cart.items.value) && cart.items.value.length) {
    checkout.value.items = cart.items.value.map((i) => ({ ...i }));
    if (!checkout.value.shop && cart.items.value[0].shop) {
      checkout.value.shop = cart.items.value[0].shop;
      checkout.value.whatsapp = cart.items.value[0].whatsapp || "";
    }
    return checkout.value.items;
  }
  return [];
});

const shop = computed(() => checkout.value.shop || "");

const subtotal = computed(() =>
  items.value.reduce((total, item) => total + item.price * item.qty, 0),
);

const selectedShipping = computed(
  () =>
    shippingMethods.find((m) => m.id === form.value.pengiriman) ||
    shippingMethods[0],
);

const shippingCost = computed(() => selectedShipping.value.price);
const totalPayment = computed(() => subtotal.value + shippingCost.value);

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

// =========================
// QTY & ITEM
// =========================
function saveCheckout() {
  try {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout.value));
  } catch (e) {
    console.error("Gagal menyimpan checkout:", e);
  }
}

function increaseQty(item) {
  if (item.qty < Math.min(99, item.stok ?? 99)) item.qty++;
  saveCheckout();
}

function decreaseQty(item) {
  if (item.qty > 1) item.qty--;
  saveCheckout();
}

function removeItem(index) {
  items.value.splice(index, 1);
  saveCheckout();
}

function backToCart() {
  router.push("/");
}

// =========================
// SUBMIT ORDER
// =========================
async function submitOrder() {
  if (submitting.value) return;

  // Validasi
  if (!form.value.nama.trim())
    return showAlert(
      "warning",
      "Nama Belum Diisi",
      "Silakan isi nama lengkap penerima.",
    );
  if (!form.value.nomorHp.trim())
    return showAlert(
      "warning",
      "Nomor HP Belum Diisi",
      "Silakan isi nomor handphone penerima.",
    );
  if (!form.value.provinsi.trim())
    return showAlert(
      "warning",
      "Provinsi Belum Diisi",
      "Silakan isi provinsi pengiriman.",
    );
  if (!form.value.kota.trim())
    return showAlert(
      "warning",
      "Kota Belum Diisi",
      "Silakan isi kota/kabupaten pengiriman.",
    );
  if (!form.value.kecamatan.trim())
    return showAlert(
      "warning",
      "Kecamatan Belum Diisi",
      "Silakan isi kecamatan pengiriman.",
    );
  if (!form.value.kelurahan.trim())
    return showAlert(
      "warning",
      "Kelurahan Belum Diisi",
      "Silakan isi kelurahan/desa.",
    );
  if (!form.value.kodePos.trim())
    return showAlert(
      "warning",
      "Kode Pos Belum Diisi",
      "Silakan isi kode pos.",
    );
  if (!form.value.alamatLengkap.trim())
    return showAlert(
      "warning",
      "Alamat Belum Diisi",
      "Silakan isi alamat lengkap.",
    );

  // RE-CHECK dari cart langsung (fallback terakhir)
  let finalItems = items.value;
  if ((!finalItems || !finalItems.length) && cart.items.value.length) {
    finalItems = cart.items.value.map((i) => ({ ...i }));
    checkout.value.items = finalItems;
  }

  if (!finalItems.length) {
    return showAlert(
      "error",
      "Keranjang Kosong",
      "Tidak ada produk untuk dipesan. Silakan tambahkan produk terlebih dahulu dari halaman produk.",
    );
  }

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

    // Simulasi delay proses
    await new Promise((r) => setTimeout(r, 1800));

    // =========================================================
    // SUBMIT KE API
    // =========================================================
    let order = null;
    let apiFailed = false;

    try {
      const res = await customerApi.buatPesanan({
        items: finalItems.map((item) => ({ id: item.id, qty: item.qty })),
        nama_penerima: form.value.nama.trim(),
        no_hp_penerima: form.value.nomorHp.trim(),
        alamat_kirim: alamat,
        catatan: form.value.catatan,
        metode_bayar: form.value.pembayaran,
        pengiriman: form.value.pengiriman,
      });

      order = res?.orders?.[0];

      if (!order) {
        order = {
          kode: `ARN-${Date.now().toString().slice(-8)}`,
          total: totalPayment.value,
          umkm: null,
        };
      }
    } catch (err) {
      apiFailed = true;
      // Dummy order biar popup tetap muncul & data masuk riwayat
      order = {
        kode: `ARN-${Date.now().toString().slice(-8)}`,
        total: totalPayment.value,
        umkm: null,
      };
    }

    // =========================================================
    // SIMPAN KE LOCALSTORAGE RIWAYAT — status selalu "diproses"
    // =========================================================
    try {
      const existing = JSON.parse(localStorage.getItem(RIWAYAT_KEY) || "[]");

      const riwayatItem = {
        kode: order.kode,
        tanggal: new Date().toISOString(),
        items: finalItems.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          qty: it.qty,
          image: it.image,
          shop: it.shop,
        })),
        subtotal: subtotal.value,
        shipping_cost: shippingCost.value,
        shipping_name: selectedShipping.value.name,
        total: order.total || totalPayment.value,
        status: "diproses",
        metode_bayar: form.value.pembayaran,
        pengiriman: form.value.pengiriman,
        nama_penerima: form.value.nama.trim(),
        no_hp_penerima: form.value.nomorHp.trim(),
        alamat_kirim: alamat,
        catatan: form.value.catatan,
        bank: order.umkm?.bank || "",
        rekening: order.umkm?.no_rekening || "",
        nama_rekening: order.umkm?.nama_rekening || "",
        whatsapp: order.umkm?.whatsapp || "",
        api_failed: apiFailed,
      };

      existing.unshift(riwayatItem);
      localStorage.setItem(RIWAYAT_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn("Gagal simpan riwayat pesanan:", e);
    }

    // =========================================================
    // BERSIHKAN CART
    // =========================================================
    try {
      finalItems.forEach((item) => cart.remove(item.key));
      localStorage.removeItem(CHECKOUT_KEY);
    } catch (e) {
      console.warn("Gagal clear cart:", e);
    }

    try {
      await loadProduk(true);
    } catch (e) {
      console.warn("Gagal refresh katalog:", e);
    }

    // =========================================================
    // POPUP SUKSES
    // =========================================================
    successPopup.value = {
      show: true,
      kode: order.kode,
      total: order.total || totalPayment.value,
      metode: form.value.pembayaran,
      bank: order.umkm?.bank || "",
      rekening: order.umkm?.no_rekening || "",
      namaRekening: order.umkm?.nama_rekening || "",
      whatsapp: order.umkm?.whatsapp || checkout.value.whatsapp || "",
      apiFailed: apiFailed,
    };
  } catch (error) {
    showAlert(
      "error",
      "Terjadi Kesalahan",
      error?.message || "Silakan coba lagi.",
    );
  } finally {
    submitting.value = false;
  }
}

function goToRiwayat() {
  successPopup.value.show = false;
  router.push("/riwayat-pesanan");
}

function goToBelanja() {
  successPopup.value.show = false;
  router.push("/produk");
}

// =========================
// WA LINK (untuk popup sukses kalau API gagal)
// =========================
const waSuccessLink = computed(() => {
  if (!successPopup.value.whatsapp) return "#";
  const text = `Halo, saya baru memesan dengan kode ${successPopup.value.kode}. Mohon konfirmasi pembayaran dan pengiriman.`;
  return `https://wa.me/${successPopup.value.whatsapp}?text=${encodeURIComponent(text)}`;
});
</script>

<template>
  <main class="checkout-page">
    <div class="checkout-container">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <span @click="router.push('/')">⌂</span>
        <span>›</span>
        <span @click="router.push('/')">Beranda</span>
        <span>›</span>
        <span>Keranjang</span>
        <span>›</span>
        <strong>Checkout</strong>
      </div>

      <!-- HEADING -->
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
          <p>Lengkapi data berikut untuk menyelesaikan pesanan Anda.</p>
        </div>
      </div>

      <div class="checkout-layout">
        <!-- LEFT -->
        <div class="checkout-left">
          <!-- 1. DATA PENERIMA -->
          <section class="checkout-card">
            <div class="section-title">
              <span class="number">1</span>
              <h2>Data Penerima</h2>
            </div>

            <div class="form-grid two-column">
              <div class="form-group">
                <label>Nama Lengkap <span>*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none">
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
                <label>Nomor Handphone <span>*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none">
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
                      <circle cx="12" cy="18" r="0.9" fill="currentColor" />
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

          <!-- 2. ALAMAT -->
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
                <label>Provinsi <span>*</span></label>
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
                <label>Kota / Kabupaten <span>*</span></label>
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
                <label>Kecamatan <span>*</span></label>
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
                <label>Kelurahan / Desa <span>*</span></label>
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
                <label>Kode Pos <span>*</span></label>
                <div class="input-wrapper">
                  <input
                    v-model="form.kodePos"
                    type="text"
                    placeholder="Kode Pos"
                  />
                </div>
              </div>
              <div class="form-group address-field">
                <label>Alamat Lengkap <span>*</span></label>
                <textarea
                  v-model="form.alamatLengkap"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- 3. PENGIRIMAN -->
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
                :class="{ selected: form.pengiriman === method.id }"
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
                <strong class="option-price">{{ rupiah(method.price) }}</strong>
              </label>
            </div>
          </section>

          <!-- 4. PEMBAYARAN -->
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
                :class="{ selected: form.pembayaran === method.id }"
              >
                <input
                  v-model="form.pembayaran"
                  type="radio"
                  :value="method.id"
                />
                <span class="radio-circle"></span>

                <div class="payment-icon">
                  <svg
                    v-if="method.id === 'transfer'"
                    viewBox="0 0 24 24"
                    fill="none"
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

                  <svg
                    v-else-if="method.id === 'ewallet'"
                    viewBox="0 0 24 24"
                    fill="none"
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
                    <circle cx="16.5" cy="14" r="0.8" fill="currentColor" />
                  </svg>

                  <svg v-else viewBox="0 0 24 24" fill="none">
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

          <!-- 5. CATATAN -->
          <section class="checkout-card notes-card">
            <div class="section-title">
              <span class="number">5</span>
              <h2>Catatan Pesanan <small>(Opsional)</small></h2>
            </div>
            <textarea
              v-model="form.catatan"
              maxlength="200"
              placeholder="Contoh: Tolong dikemas dengan aman ya, terima kasih."
            ></textarea>
            <div class="character-count">{{ form.catatan.length }}/200</div>
          </section>
        </div>

        <!-- RIGHT -->
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

            <div class="shop-name">{{ shop || "Toko" }}</div>

            <div v-if="!items.length" class="empty-cart">
              <p>Keranjang kosong.</p>
              <RouterLink to="/produk" class="empty-link">
                Belanja Sekarang →
              </RouterLink>
            </div>

            <div
              v-for="(item, index) in items"
              :key="item.key"
              class="summary-product"
            >
              <img v-if="item.image" :src="item.image" :alt="item.name" />

              <div class="summary-product-info">
                <strong>{{ item.name }}</strong>
                <span>{{ shop }}</span>
                <div class="summary-qty">
                  <button type="button" @click="decreaseQty(item)">−</button>
                  <span>{{ item.qty }}</span>
                  <button type="button" @click="increaseQty(item)">+</button>
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

            <template v-if="items.length">
              <div class="summary-divider"></div>

              <div class="summary-row">
                <span>Subtotal Produk</span>
                <strong>{{ rupiah(subtotal) }}</strong>
              </div>

              <div class="summary-row">
                <span>Ongkos Kirim ({{ selectedShipping.name }})</span>
                <strong>{{ rupiah(shippingCost) }}</strong>
              </div>

              <div class="grand-total">
                <span>Total Pembayaran</span>
                <strong>{{ rupiah(totalPayment) }}</strong>
              </div>
            </template>

            <div class="secure-box">
              <div class="secure-icon">✓</div>
              <div>
                <strong>Transaksi Aman</strong>
                <p>
                  Data pengiriman dan pembayaran Anda aman dan terjamin
                  kerahasiaannya.
                </p>
              </div>
            </div>

            <button
              type="button"
              class="order-button"
              :disabled="submitting || !items.length"
              @click="submitOrder"
            >
              <span v-if="submitting" class="spinner"></span>
              <template v-if="!submitting">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                Pesan Sekarang
              </template>
              <template v-else>Memproses...</template>
            </button>
          </section>
        </aside>
      </div>
    </div>

    <!-- POPUP ALERT -->
    <Transition name="fade">
      <div
        v-if="alertPopup.show"
        class="alert-overlay"
        @click.self="closeAlert"
      >
        <div class="alert-card" :class="'type-' + alertPopup.type">
          <div class="alert-icon">
            <svg
              v-if="alertPopup.type === 'info'"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M12 8v.01M12 11v6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <svg
              v-else-if="alertPopup.type === 'warning'"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3L21 20H3L12 3Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M12 10v4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
            <svg
              v-else-if="alertPopup.type === 'error'"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="m9 9 6 6M15 9l-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="m8 12 3 3 5-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <h3>{{ alertPopup.title }}</h3>
          <p>{{ alertPopup.message }}</p>

          <button type="button" class="alert-button" @click="closeAlert">
            Mengerti
          </button>
        </div>
      </div>
    </Transition>

    <!-- POPUP SUKSES -->
    <Transition name="pop">
      <div v-if="successPopup.show" class="success-overlay">
        <div class="success-card">
          <div class="confetti">
            <span v-for="n in 16" :key="n" :style="{ '--i': n }"></span>
          </div>

          <div class="success-check">
            <svg viewBox="0 0 52 52" fill="none">
              <circle class="ring" cx="26" cy="26" r="23" />
              <path class="tick" d="M15 27.5l8 8L38 19" />
            </svg>
          </div>

          <span class="success-badge">Pesanan Dikonfirmasi</span>

          <h3>Pesanan <span>Berhasil!</span></h3>

          <p class="success-text">
            <template v-if="successPopup.apiFailed">
              Pesanan Anda sudah kami catat. Karena koneksi ke server terputus,
              silakan hubungi penjual langsung via WhatsApp untuk konfirmasi
              pembayaran dan pengiriman.
            </template>
            <template v-else>
              Terima kasih! Pesanan Anda sedang diproses oleh penjual. Simpan
              kode pesanan Anda.
            </template>
          </p>

          <div class="success-code">
            <small>Kode Pesanan</small>
            <strong>{{ successPopup.kode }}</strong>
          </div>

          <div class="success-total">
            <span>Total Pembayaran</span>
            <strong>{{ rupiah(successPopup.total) }}</strong>
          </div>

          <div
            v-if="successPopup.metode === 'transfer' && successPopup.bank"
            class="success-bank"
          >
            <small>Transfer ke</small>
            <strong>
              {{ successPopup.bank }} — {{ successPopup.rekening }}
            </strong>
            <span>a.n. {{ successPopup.namaRekening }}</span>
          </div>

          <div class="success-actions">
            <button
              type="button"
              class="success-btn primary"
              @click="goToRiwayat"
            >
              Lihat Pesanan
            </button>
            <button
              type="button"
              class="success-btn secondary"
              @click="goToBelanja"
            >
              Belanja Lagi
            </button>
          </div>

          <!-- TOMBOL WHATSAPP (kalau API gagal) -->
          <a
            v-if="successPopup.apiFailed && successPopup.whatsapp"
            :href="waSuccessLink"
            target="_blank"
            rel="noopener noreferrer"
            class="success-wa"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"
                fill="currentColor"
              />
            </svg>
            Hubungi Penjual via WhatsApp
          </a>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
/* =========================
   PAGE
========================= */
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

/* BREADCRUMB */
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
.breadcrumb strong {
  color: #0865d8;
}

/* HEADING */
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

/* LAYOUT */
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

/* CARD */
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

/* SECTION TITLE */
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

/* FORM */
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
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
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

/* ADDRESS */
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

/* SHIPPING */
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

/* PAYMENT */
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

/* NOTES */
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

/* RIGHT */
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

/* EMPTY CART */
.empty-cart {
  padding: 20px 4px;
  text-align: center;
  color: #8195b3;
  font-size: 13px;
}
.empty-cart p {
  margin: 0 0 12px;
}
.empty-link {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  background: #eaf4ff;
  color: #0865d8;
  font-weight: 600;
  font-size: 12.5px;
  transition: background 0.2s ease;
}
.empty-link:hover {
  background: #dbeaff;
}

/* PRODUCT */
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

/* SUMMARY TOTAL */
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

/* SECURE BOX */
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

/* ORDER BUTTON */
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
  box-shadow: 0 6px 14px rgba(8, 116, 232, 0.22);
}
.order-button:hover:not(:disabled) {
  background: #075fbe;
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(8, 116, 232, 0.3);
}
.order-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}
.order-button svg {
  width: 18px;
  height: 18px;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   POPUP ALERT
========================= */
.alert-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(16, 43, 80, 0.42);
  backdrop-filter: blur(6px);
}
.alert-card {
  position: relative;
  width: min(400px, 100%);
  padding: 32px 28px 26px;
  background: #ffffff;
  border-radius: 22px;
  text-align: center;
  box-shadow:
    0 25px 70px rgba(16, 43, 80, 0.25),
    0 8px 25px rgba(16, 43, 80, 0.1);
  animation: alertShow 0.25s ease-out;
}
@keyframes alertShow {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.alert-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.alert-icon svg {
  width: 36px;
  height: 36px;
}
.type-warning .alert-icon {
  background: #fff7e6;
  color: #f5a623;
}
.type-error .alert-icon {
  background: #fdecec;
  color: #e53935;
}
.type-info .alert-icon {
  background: #eaf4ff;
  color: #0874e8;
}
.type-success .alert-icon {
  background: #e8f8ee;
  color: #1faa52;
}
.alert-card h3 {
  margin: 0 0 10px;
  color: #102b50;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.3px;
}
.alert-card p {
  margin: 0 0 22px;
  color: #6d86ad;
  font-size: 13px;
  line-height: 1.65;
}
.alert-button {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a7bf0 0%, #0865d8 100%);
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.22);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.alert-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(8, 101, 216, 0.32);
}

/* =========================
   POPUP SUKSES
========================= */
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 35, 80, 0.55);
  backdrop-filter: blur(8px);
}
.success-card {
  position: relative;
  overflow: hidden;
  width: min(440px, 100%);
  padding: 44px 36px 30px;
  text-align: center;
  background:
    radial-gradient(circle at 50% -10%, #dff0ff 0, transparent 60%), #ffffff;
  border-radius: 28px;
  box-shadow: 0 30px 70px rgba(12, 35, 80, 0.35);
}
.success-check {
  width: 92px;
  height: 92px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8f8ee;
  animation: bump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.success-check svg {
  width: 64px;
  height: 64px;
}
.success-check .ring {
  stroke: #1faa52;
  stroke-width: 3;
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: draw 0.7s 0.15s ease forwards;
}
.success-check .tick {
  stroke: #1faa52;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.45s 0.7s ease forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes bump {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.success-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #188a43;
  font-size: 12.5px;
  font-weight: 650;
}
.success-card h3 {
  margin: 14px 0 10px;
  color: #0d2051;
  font-size: 26px;
  line-height: 1.3;
  font-weight: 750;
  letter-spacing: -0.5px;
}
.success-card h3 span {
  color: #0865d8;
}
.success-text {
  margin: 0 auto 20px;
  max-width: 340px;
  color: #6d86ad;
  font-size: 13.5px;
  line-height: 1.6;
}
.success-code {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #f4f9ff;
  border: 1px dashed #cfe2f7;
}
.success-code small {
  color: #7d92b8;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.success-code strong {
  color: #0865d8;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
}
.success-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff7ff, #e0eeff);
}
.success-total span {
  color: #526982;
  font-size: 12.5px;
  font-weight: 500;
}
.success-total strong {
  color: #0865d8;
  font-size: 18px;
  font-weight: 800;
}
.success-bank {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px;
  margin-bottom: 18px;
  border-radius: 12px;
  background: #fffbf2;
  border: 1px solid #fcefd0;
  text-align: left;
}
.success-bank small {
  color: #a1824a;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.success-bank strong {
  color: #142d4e;
  font-size: 14px;
  font-weight: 700;
}
.success-bank span {
  color: #7186a1;
  font-size: 12px;
}

.success-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.success-btn {
  height: 48px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 650;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.success-btn.primary {
  border: none;
  background: linear-gradient(135deg, #1a7bf0, #0865d8);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.25);
}
.success-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(8, 101, 216, 0.35);
}
.success-btn.secondary {
  border: 1.5px solid #dbe6f2;
  background: #ffffff;
  color: #0865d8;
}
.success-btn.secondary:hover {
  border-color: #0865d8;
  background: #f4f9ff;
  transform: translateY(-1px);
}

/* TOMBOL WA DI POPUP SUKSES */
.success-wa {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  height: 48px;
  border-radius: 12px;
  background: #25d366;
  color: #ffffff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 650;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(37, 211, 102, 0.25);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.success-wa:hover {
  background: #1faa52;
  transform: translateY(-1px);
}
.success-wa svg {
  width: 18px;
  height: 18px;
}

/* KONFETI */
.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.confetti span {
  position: absolute;
  top: 118px;
  left: calc(var(--i) * 6.6%);
  width: 9px;
  height: 14px;
  border-radius: 3px;
  background: #4e9cff;
  opacity: 0;
  animation: burst 1.6s calc(var(--i) * 0.06s + 0.55s) ease-out forwards;
}
.confetti span:nth-child(3n) {
  background: #ffc83d;
}
.confetti span:nth-child(3n + 1) {
  background: #ff6b7a;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.confetti span:nth-child(4n) {
  background: #1faa52;
}
@keyframes burst {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
  100% {
    opacity: 0;
    transform: translateY(calc(-90px - (var(--i) * 6px)))
      translateX(calc((var(--i) - 7) * 5px)) rotate(420deg);
  }
}

/* TRANSISI */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.3s ease;
}
.pop-enter-active .success-card,
.pop-leave-active .success-card {
  transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}
.pop-enter-from .success-card,
.pop-leave-to .success-card {
  transform: scale(0.85) translateY(20px);
}
@media (prefers-reduced-motion: reduce) {
  .success-check,
  .success-check .ring,
  .success-check .tick,
  .confetti span,
  .spinner {
    animation-duration: 0.01ms;
    animation-delay: 0s;
  }
}

/* RESPONSIVE */
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
  .success-card {
    padding: 36px 24px 24px;
    border-radius: 24px;
  }
  .success-card h3 {
    font-size: 22px;
  }
  .success-check {
    width: 78px;
    height: 78px;
  }
  .success-check svg {
    width: 52px;
    height: 52px;
  }
  .success-actions {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  .alert-card {
    padding: 28px 22px 22px;
  }
  .alert-icon {
    width: 58px;
    height: 58px;
  }
  .alert-icon svg {
    width: 30px;
    height: 30px;
  }
  .alert-card h3 {
    font-size: 18px;
  }
  .alert-card p {
    font-size: 12px;
  }
}
</style>
