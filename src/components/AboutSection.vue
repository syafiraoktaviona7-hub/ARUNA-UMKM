<script setup>
import { ref } from "vue";

const photo = ref("/images/Deskp-Aruna.png");
const onError = () => {
  photo.value = "/images/kategori-kerajinan.jpg";
};

const points = [
  "Langsung dari pembuatnya",
  "Cari UMKM per wilayah",
  "Dukung ekonomi lokal",
];

// Draf visi dan misi UMKM versi universal. Sesuaikan dengan yang sebenarnya.
const visi = [
  "Menjadi platform digital terdepan yang mendukung pertumbuhan UMKM di seluruh Indonesia, baik produk maupun jasa.",
  "Mewujudkan akses pasar yang adil bagi UMKM, dari kota besar hingga pelosok daerah.",
  "Menjadikan produk dan jasa lokal pilihan utama masyarakat melalui teknologi dan inovasi.",
  "Membangun ekosistem UMKM yang mandiri, berdaya saing, dan berkelanjutan.",
];

const misi = [
  "Menghubungkan UMKM dengan masyarakat luas lewat pencarian berdasarkan wilayah, dari provinsi sampai kecamatan.",
  "Memperluas akses pasar bagi pelaku UMKM, baik penjual produk maupun penyedia jasa.",
  "Mendorong UMKM go digital dengan toko online yang mudah dikelola dan digunakan.",
  "Membantu UMKM naik kelas lewat artikel, informasi, dan kabar pelatihan di setiap provinsi.",
  "Menumbuhkan kebiasaan belanja lokal agar perputaran ekonomi tetap dekat dengan masyarakat.",
];
</script>

<template>
  <section id="tentang" class="about">
    <div class="wrap">
      <div class="top">
        <div class="photo-wrap">
          <div class="photo">
            <img
              :src="photo"
              alt="Tentang ARUNA, platform yang menghubungkan UMKM dengan masyarakat"
              loading="lazy"
              @error="onError"
            />
          </div>
        </div>

        <div class="text">
          <span class="pill">
            <span class="pill-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
            </span>
            Cerita di Balik ARUNA
          </span>

          <h2>Tentang <span>ARUNA</span></h2>

          <p class="lead">
            ARUNA adalah platform digital yang berfokus pada
            <strong>pemberdayaan UMKM Indonesia</strong>. Kami percaya bahwa
            produk lokal memiliki kualitas yang luar biasa dan mampu bersaing di
            pasar nasional maupun global.
          </p>
          <p>
            Melalui teknologi, ARUNA hadir untuk menjembatani pelaku UMKM dengan
            masyarakat luas, sehingga produk-produk lokal dapat lebih dikenal,
            dihargai, dan memberikan dampak positif bagi perekonomian Indonesia.
          </p>

          <ul class="points">
            <li v-for="p in points" :key="p">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l3 3 5-6" />
              </svg>
              {{ p }}
            </li>
          </ul>
        </div>
      </div>

      <div class="vm">
        <!-- VISI -->
        <article class="vm-card">
          <header class="vm-head">
            <div class="vm-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3>Visi Kami</h3>
              <p class="vm-sub">Ke mana ARUNA melangkah</p>
            </div>
          </header>

          <ul class="vm-list">
            <li v-for="v in visi" :key="v">
              <span class="tick">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span>{{ v }}</span>
            </li>
          </ul>
        </article>

        <!-- MISI -->
        <article class="vm-card">
          <header class="vm-head">
            <div class="vm-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20V11" />
                <path d="M12 12C12 8 9 6 5 6C5 10 8 12 12 12Z" />
                <path d="M12 14C12 10.5 14.5 8.5 19 8.5C19 12 16 14 12 14Z" />
                <path d="M7 20H17" />
              </svg>
            </div>
            <div>
              <h3>Misi Kami</h3>
              <p class="vm-sub">Bagaimana kami mewujudkannya</p>
            </div>
          </header>

          <ol class="vm-list">
            <li v-for="(m, i) in misi" :key="m">
              <span class="num">{{ i + 1 }}</span>
              <span>{{ m }}</span>
            </li>
          </ol>
        </article>
      </div>

      <div class="banner">
        <div class="banner-text">
          <h2>Bersama ARUNA,<span>UMKM Indonesia Lebih Maju</span></h2>
          <p>Dukung produk lokal, dukung ekonomi bangsa.</p>
          <a href="#umkm" class="banner-btn">Jelajahi Produk <b>→</b></a>
        </div>
        <img
          class="banner-img"
          src="/images/aruna-category-banner.png"
          alt="Produk lokal dan kerajinan Indonesia"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 80px 0;
  background: linear-gradient(180deg, #fff, #f4f9ff);
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

/* ATAS: FOTO + TEKS (tinggi foto mengikuti tinggi teks) */
.top {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: stretch;
}

.photo-wrap {
  position: relative;
  min-height: 420px;
}
.photo {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 22px;
  background: #e9f1f8;
  box-shadow: 0 18px 44px rgba(36, 91, 153, 0.18);
}
.photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0;
}

.pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  margin-bottom: 16px;
  border: 1px solid #cfe3fb;
  border-radius: 30px;
  background: linear-gradient(110deg, #eaf4ff, #fff);
  color: #0a4fa8;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(8, 101, 216, 0.08);
}
.pill-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #0865d8, #3b95f5);
  color: #fff;
}
.pill-icon svg {
  width: 14px;
  height: 14px;
}

.text h2 {
  margin-bottom: 14px;
  color: #142d4e;
  font-size: clamp(32px, 3.6vw, 50px);
  font-weight: 800;
  letter-spacing: -1.4px;
  line-height: 1.12;
}
.text h2 span {
  color: #0865d8;
}
.text p {
  max-width: 36em;
  margin-bottom: 12px;
  color: #5c718a;
  font-size: 14px;
  line-height: 1.9;
}
.text .lead {
  color: #405875;
  font-size: 16px;
  line-height: 1.85;
}
.text .lead strong {
  color: #0865d8;
  font-weight: 700;
}

.points {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.points li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid #e2ecf8;
  border-radius: 24px;
  background: #fff;
  color: #263f5e;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(36, 91, 153, 0.06);
}
.points svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #0865d8;
}

/* VISI & MISI */
.vm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: stretch;
  margin: 48px 0 36px;
}

.vm-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 28px 30px 34px;
  border: 1px solid #e2ecf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(36, 91, 153, 0.07);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.vm-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(36, 91, 153, 0.13);
}
.vm-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, #0865d8, #5aaaf5);
}
.vm-card::after {
  content: "";
  position: absolute;
  right: -60px;
  bottom: -80px;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(8, 101, 216, 0.09), transparent 70%);
  pointer-events: none;
}

.vm-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}
.vm-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #0865d8, #3b95f5);
  color: #fff;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.28);
}
.vm-icon svg {
  width: 28px;
  height: 28px;
}
.vm-head h3 {
  color: #0865d8;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.vm-sub {
  margin-top: 2px;
  color: #647994;
  font-size: 13px;
}

.vm-list {
  position: relative;
  z-index: 1;
  list-style: none;
  display: grid;
  gap: 14px;
}
.vm-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #405875;
  font-size: 14px;
  line-height: 1.7;
}

.tick,
.num {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 1px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.tick {
  background: #eaf4ff;
  color: #0865d8;
}
.tick svg {
  width: 13px;
  height: 13px;
}
.num {
  background: linear-gradient(135deg, #0865d8, #3b95f5);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

/* BANNER */
.banner {
  position: relative;
  min-height: 190px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(105deg, #cfe5ff 0%, #e5f2ff 55%, #d3eaff 100%);
}
.banner-text {
  position: relative;
  z-index: 2;
  width: 52%;
  padding: 28px 48px;
}
.banner-text h2 {
  color: #142d4e;
  font-size: clamp(22px, 2.6vw, 32px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.25;
}
.banner-text h2 span {
  display: block;
  color: #0865d8;
}
.banner-text p {
  margin-top: 6px;
  color: #647994;
  font-size: 14px;
}
.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 12px 22px;
  border-radius: 10px;
  background: #0865d8;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease;
}
.banner-btn:hover {
  background: #0755b7;
}
.banner-img {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  width: 58%;
  height: 100%;
  object-fit: contain;
  object-position: right bottom;
  pointer-events: none;
}

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .photo-wrap {
    min-height: 0;
    aspect-ratio: 3 / 2;
  }
  .vm {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .about {
    padding: 56px 0;
  }
  .wrap {
    width: 88%;
  }
  .text .lead {
    font-size: 15px;
  }
  .vm-card {
    padding: 22px 18px 24px 24px;
    gap: 16px;
  }
  .vm-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }
  .vm-icon svg {
    width: 24px;
    height: 24px;
  }
  .banner {
    min-height: 260px;
    align-items: flex-start;
  }
  .banner-text {
    width: 100%;
    padding: 22px;
  }
  .banner-img {
    width: 80%;
    height: 55%;
  }
}
</style>
