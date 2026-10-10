<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useWilayahFilter } from "@/composables/useWilayahFilter";
import { customer } from "@/services/api";

const router = useRouter();
const route = useRoute();
const { user, logout, updateUser } = useAuth();

const {
  provinces,
  cities,
  districts,
  villages,
  provinceId,
  cityId,
  districtId,
  villageId,
} = useWilayahFilter();

const showEditModal = ref(false);
const showAddressModal = ref(false);

const editForm = ref({
  name: "",
  email: "",
  nomorHp: "",
  tanggalLahir: "",
  jenisKelamin: "",
});

const addressForm = ref({
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  alamatLengkap: "",
});

const profile = computed(() => user.value || {});

// =============================
// RIWAYAT PESANAN (dari API)
// =============================
const orders = ref([]);
const ordersLoading = ref(false);
const ordersError = ref("");

async function loadOrders() {
  ordersLoading.value = true;
  ordersError.value = "";
  try {
    const data = await customer.pesanan();
    orders.value = (data || []).map((o) => ({
      id: o.kode || `ORD-${o.id}`,
      rawId: o.id,
      createdAt: o.created_at || o.updated_at,
      status: o.status || "diproses",
      shop: o.nama_umkm || "-",
      total: o.total || 0,
      payment: o.metode_bayar || "-",
      items: (o.items || []).map((it) => ({
        id: it.id,
        name: it.nama || it.name || "Produk",
        price: it.harga || it.price || 0,
        qty: it.qty || 1,
        image: it.gambar || it.image || null,
      })),
    }));
  } catch (e) {
    ordersError.value = e.message || "Gagal memuat riwayat pesanan.";
  } finally {
    ordersLoading.value = false;
  }
}

watch(
  () => route.path,
  (path) => {
    if (path === "/riwayat-pesanan") {
      loadOrders();
    }
  },
  { immediate: true }
);

// =============================
// FAVORIT (masih localStorage)
// =============================
function loadFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("aruna_favorites") || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const favorites = ref(loadFavorites());

function hapusFavorit(product) {
  const productId = product.id ?? product.key;
  favorites.value = favorites.value.filter(
    (item) => (item.id ?? item.key) !== productId
  );
  localStorage.setItem("aruna_favorites", JSON.stringify(favorites.value));
}

// =============================
// HELPER FORMAT
// =============================
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function statusLabel(status) {
  const map = {
    diproses: "Diproses",
    dikirim: "Dikirim",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
  };
  return map[status] || status || "Diproses";
}

function paymentLabel(mode) {
  const map = {
    transfer: "Transfer Bank",
    ewallet: "E-Wallet",
    cod: "Bayar di Tempat (COD)",
  };
  return map[mode] || mode || "-";
}

const displayName = computed(() => profile.value.name || "Customer ARUNA");
const firstLetter = computed(() =>
  displayName.value.trim().charAt(0).toUpperCase() || "C"
);
const profilePhoto = computed(() => profile.value.photo || null);

