<script setup>
import { ref } from "vue";

// Jika foto timmu bernama lain, ubah satu baris ini.
const photo = ref("/images/aruna-tentang.jpg");
const onError = () => {
  photo.value = "/images/kategori-kerajinan.jpg";
};
</script>

<template>
  <section id="tentang" class="about">
    <div class="wrap">
      <div class="top">
        <div class="photo">
          <img
            :src="photo"
            alt="Pelaku UMKM dan pembeli bersama produk lokal"
            loading="lazy"
            @error="onError"
          />
          <div class="photo-note">
            <span class="note-icon">✦</span>
            <p>Bersama UMKM,<br />untuk Indonesia yang lebih maju.</p>
          </div>
        </div>

        <div class="text">
          <span class="pill"><i>✦</i> Siapa Kami?</span>
          <h2>Tentang <span>ARUNA</span></h2>
          <p>
            ARUNA adalah platform digital yang berfokus pada pemberdayaan UMKM
            Indonesia. Kami percaya bahwa produk lokal memiliki kualitas yang
            luar biasa dan mampu bersaing di pasar nasional maupun global.
          </p>
          <p>
            Melalui teknologi, ARUNA hadir untuk menjembatani pelaku UMKM dengan
            masyarakat luas, sehingga produk-produk lokal dapat lebih dikenal,
            dihargai, dan memberikan dampak positif bagi perekonomian Indonesia.
          </p>
        </div>
      </div>

      <div class="vm">
        <article class="vm-card">
          <div class="vm-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h3>Visi Kami</h3>
            <p>
              Menjadi platform terdepan dalam mendukung pertumbuhan UMKM
              Indonesia melalui teknologi dan inovasi.
            </p>
          </div>
        </article>

        <article class="vm-card">
          <div class="vm-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20V11"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M12 12C12 8 9 6 5 6C5 10 8 12 12 12Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M12 14C12 10.5 14.5 8.5 19 8.5C19 12 16 14 12 14Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M7 20H17"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div>
            <h3>Misi Kami</h3>
            <p>
              Menghubungkan UMKM dengan masyarakat, meningkatkan akses pasar,
              serta mendukung perkembangan produk lokal Indonesia.
            </p>
          </div>
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

.top {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 48px;
  align-items: center;
}

.photo {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: #e9f1f8;
  aspect-ratio: 16 / 10;
  box-shadow: 0 14px 34px rgba(36, 91, 153, 0.14);
}
.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-note {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(24, 67, 117, 0.15);
}
.note-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #0865d8;
  color: #fff;
  font-size: 14px;
}
.photo-note p {
  color: #142d4e;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  margin-bottom: 14px;
  background: #eef5ff;
  border: 1px solid #e0edfc;
  border-radius: 20px;
  color: #263f5e;
  font-size: 12px;
  font-weight: 500;
}
.pill i {
  color: #0872df;
  font-style: normal;
}
.text h2 {
  color: #142d4e;
  font-size: clamp(30px, 3.4vw, 46px);
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.15;
  margin-bottom: 14px;
}
.text h2 span {
  color: #0865d8;
}
.text p {
  max-width: 36em;
  margin-bottom: 12px;
  color: #5c718a;
  font-size: 14px;
  line-height: 1.85;
}

.vm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 36px 0;
}
.vm-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(110deg, #f4f9ff, #e8f3ff);
  border: 1px solid #e2ecf8;
  border-radius: 16px;
}
.vm-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: #0865d8;
  box-shadow: 0 6px 16px rgba(36, 91, 153, 0.1);
}
.vm-icon svg {
  width: 30px;
  height: 30px;
}
.vm-card h3 {
  color: #0865d8;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}
.vm-card p {
  color: #405875;
  font-size: 14px;
  line-height: 1.75;
}

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
    gap: 28px;
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
  .vm-card {
    padding: 18px;
    gap: 14px;
  }
  .vm-icon {
    width: 52px;
    height: 52px;
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
