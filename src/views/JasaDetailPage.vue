
<script setup>
import { computed, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { jasaList } from "@/data/jasa";


const route = useRoute();
const activeTab = ref("deskripsi");
const activeImage = ref(0);

const jasa = computed(() =>
  jasaList.find((item) => String(item.id) === String(route.params.id)),
);


const isCourier = computed(() => jasa.value?.category === "Kurir");


const isACService = computed(
  () => jasa.value?.name === "Servis AC Pak Dani"
);





const gallery = computed(() => {
 if (jasa.value?.category === "Jahit") {
  return [
    {
      src: "/images/kebaya-1.png",
      alt: "Kebaya pink dengan detail bordir",
    },
    {
      src: "/images/kebaya-2.png",
      alt: "Proses menjahit kain kebaya",
    },
    {
      src: "/images/kebaya-3.png",
      alt: "Pilihan model kebaya",
    },
    {
      src: "/images/kebaya-4.png",
      alt: "Proses memotong pola kebaya",
    },
  ];
}

  if (isCourier.value) {
    return [
      {
        src: "https://images.pexels.com/photos/6867947/pexels-photo-6867947.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Kurir mengantarkan paket",
      },
      {
        src: "https://images.pexels.com/photos/6867959/pexels-photo-6867959.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Kurir bersama kendaraan pengantaran",
      },
      {
        src: "https://images.pexels.com/photos/6867947/pexels-photo-6867947.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Paket untuk pelanggan",
      },
    ];
  }

  return [
    {
      src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
      alt: "Hidangan makanan",
    },
    {
      src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
      alt: "Sajian makanan segar",
    },
    {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
      alt: "Pilihan hidangan",
    },
    {
      src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85",
      alt: "Sajian makanan lainnya",
    },
  ];
});


const locationText = computed(() =>
  [jasa.value?.district, jasa.value?.city, jasa.value?.province]
    .filter(Boolean)
    .join(", "),
);

const mapQuery = computed(() => {
  if (!jasa.value) return "Gubeng, Surabaya, Jawa Timur, Indonesia";

  return `${jasa.value.district}, ${jasa.value.city}, ${jasa.value.province}, Indonesia`;
});

const mapUrl = computed(
  () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapQuery.value,
    )}`,
);

const mapEmbedUrl = computed(
  () =>
    `https://maps.google.com/maps?q=${encodeURIComponent(
      mapQuery.value,
    )}&z=14&output=embed`,
);



const tabs = computed(() => {
  if (isACService.value) {
    return [
      { id: "deskripsi", label: "Deskripsi" },
      { id: "paket", label: "Layanan & Tarif" },
      { id: "area", label: "Area Layanan" },
      { id: "ulasan", label: "Ulasan" },
    ];
  }

  if (isCourier.value) {
    return [
      { id: "deskripsi", label: "Deskripsi" },
      { id: "paket", label: "Layanan & Tarif" },
      { id: "area", label: "Area Pengantaran" },
      { id: "ulasan", label: "Ulasan" },
    ];
  }

  return [
    { id: "deskripsi", label: "Deskripsi" },
    { id: "paket", label: "Layanan & Paket" },
    { id: "galeri", label: "Galeri" },
    { id: "ulasan", label: "Ulasan" },
  ];
});






const reviewData = {
  1: [
    {
      id: 1,
      name: "Satria Wijaya",
      date: "Pelanggan • 12 September 2026",
      rating: 5,
      comment:
        "Pilihan menu katering terlihat menarik dan cocok untuk kebutuhan acara keluarga. Informasi harga awal juga membantu dalam menyiapkan anggaran.",
      initials: "SW",
    },
    {
      id: 2,
      name: "Syafira Oktaviona",
      date: "Pelanggan • 18 September 2026",
      rating: 4,
      comment:
        "Informasi layanan cukup jelas dan mudah dipahami. Akan lebih membantu jika tersedia rincian paket menu dan jumlah minimum pesanan.",
      initials: "SO",
    },
    {
      id: 3,
      name: "Diandra Alifianto",
      date: "Pelanggan • 25 September 2026",
      rating: 5,
      comment:
        "Katalog layanan tersusun rapi sehingga pelanggan bisa memahami pilihan layanan dan kisaran harga dengan lebih mudah.",
      initials: "DA",
    },
  ],

  2: [
    {
      id: 1,
      name: "Syafira Oktaviona",
      date: "Pelanggan • 14 September 2026",
      rating: 5,
      comment:
        "Informasi layanan pengantaran mudah dipahami. Tarif awalnya juga membantu untuk memperkirakan biaya pengiriman barang dalam kota.",
      initials: "SO",
    },
    {
      id: 2,
      name: "Satria Wijaya",
      date: "Pelanggan • 20 September 2026",
      rating: 4,
      comment:
        "Layanan ini cocok untuk kebutuhan pengantaran barang dan makanan. Saya berharap tersedia informasi estimasi waktu yang lebih terperinci.",
      initials: "SW",
    },
    {
      id: 3,
      name: "Diandra Alifianto",
      date: "Pelanggan • 28 September 2026",
      rating: 5,
      comment:
        "Informasi wilayah layanan membantu pelanggan mengetahui area pengantaran. Tarif dan jangkauan sebaiknya dikonfirmasi sebelum pengiriman.",
      initials: "DA",
    },
  ],

  3: [
    {
      id: 1,
      name: "Satria Wijaya",
      date: "Pelanggan • 11 September 2026",
      rating: 5,
      comment:
        "Informasi layanan cuci AC dan perbaikan mudah dipahami. Harga awal juga membantu sebelum menghubungi penyedia untuk konsultasi.",
      initials: "SW",
    },
    {
      id: 2,
      name: "Diandra Alifianto",
      date: "Pelanggan • 19 September 2026",
      rating: 5,
      comment:
        "Jenis layanan yang ditampilkan cukup jelas. Akan lebih baik jika tersedia rincian biaya untuk setiap jenis perbaikan AC.",
      initials: "DA",
    },
    {
      id: 3,
      name: "Syafira Oktaviona",
      date: "Pelanggan • 27 September 2026",
      rating: 4,
      comment:
        "Informasi lokasi penyedia membantu pelanggan mengetahui wilayah layanan. Jadwal dan biaya kunjungan tetap perlu dikonfirmasi.",
      initials: "SO",
    },
  ],

  4: [
    {
      id: 1,
      name: "Nadia Putri",
      date: "Pelanggan • 15 September 2026",
      rating: 5,
      comment:
        "Informasi layanan jahit kebaya mudah dipahami. Galeri model kebaya juga membantu pelanggan mendapatkan inspirasi sebelum berkonsultasi.",
      initials: "NP",
    },
    {
      id: 2,
      name: "Aulia Rahma",
      date: "Pelanggan • 22 September 2026",
      rating: 4,
      comment:
        "Pilihan model kebaya terlihat menarik. Akan lebih baik jika tersedia informasi estimasi pengerjaan dan pilihan bahan kain.",
      initials: "AR",
    },
    {
      id: 3,
      name: "Dinda Maharani",
      date: "Pelanggan • 29 September 2026",
      rating: 5,
      comment:
        "Informasi layanan membantu pelanggan memahami jasa yang ditawarkan. Detail ukuran, bahan, dan biaya tambahan bisa dikonfirmasi kepada penjahit.",
      initials: "DM",
    },
  ],
};



const reviews = computed(() => reviewData[jasa.value?.id] ?? []);

const averageRating = computed(() => {
  if (!reviews.value.length) return "0.0";

  const total = reviews.value.reduce(
    (sum, review) => sum + review.rating,
    0,
  );

  return (total / reviews.value.length).toFixed(1);
});

const ratingDistribution = computed(() =>
  [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.value.filter((review) => review.rating === rating).length,
    percentage: reviews.value.length
      ? (reviews.value.filter((review) => review.rating === rating).length /
          reviews.value.length) *
        100
      : 0,
  })),
);

</script>

<template>
  <main class="detail-page">
    <div v-if="jasa" class="container">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
        <span>/</span>
        <RouterLink :to="{ name: 'home', hash: '#jasa' }">
          Jelajahi Jasa
        </RouterLink>
        <span>/</span>
        <span>{{ jasa.category }}</span>
        <span>/</span>
        <strong>{{ jasa.name }}</strong>
      </nav>

      <!-- BAGIAN UTAMA -->
      <div class="main-grid">
        <!-- GALERI FOTO -->
        <section class="gallery">
          <div class="main-photo">
            <img
              :src="gallery[activeImage].src"
              :alt="gallery[activeImage].alt"
            />

            <button
              v-if="gallery.length > 1"
              class="photo-arrow prev"
              type="button"
              aria-label="Foto sebelumnya"
              @click="
                activeImage =
                  (activeImage - 1 + gallery.length) % gallery.length
              "
            >
              ‹
            </button>

            <button
              v-if="gallery.length > 1"
              class="photo-arrow next"
              type="button"
              aria-label="Foto berikutnya"
              @click="activeImage = (activeImage + 1) % gallery.length"
            >
              ›
            </button>

            <span class="photo-count">
              {{ activeImage + 1 }} / {{ gallery.length }}
            </span>
          </div>

          <div class="thumbnails">
            <button
              v-for="(photo, index) in gallery"
              :key="photo.src"
              type="button"
              class="thumbnail"
              :class="{ selected: activeImage === index }"
              :aria-label="`Lihat foto ${index + 1}`"
              :aria-pressed="activeImage === index"
              @click="activeImage = index"
            >
              <img :src="photo.src" :alt="photo.alt" />
            </button>
          </div>
        </section>

        <!-- INFORMASI LAYANAN -->
        <section class="service-card">
          <div class="service-top">
            <span class="category-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.8" aria-hidden="true">
                <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M17 3c-2 1.5-3 4-3 7 0 1.7 1 2 3 2v9"/>
              </svg>
              {{ jasa.category }}
            </span>
          </div>

          <h1>{{ jasa.name }}</h1>
          <p class="description">{{ jasa.description }}</p>

          <p class="location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.8" aria-hidden="true">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
            {{ locationText }}
          </p>

          <div class="price">{{ jasa.price }}</div>

          <div class="service-features">
            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="1.8" aria-hidden="true">
                  <path d="M3 6h11v11H3zM14 10h4l3 4v3h-7"/>
                  <circle cx="7" cy="19" r="2"/>
                  <circle cx="17" cy="19" r="2"/>
                </svg>
              </span>
              <div>

<strong>
  {{ isCourier ? "Pengantaran" : isACService ? "Layanan" : "Layanan" }}
</strong>
<span>
  {{ isCourier
    ? "Dalam kota"
    : isACService
      ? "Cuci AC, isi freon, perbaikan"
      : jasa.mode }}
</span>

              </div>
            </div>

            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 7v5l3 2"/>
                </svg>
              </span>
              <div>
             
<strong>{{ isCourier ? "Estimasi" : "Waktu layanan" }}</strong>
<span>
  {{ isCourier
    ? "Konfirmasi penyedia"
    : isACService
      ? "Sesuai kesepakatan"
      : "Sesuai kesepakatan" }}
</span>

              </div>
            </div>

            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="1.8" aria-hidden="true">
                  <path d="M3 11h18v10H3zM7 11V7a5 5 0 0 1 10 0v4"/>
                  <path d="M8 16h.01M12 16h.01M16 16h.01"/>
                </svg>
              </span>
              <div>
     
<strong>{{ isCourier ? "Layanan" : isACService ? "Kategori" : "Kategori" }}</strong>
<span>
  {{ isCourier
    ? "Antar ke lokasi"
    : isACService
      ? "Servis AC"
      : jasa.category }}
</span>

              </div>
            </div>
          </div>

          <div class="action-buttons">
            <a
              class="btn-primary"
              :href="mapUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
              {{ isCourier ? "Lihat Rute" : "Lihat Lokasi" }}
            </a>

            <RouterLink :to="{ name: 'home', hash: '#jasa' }" class="btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Kembali ke Jasa
            </RouterLink>
          </div>

          <p class="helper-text">
            Informasi pemesanan lebih lanjut dapat dikonfirmasi kepada penyedia.
          </p>
        </section>

        <!-- SIDEBAR PENYEDIA -->
        <aside class="sidebar">
          <section class="side-card provider-card">
            <h2>Informasi Penyedia</h2>

            <div class="provider">
              <div class="provider-avatar">
                {{ jasa.name.charAt(0) }}
              </div>
              <div class="provider-info">
                <strong>{{ jasa.name }}</strong>
                <span>Pelaku jasa UMKM</span>
                <span class="provider-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="m8 12 2.5 2.5L16 9"/>
                  </svg>
                  Penyedia layanan
                </span>
              </div>
            </div>

            <div class="side-divider"></div>

            <div class="info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.8" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
              <span>{{ locationText }}</span>
            </div>

            <div class="info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.8" aria-hidden="true">
                <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M17 3c-2 1.5-3 4-3 7 0 1.7 1 2 3 2v9"/>
              </svg>
              <span>{{ jasa.category }}</span>
            </div>

            <div class="info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.8" aria-hidden="true">
                <path d="M3 6h11v11H3zM14 10h4l3 4v3h-7"/>
                <circle cx="7" cy="19" r="2"/>
                <circle cx="17" cy="19" r="2"/>
              </svg>
              <span>{{ jasa.mode }}</span>
            </div>
          </section>

          <section class="side-card location-card">
            <h2>Lokasi Layanan</h2>


            <div class="map-preview">
             
            <iframe
              :src="mapEmbedUrl"
              title="Peta lokasi layanan di Gubeng, Surabaya"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>

            </div>


            <a
              :href="mapUrl"
              class="map-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat di Google Maps ↗
            </a>
            <p class="map-note">
              Lokasi pada peta berdasarkan wilayah, bukan alamat usaha yang spesifik.
            </p>
          </section>
        </aside>

        <!-- DETAIL BERTAB -->
        <section class="detail-panel">
          <div class="tabs" role="tablist" aria-label="Informasi layanan">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.id"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'deskripsi'" class="content-box">
              <h2>Tentang Layanan</h2>
          
<p v-if="isCourier">
  Kurir Cepat Kampung menyediakan layanan pengantaran barang dan makanan
  dalam kota Surabaya dengan cepat, aman, dan praktis. Layanan ini dapat
  digunakan untuk kebutuhan pribadi maupun usaha.
</p>

<p v-else-if="isACService">
  Servis AC Pak Dani melayani cuci AC, pengisian freon, dan perbaikan AC
  untuk kebutuhan rumah tangga maupun tempat usaha. Layanan dilakukan
  dengan peralatan yang sesuai dan jadwal yang dikonfirmasi bersama
  penyedia jasa.
</p>

<p v-else>
  {{ jasa.description }}
</p>


              <div class="highlight-box">
                <h3>Informasi Layanan</h3>
                <div class="highlight-items">
                  <div>
                    <span class="highlight-icon">✓</span>
                    <span>Informasi harga tersedia</span>
                  </div>
                  <div>
                    <span class="highlight-icon">✓</span>
                    <span>Lokasi layanan tercantum</span>
                  </div>
                  <div>
                    <span class="highlight-icon">✓</span>
                    <span>Metode layanan diketahui</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'paket'" class="content-box">
              <h2>Layanan & Paket</h2>
              <p>
                Berikut informasi layanan yang tersedia pada katalog ARUNA.
              </p>

              <div class="package-card">
                <div>
                  <span class="package-label">{{ jasa.category }}</span>
                  <h3>{{ jasa.name }}</h3>
                  <p>{{ jasa.description }}</p>
                </div>
                <strong>{{ jasa.price }}</strong>
              </div>

              <p class="muted-note">
                Rincian paket, pilihan menu, jumlah minimum pesanan, dan biaya
                tambahan belum tersedia dalam data layanan.
              </p>
            </div>

            <div v-else-if="activeTab === 'galeri'" class="content-box">
              <h2>Galeri Foto</h2>
              <p class="muted-note">
                Foto berikut merupakan gambar ilustrasi, bukan dokumentasi
                terverifikasi dari penyedia layanan.
              </p>

              <div class="gallery-grid">
                <button
                  v-for="(photo, index) in gallery"
                  :key="photo.src"
                  type="button"
                  :class="{ selected: activeImage === index }"
                  @click="activeImage = index"
                >
                  <img :src="photo.src" :alt="photo.alt" />
                </button>
              </div>
            </div>


<!-- AREA PENGANTARAN KURIR -->
<div v-else-if="activeTab === 'area' && isCourier" class="content-box">
  <h2>Area Pengantaran</h2>
  <p>
    Kurir Cepat Kampung melayani pengantaran barang dan makanan
    di wilayah Kota Surabaya. Berikut area layanan yang dapat
    menjadi acuan pelanggan.
  </p>

  <div class="delivery-area-list">
    <div class="delivery-area-item">
      <span class="area-icon">01</span>
      <div>
        <h3>Gubeng</h3>
        <p>Area utama layanan kurir.</p>
      </div>
      <span class="area-status">Area utama</span>
    </div>

    <div class="delivery-area-item">
      <span class="area-icon">02</span>
      <div>
        <h3>Genteng</h3>
        <p>Pengantaran dapat dikonfirmasi kepada penyedia.</p>
      </div>
    </div>

    <div class="delivery-area-item">
      <span class="area-icon">03</span>
      <div>
        <h3>Tegalsari</h3>
        <p>Pengantaran dapat dikonfirmasi kepada penyedia.</p>
      </div>
    </div>

    <div class="delivery-area-item">
      <span class="area-icon">04</span>
      <div>
        <h3>Tambaksari</h3>
        <p>Pengantaran dapat dikonfirmasi kepada penyedia.</p>
      </div>
    </div>
  </div>

  <div class="area-info">
    <strong>Perlu diperhatikan</strong>
    <p>
      Wilayah Genteng, Tegalsari, dan Tambaksari merupakan
      kandidat area pengantaran yang perlu dikonfirmasi.
      Jangkauan aktual, ongkos kirim, dan estimasi waktu
      mengikuti ketentuan penyedia jasa.
    </p>
  </div>
</div>


<!-- AREA LAYANAN SERVIS AC -->
<div
  v-else-if="activeTab === 'area' && isACService"
  class="content-box"
>
  <h2>Area Layanan Servis AC</h2>
  <p>
    Servis AC Pak Dani berlokasi di Klojen, Kota Malang.
    Untuk memastikan ketersediaan teknisi, silakan konfirmasi
    wilayah kunjungan sebelum melakukan pemesanan.
  </p>

  <div class="delivery-area-list">
    <div class="delivery-area-item">
      <span class="area-icon">01</span>
      <div>
        <h3>Klojen</h3>
        <p>Wilayah lokasi penyedia layanan.</p>
      </div>
      <span class="area-status">Lokasi penyedia</span>
    </div>

    <div class="delivery-area-item">
      <span class="area-icon">02</span>
      <div>
        <h3>Wilayah sekitar Kota Malang</h3>
        <p>Jangkauan kunjungan perlu dikonfirmasi kepada penyedia.</p>
      </div>
    </div>
  </div>

  <div class="area-info">
    <strong>Informasi kunjungan</strong>
    <p>
      Biaya kunjungan, ongkos transportasi, dan ketersediaan
      teknisi dapat berbeda sesuai lokasi. Konfirmasikan detail
      tersebut sebelum menyepakati jadwal servis.
    </p>
  </div>
</div>




<div v-else-if="activeTab === 'ulasan'" class="content-box reviews-content">
  
<div class="reviews-heading">
  <div>
    <span class="section-eyebrow">PENGALAMAN PELANGGAN</span>
    <h2>Ulasan Pelanggan</h2>
    <p>
      Lihat penilaian dan pendapat mengenai layanan
      {{ jasa.name }}.
    </p>
  </div>

  <span class="review-count">
    {{ reviews.length }} ulasan
  </span>
</div>


  <div class="rating-overview">
    <div class="rating-score">
      <strong>{{ averageRating }}</strong>
      <div class="stars" aria-label="Rating rata-rata">
        <span v-for="star in 5" :key="star">
          {{ Number(averageRating) >= star ? "★" : "☆" }}
        </span>
      </div>
     <span class="rating-caption">Rata-rata rating</span>
    </div>

    <div class="rating-bars">
      <div
        v-for="item in ratingDistribution"
        :key="item.rating"
        class="rating-row"
      >
        <span>{{ item.rating }} ★</span>
        <div class="rating-track">
          <div
            class="rating-fill"
            :style="{ width: `${item.percentage}%` }"
          ></div>
        </div>
        <span class="rating-number">{{ item.count }}</span>
      </div>
    </div>
  </div>

  
<div class="review-notice">
  <span>i</span>
  <p>
    Data ulasan saat ini merupakan ilustrasi untuk kebutuhan
    demonstrasi. Rating dan komentar belum berasal dari
    pelanggan nyata.
  </p>
</div>



<div v-if="reviews.length" class="review-list">
  <article
    v-for="review in reviews"
    :key="review.id"
    class="review-card"
  >
    <div class="review-avatar">{{ review.initials }}</div>

    <div class="review-body">
      <div class="review-top">
        <div>
          <h3>{{ review.name }}</h3>
          <span class="review-date">{{ review.date }}</span>
        </div>

        <span class="review-rating">
          ★ {{ review.rating }}.0
        </span>
      </div>

      <div class="review-stars" aria-label="Bintang ulasan">
        <span v-for="star in 5" :key="star">
          {{ star <= review.rating ? "★" : "☆" }}
        </span>
      </div>

      <p class="review-comment">{{ review.comment }}</p>
    </div>
  </article>
</div>

<div v-else class="empty-reviews">
  <div class="review-symbol">☆</div>
  <h3>Belum ada ulasan</h3>
  <p>
    Belum ada ulasan untuk layanan ini.
    Jadilah pelanggan pertama yang memberikan penilaian.
  </p>
</div>

</div>

          </div>
        </section>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="not-found-icon">!</div>
      <h1>Layanan tidak ditemukan</h1>
      <p>Maaf, layanan yang kamu cari tidak tersedia.</p>
      <RouterLink :to="{ name: 'home', hash: '#jasa' }" class="btn-primary">
        Kembali ke Jelajahi Jasa
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 26px 0 64px;
  background: linear-gradient(180deg, #f2f8ff 0%, #f8fbff 100%);
  color: #142d4e;
}

.container {
  width: 92%;
  max-width: 1440px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
  color: #6c8098;
  font-size: 13px;
}

.breadcrumb a {
  color: #0865d8;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb strong {
  color: #142d4e;
  font-weight: 600;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr) minmax(245px, 0.68fr);
  grid-template-areas:
    "gallery service sidebar"
    "details details sidebar";
  align-items: start;
  gap: 22px;
}

.gallery {
  grid-area: gallery;
  min-width: 0;
}

.main-photo {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1.34;
  border-radius: 16px;
  background: #e4effc;
  box-shadow: 0 8px 26px rgba(31, 79, 133, 0.08);
}

.main-photo > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.photo-arrow {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e7eef8;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  color: #21436b;
  font-size: 28px;
  line-height: 1;
  transform: translateY(-50%);
  cursor: pointer;
  transition: background 0.2s;
}

.photo-arrow:hover {
  background: #eaf4ff;
}

.photo-arrow.prev {
  left: 12px;
}

.photo-arrow.next {
  right: 12px;
}

.photo-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  background: rgba(20, 45, 78, 0.7);
  color: #fff;
  font-size: 12px;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.thumbnail {
  overflow: hidden;
  aspect-ratio: 1.2;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.thumbnail.selected {
  border-color: #0865d8;
  box-shadow: 0 0 0 2px #d6e8ff;
}

.thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-card,
.side-card,
.detail-panel {
  border: 1px solid #e2ecf8;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 5px 22px rgba(31, 79, 133, 0.035);
}

.service-card {
  grid-area: service;
  min-width: 0;
  padding: 24px;
}

.service-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 14px;
  border-radius: 24px;
  background: #edf6ff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
}

.category-pill svg {
  width: 20px;
  height: 20px;
}

.service-card h1 {
  margin: 0 0 12px;
  color: #142d4e;
  font-size: clamp(25px, 2.2vw, 35px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
}

.description {
  margin-bottom: 16px;
  color: #5c718a;
  font-size: 14px;
  line-height: 1.85;
}

.location {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #425b78;
  font-size: 13px;
  line-height: 1.7;
}

.location svg {
  flex: none;
  width: 19px;
  height: 19px;
  color: #0865d8;
}

.price {
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf3fa;
  color: #0865d8;
  font-size: clamp(20px, 1.8vw, 28px);
  font-weight: 800;
  line-height: 1.4;
}

.service-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 16px 0 20px;
}

.feature {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 12px 9px;
  border-radius: 12px;
  background: #f6faff;
}

.feature-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #e8f3ff;
  color: #0865d8;
}

.feature-icon svg {
  width: 21px;
  height: 21px;
}

.feature strong,
.feature span:last-child {
  display: block;
}

.feature strong {
  margin-bottom: 4px;
  color: #213d5e;
  font-size: 11px;
  line-height: 1.5;
}

.feature div > span {
  color: #6c8098;
  font-size: 11px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.btn-primary,
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 46px;
  padding: 11px 15px;
  border: 1px solid #0865d8;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 650;
  text-align: center;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background: #0865d8;
  color: #fff;
}

.btn-primary:hover {
  background: #0754b5;
  transform: translateY(-1px);
}

.btn-outline {
  background: #fff;
  color: #0865d8;
}

.btn-outline:hover {
  background: #f0f7ff;
}

.btn-primary svg,
.btn-outline svg {
  width: 19px;
  height: 19px;
  flex: none;
}

.helper-text {
  margin-top: 12px;
  color: #8494a8;
  font-size: 11px;
  line-height: 1.7;
  text-align: center;
}

.sidebar {
  grid-area: sidebar;
  display: grid;
  gap: 18px;
}

.side-card {
  padding: 20px;
}

.side-card h2 {
  margin-bottom: 20px;
  color: #142d4e;
  font-size: 17px;
  font-weight: 750;
}

.provider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.provider-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d9ebff, #edf6ff);
  color: #0865d8;
  font-size: 23px;
  font-weight: 800;
}

.provider-info {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.provider-info strong {
  color: #142d4e;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.provider-info > span:not(.provider-badge) {
  color: #71849b;
  font-size: 12px;
}

.provider-badge {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 8px;
  background: #edf6ff;
  color: #0865d8;
  font-size: 10px;
  font-weight: 600;
}

.provider-badge svg {
  width: 14px;
  height: 14px;
}

.side-divider {
  height: 1px;
  margin: 18px 0;
  background: #edf3fa;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 15px;
  color: #5c718a;
  font-size: 12px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.info-row svg {
  flex: none;
  width: 18px;
  height: 18px;
  color: #526982;
}


.map-preview {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border: 1px solid #e2ecf8;
  border-radius: 12px;
  background: #eaf4ff;
}

.map-preview iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}


.map-preview svg {
  width: 34px;
  height: 34px;
  color: #0865d8;
}

.map-preview strong {
  color: #142d4e;
  font-size: 14px;
}

.map-preview span {
  color: #647994;
  font-size: 12px;
}

.map-link {
  display: block;
  margin-top: 12px;
  padding: 12px 10px;
  border: 1px solid #d8e8fb;
  border-radius: 10px;
  color: #0865d8;
  font-size: 12px;
  font-weight: 650;
  text-align: center;
  text-decoration: none;
}

.map-link:hover {
  background: #f3f8ff;
}

.map-note {
  margin-top: 10px;
  color: #8494a8;
  font-size: 10px;
  line-height: 1.7;
}

.detail-panel {
  grid-area: details;
  min-width: 0;
  overflow: hidden;
}

.tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #eaf0f8;
}

.tabs button {
  flex: 1;
  min-width: max-content;
  padding: 20px 16px;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #526982;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
}

.tabs button:hover {
  background: #f7fbff;
}

.tabs button.active {
  border-bottom-color: #0865d8;
  color: #0865d8;
}

.tab-content {
  padding: 22px;
}

.content-box {
  padding: 20px;
  border: 1px solid #e7eff9;
  border-radius: 13px;
}

.content-box h2 {
  margin-bottom: 12px;
  color: #142d4e;
  font-size: 19px;
  font-weight: 750;
}

.content-box > p {
  margin-top: 8px;
  color: #5c718a;
  font-size: 13px;
  line-height: 1.9;
}

.highlight-box {
  margin-top: 24px;
  padding: 18px;
  border-radius: 12px;
  background: #edf6ff;
}

.highlight-box h3 {
  margin-bottom: 16px;
  color: #0865d8;
  font-size: 15px;
}

.highlight-items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.highlight-items > div {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #425b78;
  font-size: 12px;
  line-height: 1.6;
}

.highlight-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #fff;
  color: #0865d8;
  font-weight: 800;
}

.package-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e2ecf8;
  border-radius: 12px;
  background: #f9fcff;
}

.package-label {
  color: #0865d8;
  font-size: 11px;
  font-weight: 700;
}

.package-card h3 {
  margin-top: 7px;
  color: #142d4e;
  font-size: 16px;
}

.package-card p {
  max-width: 460px;
  margin-top: 8px;
  color: #647994;
  font-size: 12px;
  line-height: 1.8;
}

.package-card > strong {
  color: #0865d8;
  font-size: 14px;
  line-height: 1.7;
}

.muted-note {
  margin-top: 18px;
  color: #8494a8;
  font-size: 12px;
  line-height: 1.8;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.gallery-grid button {
  overflow: hidden;
  aspect-ratio: 1.4;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #edf6ff;
  cursor: pointer;
}

.gallery-grid button.selected {
  border-color: #0865d8;
}

.gallery-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-reviews {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 32px 12px;
  text-align: center;
}

.review-symbol {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #edf6ff;
  color: #0865d8;
  font-size: 24px;
}

.empty-reviews h3 {
  color: #142d4e;
  font-size: 15px;
}

.empty-reviews p {
  color: #8494a8;
  font-size: 12px;
  line-height: 1.8;
}

.not-found {
  display: grid;
  justify-items: center;
  gap: 14px;
  min-height: 65vh;
  padding: 50px 20px;
  text-align: center;
}

.not-found-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 27px;
  font-weight: 800;
}

.not-found h1 {
  color: #142d4e;
  font-size: 25px;
}

.not-found p {
  color: #647994;
  font-size: 14px;
}

@media (min-width: 1100px) {
  .action-buttons {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "gallery service"
      "sidebar sidebar"
      "details details";
  }

  .sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service-features {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .detail-page {
    padding: 20px 0 42px;
  }

  .container {
    width: 92%;
  }

  .breadcrumb {
    gap: 7px;
    margin-bottom: 16px;
    font-size: 11px;
  }

  .main-grid {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "gallery"
      "service"
      "sidebar"
      "details";
    gap: 16px;
  }

  .service-card {
    padding: 20px 17px;
  }

  .service-card h1 {
    font-size: 27px;
  }

  .service-features {
    gap: 6px;
  }

  .feature {
    padding: 10px 7px;
  }

  .sidebar {
    grid-template-columns: minmax(0, 1fr);
  }

  .side-card {
    padding: 18px;
  }

  .tab-content {
    padding: 13px;
  }

  .tabs button {
    padding: 15px 13px;
    font-size: 12px;
  }

  .content-box {
    padding: 15px;
  }

  .highlight-items {
    grid-template-columns: minmax(0, 1fr);
  }

  .package-card {
    flex-direction: column;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* ULASAN PELANGGAN */
.reviews-content {
  padding: 26px;
}

.reviews-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 24px;
}

.section-eyebrow {
  color: #0865d8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.reviews-heading h2 {
  margin: 8px 0;
  font-size: 24px;
}

.reviews-heading p {
  color: #71849b;
  font-size: 13px;
  line-height: 1.7;
}

.review-count {
  padding: 8px 12px;
  border: 1px solid #dceafb;
  border-radius: 20px;
  background: #f3f8ff;
  color: #0865d8;
  font-size: 11px;
  font-weight: 700;
}

.rating-overview {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 28px;
  padding: 24px;
  border: 1px solid #e2ecf8;
  border-radius: 14px;
  background: linear-gradient(135deg, #f6faff, #edf6ff);
}

.rating-score {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
  border-right: 1px solid #dce8f7;
}

.rating-score > strong {
  color: #142d4e;
  font-size: 48px;
  line-height: 1.2;
}

.stars,
.review-stars {
  color: #f3a92d;
  letter-spacing: 2px;
}

.stars {
  margin-top: 8px;
  font-size: 19px;
}

.rating-caption {
  margin-top: 8px;
  color: #71849b;
  font-size: 11px;
}

.rating-bars {
  display: grid;
  align-content: center;
  gap: 12px;
}

.rating-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 10px;
  color: #526982;
  font-size: 12px;
}

.rating-track {
  height: 8px;
  overflow: hidden;
  border-radius: 20px;
  background: #dce8f7;
}

.rating-fill {
  height: 100%;
  border-radius: inherit;
  background: #0865d8;
  transition: width 0.3s ease;
}

.rating-number {
  text-align: right;
  color: #71849b;
}

.review-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
  padding: 13px 15px;
  border: 1px solid #dceafb;
  border-radius: 10px;
  background: #f6faff;
}

.review-notice > span {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0865d8;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.review-notice p {
  color: #526982;
  font-size: 11px;
  line-height: 1.8;
}

.review-list {
  display: grid;
  gap: 14px;
  margin-top: 22px;
}

.review-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border: 1px solid #e7eff9;
  border-radius: 13px;
  background: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.review-card:hover {
  border-color: #c8def8;
  box-shadow: 0 6px 18px rgba(36, 91, 153, 0.06);
}

.review-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e8f3ff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 800;
}

.review-body {
  flex: 1;
  min-width: 0;
}

.review-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.review-top h3 {
  color: #142d4e;
  font-size: 14px;
}

.review-date {
  display: block;
  margin-top: 5px;
  color: #8a9bb0;
  font-size: 11px;
}

.review-rating {
  flex: none;
  padding: 5px 9px;
  border-radius: 8px;
  background: #fff7e7;
  color: #b77a0b;
  font-size: 11px;
  font-weight: 750;
}

.review-stars {
  margin-top: 10px;
  font-size: 14px;
}

.review-comment {
  margin-top: 10px;
  color: #526982;
  font-size: 12px;
  line-height: 1.9;
}

@media (max-width: 650px) {
  .reviews-content {
    padding: 15px;
  }

  .reviews-heading h2 {
    font-size: 21px;
  }

  .rating-overview {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .rating-score {
    padding: 0 0 18px;
    border-right: 0;
    border-bottom: 1px solid #dce8f7;
  }

  .review-card {
    gap: 11px;
    padding: 14px;
  }

  .review-avatar {
    width: 38px;
    height: 38px;
    font-size: 11px;
  }

  .review-top {
    flex-wrap: wrap;
  }
}


/* AREA PENGANTARAN */
.delivery-area-list {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.delivery-area-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e2ecf8;
  border-radius: 12px;
  background: #fff;
}

.area-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #edf6ff;
  color: #0865d8;
  font-size: 12px;
  font-weight: 800;
}

.delivery-area-item h3 {
  margin: 0 0 5px;
  color: #142d4e;
  font-size: 14px;
}

.delivery-area-item p {
  margin: 0;
  color: #71849b;
  font-size: 12px;
  line-height: 1.7;
}

.area-status {
  margin-left: auto;
  padding: 6px 9px;
  border-radius: 8px;
  background: #edf6ff;
  color: #0865d8;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.area-info {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #dceafb;
  border-radius: 12px;
  background: #f4f9ff;
}

.area-info strong {
  color: #142d4e;
  font-size: 13px;
}

.area-info p {
  margin-top: 7px;
  color: #5c718a;
  font-size: 12px;
  line-height: 1.8;
}

@media (max-width: 650px) {
  .delivery-area-item {
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }

  .area-status {
    margin-left: auto;
  }
}



@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