const tanggalLahirFormatted = computed(() => {
  if (!profile.value.tanggalLahir) return "-";
  const tanggal = new Date(profile.value.tanggalLahir);
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const alamatLengkap = computed(() => profile.value.alamatLengkap || "-");

const wilayahAlamat = computed(() => {
  const wilayah = [
    profile.value.kelurahan,
    profile.value.kecamatan,
    profile.value.kota,
    profile.value.provinsi,
  ].filter(Boolean);
  return wilayah.length ? wilayah.join(", ") : "-";
});

// =============================
// NAVIGASI
// =============================
function kembaliKeBeranda() {
  router.push("/");
}

function bukaEditProfil() {
  editForm.value = {
    name: profile.value.name || "",
    email: profile.value.email || "",
    nomorHp: profile.value.nomorHp || "",
    tanggalLahir: profile.value.tanggalLahir || "",
    jenisKelamin: profile.value.jenisKelamin || "",
  };
  showEditModal.value = true;
}

function tungguData(dataRef) {
  return new Promise((resolve) => {
    const check = () => {
      if (dataRef.value.length > 0) {
        resolve();
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

function bukaRiwayatPesanan() {
  router.push("/riwayat-pesanan");
}

function bukaFavorit() {
  router.push("/produk-favorit");
}

async function simpanProfil() {
  try {
    if (!editForm.value.name.trim()) {
      alert("Nama lengkap wajib diisi.");
      return;
    }
    if (!editForm.value.email.trim()) {
      alert("Email wajib diisi.");
      return;
    }
    await updateUser({
      name: editForm.value.name.trim(),
      email: editForm.value.email.trim(),
      nomorHp: editForm.value.nomorHp,
      tanggalLahir: editForm.value.tanggalLahir,
      jenisKelamin: editForm.value.jenisKelamin,
    });
    showEditModal.value = false;
    alert("Profil berhasil diperbarui.");
  } catch (error) {
    alert(error.message);
  }
}

async function bukaEditAlamat() {
  addressForm.value = {
    provinsi: profile.value.provinsi || "",
    kota: profile.value.kota || "",
    kecamatan: profile.value.kecamatan || "",
    kelurahan: profile.value.kelurahan || "",
    kodePos: profile.value.kodePos || "",
    alamatLengkap: profile.value.alamatLengkap || "",
  };

  provinceId.value = "";
  cityId.value = "";
  districtId.value = "";
  villageId.value = "";
  showAddressModal.value = true;

  const province = provinces.value.find(
    (item) => item.name === profile.value.provinsi
  );
  if (!province) return;
  provinceId.value = province.id;

  await tungguData(cities);
  const city = cities.value.find((item) => item.name === profile.value.kota);
  if (!city) return;
  cityId.value = city.id;

  await tungguData(districts);
  const district = districts.value.find(
    (item) => item.name === profile.value.kecamatan
  );
  if (!district) return;
  districtId.value = district.id;

  await tungguData(villages);
  const village = villages.value.find(
    (item) => item.name === profile.value.kelurahan
  );
  if (village) villageId.value = village.id;
}

async function simpanAlamat() {
  try {
    if (!provinceId.value) { alert("Provinsi wajib dipilih."); return; }
    if (!cityId.value) { alert("Kota / Kabupaten wajib dipilih."); return; }
    if (!districtId.value) { alert("Kecamatan wajib dipilih."); return; }
    if (!villageId.value) { alert("Kelurahan / Desa wajib dipilih."); return; }
    if (!addressForm.value.alamatLengkap.trim()) {
      alert("Alamat lengkap wajib diisi.");
      return;
    }

    const selectedProvince = provinces.value.find((i) => i.id === provinceId.value);
    const selectedCity = cities.value.find((i) => i.id === cityId.value);
    const selectedDistrict = districts.value.find((i) => i.id === districtId.value);
    const selectedVillage = villages.value.find((i) => i.id === villageId.value);

    await updateUser({
      provinsi: selectedProvince?.name || "",
      kota: selectedCity?.name || "",
      kecamatan: selectedDistrict?.name || "",
      kelurahan: selectedVillage?.name || "",
      kodePos: addressForm.value.kodePos,
      alamatLengkap: addressForm.value.alamatLengkap.trim(),
    });

    showAddressModal.value = false;
    alert("Alamat berhasil diperbarui.");
  } catch (error) {
    alert(error.message);
  }
}

function keluar() {
  const oke = window.confirm(
    "Yakin ingin keluar?\n\nKeranjang belanja Anda akan dikosongkan."
  );
  if (!oke) return;

  logout();
  router.push("/");
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File yang dipilih harus berupa gambar.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const currentUser = JSON.parse(localStorage.getItem("aruna_auth") || "null");
    if (!currentUser) return;
    const updatedUser = { ...currentUser, photo: reader.result };
    localStorage.setItem("aruna_auth", JSON.stringify(updatedUser));
    window.location.reload();
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="profile-page">
    <main class="profile-main">

      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <button type="button" @click="kembaliKeBeranda">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M3 10.5 12 3l9 7.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M5.5 10v10h13V10" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </button>

        <span>›</span>

        <button type="button" @click="kembaliKeBeranda">Beranda</button>

        <span>›</span>
        <span>Akun Saya</span>
        <span>›</span>

        <strong>
          {{
            route.path === "/riwayat-pesanan"
              ? "Riwayat Pesanan"
              : route.path === "/produk-favorit"
                ? "Produk Favorit"
                : "Profil Saya"
          }}
        </strong>
      </div>

      <!-- CONTENT -->
      <div class="profile-layout">

        <!-- ================= SIDEBAR ================= -->
        <aside class="profile-sidebar">

          <button
            type="button"
            class="sidebar-item"
            :class="{ active: route.path === '/profil' }"
            @click="router.push('/profil')"
          >
            <span class="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.8" />
                <path
                  d="M5.5 20c.7-3.4 3-5.2 6.5-5.2s5.8 1.8 6.5 5.2"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span>Profil Saya</span>
          </button>

          <button
            type="button"
            class="sidebar-item"
            :class="{ active: route.path === '/riwayat-pesanan' }"
            @click="bukaRiwayatPesanan"
          >
            <span class="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 4.5h12v15H6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M9 8h6M9 11.5h6M9 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span>Riwayat Pesanan</span>
          </button>

          <button
            type="button"
            class="sidebar-item"
            :class="{ active: route.path === '/produk-favorit' }"
            @click="bukaFavorit"
          >
            <span class="sidebar-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Produk Favorit</span>
          </button>

          <div class="sidebar-divider"></div>

          <button type="button" class="sidebar-item logout" @click="keluar">
            <span class="sidebar-icon">↪</span>
            <span>Keluar</span>
          </button>
        </aside>

        <!-- ================= PROFIL ================= -->
        <section v-if="route.path === '/profil'" class="profile-center">

          <div class="profile-card profile-header-card">
            <div class="profile-title-area">
              <div>
                <h1>Profil Saya</h1>
                <p>
                  Kelola informasi pribadi Anda untuk pengalaman
                  yang lebih baik di ARUNA.
                </p>
              </div>
              <button type="button" class="edit-profile-button" @click="bukaEditProfil">
                <span>✎</span> Edit Profil
              </button>
            </div>

            <div class="profile-header-divider"></div>

            <div class="profile-identity">
              <div class="large-avatar-wrapper">
                <div class="large-avatar">
                  <img v-if="profilePhoto" :src="profilePhoto" :alt="displayName" />
                  <span v-else>{{ firstLetter }}</span>
                </div>

                <label class="camera-button" title="Ganti foto profil">
                  <input type="file" accept="image/*" @change="handlePhotoUpload" />
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 8h3l1.5-2h7L17 8h3v10H4V8Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linejoin="round"
                    />
                    <circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                </label>
              </div>

              <div class="identity-info">
                <div class="name-row">
                  <h2>{{ displayName }}</h2>
                  <span class="active-badge">Akun Aktif</span>
                </div>
                <p class="customer-role">Customer ARUNA</p>
                <p class="profile-quote">
                  "Mendukung UMKM lokal untuk Indonesia yang lebih maju."
                </p>
              </div>
            </div>
          </div>

          <div class="profile-card information-card">
            <div class="section-heading">
              <div class="section-heading-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="7" r="3.2" stroke="currentColor" stroke-width="1.8" />
                  <path
                    d="M5.5 20c.7-3.8 3-5.8 6.5-5.8s5.8 2 6.5 5.8"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <h2>Informasi Pribadi</h2>
            </div>

            <div class="information-grid">
              <div class="information-item">
                <span>Nama Lengkap</span>
                <strong>{{ profile.name || "-" }}</strong>
              </div>
              <div class="information-item">
                <span>Email</span>
                <strong>{{ profile.email || "-" }}</strong>
              </div>
              <div class="information-item">
                <span>Nomor Handphone</span>
                <strong>{{ profile.nomorHp || "-" }}</strong>
              </div>
              <div class="information-item">
                <span>Tanggal Lahir</span>
                <strong>{{ tanggalLahirFormatted }}</strong>
              </div>
              <div class="information-item full">
                <span>Jenis Kelamin</span>
                <strong>{{ profile.jenisKelamin || "-" }}</strong>
              </div>
            </div>
          </div>

          <div class="profile-card address-card">
            <div class="address-header">
              <div class="section-heading">
                <div class="section-heading-icon location-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                </div>
                <h2>Alamat</h2>
              </div>
              <button type="button" class="add-address-button" @click="bukaEditAlamat">
                <span>⊕</span> Tambah Alamat
              </button>
            </div>

            <div class="address-box">
              <div class="address-home-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5.5 10v10h13V10" stroke="currentColor" stroke-width="1.8" />
                  <path d="M9.5 20v-5h5v5" stroke="currentColor" stroke-width="1.8" />
                </svg>
              </div>

              <div class="address-content">
                <span class="main-address-label">Alamat Utama</span>
                <h3>{{ alamatLengkap }}</h3>
                <p>{{ wilayahAlamat }}</p>
              </div>

              <button type="button" class="address-more">⋮</button>
              <button type="button" class="change-address-button" @click="bukaEditAlamat">
                Ubah
              </button>
            </div>
          </div>
        </section>

        <!-- ================= RIWAYAT PESANAN ================= -->
        <section v-else-if="route.path === '/riwayat-pesanan'" class="profile-center">
          <div class="profile-card orders-card">
            <div class="orders-heading">
              <div>
                <h1>Riwayat Pesanan</h1>
                <p>Pantau dan lihat pesanan produk UMKM yang pernah kamu lakukan.</p>
              </div>
              <div class="orders-heading-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 3.5h12v17H6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M9 7h6M9 10.5h6M9 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>
            </div>

            <div class="orders-divider"></div>

            <!-- LOADING -->
            <div v-if="ordersLoading" class="orders-empty">
              <div class="orders-empty-icon">⏳</div>
              <h2>Memuat riwayat pesanan...</h2>
            </div>

            <!-- ERROR -->
            <div v-else-if="ordersError" class="orders-empty">
              <div class="orders-empty-icon">!</div>
              <h2>Gagal memuat pesanan</h2>
              <p>{{ ordersError }}</p>
              <button type="button" class="orders-shop-button" @click="loadOrders">
                Coba Lagi
              </button>
            </div>

            <!-- KOSONG -->
            <div v-else-if="orders.length === 0" class="orders-empty">
              <div class="orders-empty-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.5 7.5 12 11l7.5-3.5M12 11v9"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h2>Belum Ada Pesanan</h2>
              <p>
                Kamu belum memiliki pesanan. Yuk, jelajahi produk UMKM lokal
                dan temukan produk favoritmu!
              </p>
              <button type="button" class="orders-shop-button" @click="router.push('/')">
                Jelajahi Produk
              </button>
            </div>

            <!-- DAFTAR PESANAN -->
            <div v-else class="orders-list">
              <article
                v-for="order in orders"
                :key="order.rawId"
                class="order-item"
              >
                <div class="order-item-header">
                  <div>
                    <strong>{{ order.id }}</strong>
                    <p>{{ new Date(order.createdAt).toLocaleString("id-ID") }}</p>
                  </div>
                  <span class="order-status" :class="`order-status--${order.status}`">
                    {{ statusLabel(order.status) }}
                  </span>
                </div>

                <div class="order-shop">
                  Toko: <strong>{{ order.shop }}</strong>
                </div>

                <div
                  v-for="(item, index) in order.items"
                  :key="item.id || index"
                  class="order-product"
                >
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div class="order-product-info">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.qty }} produk × {{ formatRupiah(item.price) }}</span>
                  </div>
                  <strong>{{ formatRupiah(item.qty * item.price) }}</strong>
                </div>

                <div class="order-total">
                  <span>Total Pembayaran</span>
                  <strong>{{ formatRupiah(order.total) }}</strong>
                </div>

                <div class="order-payment">
                  Metode pembayaran: {{ paymentLabel(order.payment) }}
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- ================= PRODUK FAVORIT ================= -->
        <section v-else-if="route.path === '/produk-favorit'" class="profile-center">
          <div class="profile-card favorites-card">
            <div class="favorites-heading">
              <div>
                <h1>Produk Favorit</h1>
                <p>Kumpulan produk UMKM yang kamu sukai dan ingin kamu simpan.</p>
              </div>
              <div class="favorites-heading-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div class="favorites-divider"></div>

            <div v-if="favorites.length === 0" class="favorites-empty">
              <div class="favorites-empty-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h2>Belum Ada Produk Favorit</h2>
              <p>
                Simpan produk yang kamu sukai agar lebih mudah ditemukan
                kembali nanti.
              </p>
              <button type="button" class="favorites-shop-button" @click="router.push('/')">
                Jelajahi Produk
              </button>
            </div>

            <div v-else class="favorites-grid">
              <article
                v-for="(product, index) in favorites"
                :key="product.id ?? product.key ?? index"
                class="favorite-product-card"
              >
                <div class="favorite-product-image">
                  <img
                    v-if="product.image || product.foto || product.gambar"
                    :src="product.image || product.foto || product.gambar"
                    :alt="product.name || product.nama || 'Produk UMKM'"
                  />
                  <div v-else class="favorite-no-image">Gambar produk</div>

                  <button
                    type="button"
                    class="favorite-remove-button"
                    aria-label="Hapus dari produk favorit"
                    title="Hapus dari favorit"
                    @click="hapusFavorit(product)"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"
                      />
                    </svg>
                  </button>
                </div>

                <div class="favorite-product-info">
                  <h3>{{ product.name || product.nama || "Produk UMKM" }}</h3>
                  <p class="favorite-product-price">
                    {{ formatRupiah(product.price ?? product.harga) }}
                  </p>
                  <button
                    type="button"
                    class="favorite-detail-button"
                    @click="router.push('/')"
                  >
                    Jelajahi Produk
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- ================= RIGHT SIDEBAR (hanya di /profil) ================= -->
        <aside v-if="route.path === '/profil'" class="right-column">

          <div class="profile-card summary-card">
            <h2>Ringkasan Akun</h2>
            <div class="summary-divider"></div>

            <div class="summary-item">
              <span class="summary-icon">✉</span>
              <span>{{ profile.email || "-" }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" stroke-width="1.8" />
                  <path d="M10 6h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <circle cx="12" cy="18" r="0.9" fill="currentColor" />
                </svg>
              </span>
              <span>{{ profile.nomorHp || "-" }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.8" />
                  <path d="M8 3v4M16 3v4M4 9h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path
                    d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <span>{{ tanggalLahirFormatted }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-icon">♀</span>
              <span>{{ profile.jenisKelamin || "-" }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 10h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M5 10v9h14v-9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M4 10 6 5h12l2 5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M9 19v-5h6v5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </span>
              <span>Belum memiliki toko</span>
            </div>
          </div>

          <div class="profile-card security-card">
            <div class="security-image">
              <img src="/images/security-shield.png" alt="Data Anda Aman" />
            </div>
            <h2>Data Anda Aman</h2>
            <p>
              Kami menjaga keamanan data pribadi Anda
              sesuai dengan standar keamanan terbaik.
            </p>
          </div>

          <div class="profile-card tips-card">
            <div class="tips-title">
              <h2>Tips Keamanan Akun</h2>
            </div>
            <ul>
              <li><span>✓</span> Gunakan kata sandi yang kuat</li>
              <li><span>✓</span> Jangan bagikan akun kepada orang lain</li>
              <li><span>✓</span> Selalu perbarui informasi pribadi</li>
              <li><span>✓</span> Logout setelah selesai menggunakan akun</li>
            </ul>
          </div>
        </aside>

      </div>
    </main>

    <!-- ================= MODAL EDIT PROFIL ================= -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="edit-modal">
        <button type="button" class="modal-close" @click="showEditModal = false">×</button>
        <h2>Edit Profil</h2>
        <p class="modal-description">Perbarui informasi pribadi Anda.</p>

        <div class="edit-form">
          <div class="edit-form-group">
            <label>Nama Lengkap</label>
            <input v-model="editForm.name" type="text" placeholder="Masukkan nama lengkap" />
          </div>
          <div class="edit-form-group">
            <label>Email</label>
            <input v-model="editForm.email" type="email" placeholder="Masukkan email" />
          </div>
          <div class="edit-form-group">
            <label>Nomor Handphone</label>
            <input v-model="editForm.nomorHp" type="tel" placeholder="Masukkan nomor handphone" />
          </div>
          <div class="edit-form-group">
            <label>Tanggal Lahir</label>
            <input v-model="editForm.tanggalLahir" type="date" />
          </div>
          <div class="edit-form-group">
            <label>Jenis Kelamin</label>
            <select v-model="editForm.jenisKelamin">
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="modal-cancel-button" @click="showEditModal = false">
            Batal
          </button>
          <button type="button" class="modal-save-button" @click="simpanProfil">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL EDIT ALAMAT ================= -->
    <div v-if="showAddressModal" class="modal-overlay" @click.self="showAddressModal = false">
      <div class="edit-modal address-edit-modal">
        <button type="button" class="modal-close" @click="showAddressModal = false">×</button>
        <h2>Edit Alamat</h2>
        <p class="modal-description">Perbarui alamat utama Anda.</p>

        <div class="edit-form">
          <div class="edit-form-group">
            <label>Provinsi</label>
            <select v-model="provinceId">
              <option value="" disabled>Pilih provinsi</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
          </div>

          <div class="edit-form-group">
            <label>Kota / Kabupaten</label>
            <select v-model="cityId" :disabled="!provinceId">
              <option value="" disabled>Pilih kota / kabupaten</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <div class="edit-form-group">
            <label>Kecamatan</label>
            <select v-model="districtId" :disabled="!cityId">
              <option value="" disabled>Pilih kecamatan</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>

          <div class="edit-form-group">
            <label>Kelurahan / Desa</label>
            <select v-model="villageId" :disabled="!districtId">
              <option value="" disabled>Pilih kelurahan / desa</option>
              <option v-for="village in villages" :key="village.id" :value="village.id">
                {{ village.name }}
              </option>
            </select>
          </div>

          <div class="edit-form-group">
            <label>Kode Pos</label>
            <input v-model="addressForm.kodePos" type="text" placeholder="Masukkan kode pos" />
          </div>

          <div class="edit-form-group full">
            <label>Alamat Lengkap</label>
            <textarea
              v-model="addressForm.alamatLengkap"
              rows="4"
              placeholder="Masukkan alamat lengkap"
            ></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="modal-cancel-button" @click="showAddressModal = false">
            Batal
          </button>
          <button type="button" class="modal-save-button" @click="simpanAlamat">
            Simpan Alamat
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f3f9ff 0%, #edf7ff 100%);
  color: #102b56;
  font-family: "Poppins", sans-serif;
}

.profile-main {
  width: min(1440px, calc(100% - 96px));
  margin: 0 auto;
  padding: 22px 0 50px;
}

.breadcrumb {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: #5b82b5;
  font-size: 14px;
}

.breadcrumb button {
  border: none;
  background: transparent;
  color: #174d93;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

.breadcrumb button:first-child { display: flex; }
.breadcrumb svg { width: 20px; height: 20px; }
.breadcrumb strong { color: #3473c2; font-weight: 500; }

.profile-layout {
  display: grid;
  grid-template-columns: 295px minmax(0, 1fr) 350px;
  gap: 18px;
  align-items: start;
}

.profile-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e4edf7;
  border-radius: 13px;
  box-shadow: 0 8px 25px rgba(54, 108, 164, 0.06);
}

.profile-sidebar {
  min-height: 860px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e4edf7;
  border-radius: 13px;
  box-shadow: 0 8px 25px rgba(54, 108, 164, 0.06);
}

.sidebar-item {
  width: 100%;
  height: 51px;
  margin-bottom: 7px;
  border: none;
  border-radius: 9px;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 0 14px;
  color: #142e59;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}

.sidebar-item:hover,
.sidebar-item.active {
  background: #e5f2ff;
  color: #0865d8;
}

.sidebar-icon {
  width: 28px;
  font-size: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-icon svg {
  width: 22px;
  height: 22px;
  display: block;
}

.sidebar-divider {
  height: 1px;
  background: #e2eaf3;
  margin: 23px 2px;
}

.sidebar-item.logout { color: #172f58; }

/* RIWAYAT PESANAN */
.orders-card { padding: 28px; min-height: 420px; }

.orders-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.orders-heading h1 {
  margin: 0;
  color: #142d56;
  font-size: 27px;
  font-weight: 700;
}

.orders-heading p {
  margin: 8px 0 0;
  color: #627b9f;
  font-size: 13px;
  line-height: 1.7;
}

.orders-heading-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #e5f2ff;
  color: #0865d8;
}

.orders-heading-icon svg { width: 27px; height: 27px; }

.orders-divider {
  height: 1px;
  margin: 22px 0;
  background: #e2eaf3;
}

.orders-empty {
  min-height: 260px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.orders-empty-icon {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 30px;
  font-weight: 700;
}

.orders-empty-icon svg { width: 38px; height: 38px; }

.orders-empty h2 {
  margin: 18px 0 8px;
  color: #142d56;
  font-size: 19px;
  font-weight: 700;
}

.orders-empty p {
  max-width: 390px;
  margin: 0;
  color: #627b9f;
  font-size: 13px;
  line-height: 1.8;
}

.orders-list { display: grid; gap: 16px; }

.order-item {
  padding: 18px;
  border: 1px solid #e2eaf3;
  border-radius: 12px;
  background: #fff;
}

.order-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8eef6;
}

.order-item-header strong { color: #142d56; font-size: 14px; }

.order-item-header p {
  margin: 5px 0 0;
  color: #7186a2;
  font-size: 12px;
}

.order-status {
  padding: 6px 10px;
  border-radius: 20px;
  background: #fff4d8;
  color: #946200;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.order-status--diproses   { background: #fff4d8; color: #946200; }
.order-status--dikirim    { background: #e0f2fe; color: #0369a1; }
.order-status--selesai    { background: #e8f8ee; color: #188a43; }
.order-status--dibatalkan { background: #fde0e0; color: #b91c1c; }

.order-shop {
  margin: 14px 0;
  color: #526d8f;
  font-size: 12px;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f7;
}

.order-product img {
  width: 58px;
  height: 58px;
  border-radius: 8px;
  object-fit: cover;
}

.order-product-info { display: grid; flex: 1; gap: 5px; }
.order-product-info strong { color: #203b60; font-size: 13px; }
.order-product-info span { color: #7186a2; font-size: 12px; }
.order-product > strong { color: #203b60; font-size: 12px; }

.order-total {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  color: #203b60;
  font-size: 13px;
}

.order-total strong { color: #0865d8; }

.order-payment {
  margin-top: 10px;
  color: #7186a2;
  font-size: 12px;
}

.orders-shop-button {
  min-height: 43px;
  margin-top: 22px;
  padding: 0 20px;
  border: none;
  border-radius: 9px;
  background: #0865d8;
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.orders-shop-button:hover { background: #0758bf; }

/* CENTER */
.profile-center {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-header-card { padding: 26px 28px 25px; }

.profile-title-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.profile-title-area h1 {
  margin: 0;
  color: #142d56;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}

.profile-title-area p {
  margin: 4px 0 0;
  color: #627b9f;
  font-size: 13px;
}

.edit-profile-button {
  height: 43px;
  padding: 0 18px;
  border: 1px solid #3c94f2;
  border-radius: 9px;
  background: white;
  color: #0865d8;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.edit-profile-button:hover { background: #f0f7ff; }
.edit-profile-button span { font-size: 21px; }

.profile-header-divider {
  height: 1px;
  background: #e5edf6;
  margin: 18px 0;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 24px;
}

.large-avatar-wrapper { position: relative; flex-shrink: 0; }

.large-avatar {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: linear-gradient(145deg, #dceeff, #b7dcff);
  border: 1px solid #a6d1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #0865d8;
  font-size: 48px;
  font-weight: 700;
}

.large-avatar img { width: 100%; height: 100%; object-fit: cover; }

.camera-button {
  position: absolute;
  right: -2px;
  bottom: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  color: #0865d8;
  border: 1px solid #cde2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(25, 89, 150, 0.15);
  cursor: pointer;
}

.camera-button input { display: none; }
.camera-button svg { width: 20px; height: 20px; }

.identity-info { min-width: 0; }

.name-row {
  display: flex;
  align-items: center;
  gap: 13px;
  flex-wrap: wrap;
}

.name-row h2 {
  margin: 0;
  color: #102a54;
  font-size: 23px;
  font-weight: 700;
}

.active-badge {
  padding: 6px 11px;
  border-radius: 9px;
  background: #d8f8e8;
  color: #0ca35b;
  font-size: 11px;
  font-weight: 600;
}

.customer-role {
  margin: 5px 0 9px;
  color: #3973b6;
  font-size: 15px;
}

.profile-quote {
  margin: 0;
  color: #58759a;
  font-size: 13px;
}

.information-card { padding: 19px 28px 21px; }

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.section-heading-icon {
  width: 31px;
  height: 31px;
  color: #0865d8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-heading-icon svg { width: 27px; height: 27px; display: block; }

.section-heading h2 {
  margin: 0;
  color: #142d56;
  font-size: 20px;
  font-weight: 700;
}

.information-grid {
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
}

.information-item {
  min-height: 64px;
  padding: 9px 20px;
  border-radius: 10px;
  background: linear-gradient(120deg, #f0f5fb, #f5f8fc);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.information-item.full { grid-column: 1 / -1; }

.information-item span { color: #597596; font-size: 12px; }

.information-item strong {
  margin-top: 2px;
  color: #122b54;
  font-size: 15px;
  font-weight: 500;
}

.address-card { padding: 18px 28px 22px; }

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.location-icon svg { width: 25px; height: 25px; }

.add-address-button {
  height: 41px;
  padding: 0 15px;
  border: 1px solid #68a9ed;
  border-radius: 9px;
  background: white;
  color: #0865d8;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.add-address-button:hover { background: #f1f8ff; }
.add-address-button span { font-size: 20px; }

.address-box {
  position: relative;
  min-height: 145px;
  margin-top: 13px;
  padding: 17px 68px 17px 60px;
  border: 1px solid #cce3fb;
  border-radius: 11px;
  background: linear-gradient(120deg, #f1f8ff, #f8fbff);
}

.address-home-icon {
  position: absolute;
  left: 19px;
  top: 19px;
  color: #0865d8;
}

.address-home-icon svg { width: 20px; height: 20px; }

.address-content { min-width: 0; }

.main-address-label {
  display: inline-block;
  padding: 5px 12px;
  background: #dceeff;
  color: #0865d8;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.address-content h3 {
  margin: 10px 0 2px;
  color: #142d56;
  font-size: 15px;
  font-weight: 500;
}

.address-content p {
  margin: 0;
  color: #5880b4;
  font-size: 13px;
  line-height: 1.55;
}

.address-more {
  position: absolute;
  right: 16px;
  top: 16px;
  border: none;
  background: transparent;
  color: #0e376e;
  font-size: 25px;
  cursor: pointer;
}

.change-address-button {
  position: absolute;
  right: 24px;
  bottom: 18px;
  height: 42px;
  min-width: 92px;
  border: 1px solid #d9e9f9;
  border-radius: 9px;
  background: #e8f4ff;
  color: #0865d8;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* RIGHT COLUMN */
.right-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card { padding: 21px 24px; }

.summary-card h2 {
  margin: 0;
  color: #142d56;
  font-size: 20px;
}

.summary-divider {
  height: 1px;
  background: #e5edf6;
  margin: 16px 0 0;
}

.summary-item {
  min-height: 52px;
  border-bottom: 1px solid #e5edf6;
  display: flex;
  align-items: center;
  gap: 17px;
  color: #142d56;
  font-size: 13px;
}

.summary-item:last-child { border-bottom: none; }

.summary-icon {
  width: 28px;
  height: 28px;
  color: #102d58;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon svg { width: 22px; height: 22px; display: block; }

.security-card {
  min-height: 230px;
  padding: 19px 25px;
  text-align: center;
}

.security-image {
  height: 105px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.security-image img {
  width: 105px;
  height: 105px;
  object-fit: contain;
}

.security-card h2 {
  margin: 4px 0 5px;
  color: #142d56;
  font-size: 17px;
}

.security-card p {
  max-width: 270px;
  margin: 0 auto;
  color: #6081a9;
  font-size: 12px;
  line-height: 1.55;
}

.tips-card { padding: 22px 25px; }

.tips-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tips-title h2 {
  margin: 0;
  color: #142d56;
  font-size: 17px;
}

.tips-card ul {
  list-style: none;
  margin: 17px 0 0;
  padding: 0;
}

.tips-card li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 11px;
  color: #18345d;
  font-size: 12px;
  line-height: 1.5;
}

.tips-card li:last-child { margin-bottom: 0; }

.tips-card li span {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 50%;
  background: #0865d8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(16, 43, 86, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.edit-modal {
  position: relative;
  width: min(620px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 25px 70px rgba(16, 43, 86, 0.2);
}

.edit-modal h2 {
  margin: 0;
  color: #142d56;
  font-size: 24px;
  font-weight: 700;
}

.modal-description {
  margin: 6px 0 24px;
  color: #7187a7;
  font-size: 13px;
}

.edit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}

.edit-form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.edit-form-group.full { grid-column: 1 / -1; }

.edit-form-group label {
  color: #263f66;
  font-size: 13px;
  font-weight: 600;
}

.edit-form-group input,
.edit-form-group select,
.edit-form-group textarea {
  width: 100%;
  border: 1px solid #d8e4f1;
  border-radius: 9px;
  background: #ffffff;
  padding: 12px 13px;
  outline: none;
  color: #203b61;
  font-family: inherit;
  font-size: 13px;
}

.edit-form-group input,
.edit-form-group select { height: 45px; }

.edit-form-group textarea { resize: vertical; min-height: 100px; }

.edit-form-group input:focus,
.edit-form-group select:focus,
.edit-form-group textarea:focus {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.modal-close {
  position: absolute;
  right: 14px;
  top: 12px;
  border: none;
  background: transparent;
  color: #6f84a1;
  font-size: 25px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.modal-cancel-button,
.modal-save-button {
  height: 43px;
  padding: 0 18px;
  border-radius: 9px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.modal-cancel-button {
  border: 1px solid #d8e4f1;
  background: #f4f8fc;
  color: #55708f;
}

.modal-cancel-button:hover { background: #eaf1f8; }

.modal-save-button {
  border: none;
  background: #0865d8;
  color: #ffffff;
}

.modal-save-button:hover { background: #0758bf; }

/* PRODUK FAVORIT */
.favorites-card { min-width: 0; padding: 28px; }

.favorites-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.favorites-heading h1 {
  margin: 0;
  color: #142d56;
  font-size: 27px;
  font-weight: 700;
}

.favorites-heading p {
  margin: 8px 0 0;
  color: #627b9f;
  font-size: 13px;
  line-height: 1.7;
}

.favorites-heading-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #e5f2ff;
  color: #0865d8;
}

.favorites-heading-icon svg { width: 27px; height: 27px; }

.favorites-divider {
  height: 1px;
  margin: 22px 0;
  background: #e2eaf3;
}

.favorites-empty {
  min-height: 280px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.favorites-empty-icon {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eaf4ff;
  color: #0865d8;
}

.favorites-empty-icon svg { width: 38px; height: 38px; }

.favorites-empty h2 {
  margin: 18px 0 8px;
  color: #142d56;
  font-size: 19px;
}

.favorites-empty p {
  max-width: 390px;
  margin: 0;
  color: #627b9f;
  font-size: 13px;
  line-height: 1.8;
}

.favorites-shop-button,
.favorite-detail-button {
  min-height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: #0865d8;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.favorites-shop-button { margin-top: 20px; }

.favorites-shop-button:hover,
.favorite-detail-button:hover { background: #0758bf; }

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.favorite-product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e2eaf3;
  border-radius: 12px;
  background: #fff;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.favorite-product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(54, 108, 164, 0.1);
}

.favorite-product-image {
  position: relative;
  height: 170px;
  background: #f1f7fd;
}

.favorite-product-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.favorite-no-image {
  height: 100%;
  display: grid;
  place-items: center;
  color: #7890ad;
  font-size: 12px;
}

.favorite-remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid #e2eaf3;
  border-radius: 50%;
  background: #fff;
  color: #e14b67;
  cursor: pointer;
}

.favorite-remove-button svg { width: 19px; height: 19px; }
.favorite-remove-button:hover { background: #fff0f3; }

.favorite-product-info { padding: 14px; }

.favorite-product-info h3 {
  margin: 0;
  color: #142d56;
  font-size: 14px;
  line-height: 1.5;
}

.favorite-product-price {
  margin: 8px 0 14px;
  color: #0865d8;
  font-size: 14px;
  font-weight: 700;
}

.favorite-detail-button { width: 100%; }

/* RESPONSIVE */
@media (max-width: 1200px) {
  .profile-layout { grid-template-columns: 230px minmax(0, 1fr); }
  .right-column {
    grid-column: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .tips-card { grid-column: 1 / -1; }
}

@media (max-width: 900px) {
  .profile-main { width: min(100% - 30px, 700px); }
  .profile-layout { grid-template-columns: 1fr; }
  .profile-sidebar { min-height: auto; }
  .right-column {
    grid-column: auto;
    display: flex;
  }
}

@media (max-width: 600px) {
  .profile-main { padding-top: 12px; }
  .profile-layout { gap: 12px; }
  .profile-title-area { align-items: flex-start; flex-direction: column; }
  .profile-identity { align-items: flex-start; flex-direction: column; }
  .information-grid { grid-template-columns: 1fr; }
  .information-item.full { grid-column: auto; }
  .address-header { align-items: flex-start; gap: 10px; flex-direction: column; }
  .address-box { padding-right: 20px; }
  .change-address-button { position: static; margin-top: 15px; }
  .breadcrumb { font-size: 11px; gap: 7px; }

  .orders-card { padding: 22px 18px; }
  .orders-heading h1 { font-size: 22px; }
  .orders-heading-icon { width: 42px; height: 42px; }

  .favorites-card { padding: 22px 18px; }
  .favorites-heading h1 { font-size: 22px; }
  .favorites-grid { grid-template-columns: 1fr; }
  .favorite-product-image { height: 200px; }

  .edit-modal { padding: 24px 20px; }
  .edit-form { grid-template-columns: 1fr; }
  .edit-form-group.full { grid-column: auto; }
  .modal-actions { flex-direction: column; }
  .modal-cancel-button,
  .modal-save-button { width: 100%; }
}
</style>