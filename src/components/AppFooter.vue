<script setup>
import { ref } from "vue";

const ADDRESS =
  "Jl. Tentara Genie Pelajar No.26, Petemon, Kec. Sawahan, Surabaya, Jawa Timur 60252";
const PHONE = "(031) 5343708";
const PHONE_HREF = "tel:0315343708";
const EMAIL = "smekda.surabaya@gmail.com";

// Peta: Google Maps > cari lokasi > Bagikan > Sematkan peta > salin isi src="..." dari kode iframe
const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.764533376086!2d112.72298567357113!3d-7.258506871307614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f9503d619c43%3A0x411d4cbbe989434!2sSMK%20Negeri%202%20Surabaya!5e1!3m2!1sid!2sid!4v1791467333702!5m2!1sid!2sid";

// Ganti href dengan akun sosial media ARUNA yang asli
const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    icon: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  },
];
// ===== AKHIR DATA YANG DIGANTI =====

const columns = [
  {
    title: "Jelajahi",
    links: [
      { label: "Kategori", to: "/#kategori" },
      { label: "Jelajahi Produk", to: "/#umkm" },
      { label: "Jelajahi Jasa", to: "/#jasa" },
      { label: "Cara Kerja", to: "/#carakerja" },
      { label: "Tentang Kami", to: "/#tentang" },
      { label: "Artikel", to: "/#artikel" },
    ],
  },
  {
    title: "Untuk Penjual",
    links: [
      { label: "Daftarkan UMKM", to: "/#penjual" },
      { label: "Masuk ke Toko", to: "/login" },
      { label: "Pertanyaan Penjual", to: "/#faq" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pertanyaan Umum", to: "/#faq" },
      { label: "Hubungi Kami", to: "/#kontak" },
    ],
  },
];

const year = new Date().getFullYear();
const logoFailed = ref(false);

const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<template>
  <footer class="footer">
    <div class="wrap">
      <!-- BARIS ATAS -->
      <div class="main">
        <div class="brand">
          <RouterLink
            to="/#beranda"
            class="logo"
            aria-label="ARUNA, ke beranda"
          >
            <img
              v-if="!logoFailed"
              src="/images/aruna-logo.png"
              alt="ARUNA"
              @error="logoFailed = true"
            />
            <strong v-else>ARUNA</strong>
          </RouterLink>

          <p class="desc">
            ARUNA adalah platform digital yang menghubungkan masyarakat dengan
            UMKM terdekat. Temukan produk dan jasa lokal berkualitas dari
            provinsi hingga kecamatan, sambil membantu pelaku usaha kecil tumbuh
            dan naik kelas bersama.
          </p>

          <p class="follow">Ikuti kami</p>
          <ul class="socials">
            <li v-for="s in socials" :key="s.name">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`ARUNA di ${s.name}`"
                :title="s.name"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  v-html="s.icon"
                ></svg>
              </a>
            </li>
          </ul>
        </div>

        <nav
          v-for="col in columns"
          :key="col.title"
          class="col"
          :aria-label="col.title"
        >
          <h3>{{ col.title }}</h3>
          <RouterLink v-for="l in col.links" :key="l.label" :to="l.to">{{
            l.label
          }}</RouterLink>
        </nav>
      </div>

      <!-- KANTOR PUSAT -->
      <section id="kontak" class="office" aria-label="Kantor pusat">
        <div class="office-info">
          <h3>Kantor Pusat</h3>
          <p class="office-sub">Kunjungi atau hubungi kami di jam kerja.</p>

          <ul class="contacts">
            <li>
              <span class="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <small>Alamat</small>
                <p>{{ ADDRESS }}</p>
              </div>
            </li>

            <li>
              <span class="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                  />
                </svg>
              </span>
              <div>
                <small>Telepon</small>
                <p>
                  <a :href="PHONE_HREF">{{ PHONE }}</a>
                </p>
              </div>
            </li>

            <li>
              <span class="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <small>Email</small>
                <p>
                  <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div class="map">
          <iframe
            :src="MAP_SRC"
            title="Peta lokasi kantor pusat ARUNA"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <!-- BARIS BAWAH -->
      <div class="bottom">
        <p>
          © {{ year }} ARUNA. Marketplace UMKM Indonesia. Seluruh hak cipta
          dilindungi.
        </p>

        <div class="bottom-right">
          <RouterLink v-for="l in legal" :key="l.label" :to="l.to">{{
            l.label
          }}</RouterLink>

          <button
            type="button"
            class="top"
            aria-label="Kembali ke atas"
            @click="toTop"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ====== TEMA WARNA LIGHT PROFESIONAL ====== */
.footer {
  position: relative;
  overflow: hidden;
  padding: 80px 0 0;
  background: #f8fafc; /* Latar belakang abu-abu sangat muda, bersih */
  border-top: 1px solid #e2e8f0;
  color: #475569;
}

/* Aksen garis biru di paling atas footer */
.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0865d8, #5aaaf5, #0865d8);
}

.wrap {
  position: relative;
  z-index: 1;
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

/* ====== BARIS ATAS (Brand & Links) ====== */
.main {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 56px;
}

.logo {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(8, 101, 216, 0.08); /* Shadow biru halus */
  border: 1px solid #e2e8f0;
}
.logo img {
  display: block;
  height: 38px;
  width: auto;
}
.logo strong {
  color: #0f2744;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.desc {
  max-width: 32em;
  font-size: 14.5px;
  line-height: 1.8;
  color: #64748b;
}

.follow {
  margin: 28px 0 12px;
  color: #0f2744;
  font-size: 14px;
  font-weight: 700;
}
.socials {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.socials a {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #64748b;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}
.socials a:hover {
  background: #0865d8;
  border-color: #0865d8;
  color: #ffffff;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(8, 101, 216, 0.2);
}
.socials svg {
  width: 20px;
  height: 20px;
}

.col {
  display: grid;
  gap: 14px;
  align-content: start;
}
.col h3 {
  position: relative;
  margin-bottom: 8px;
  padding-bottom: 14px;
  color: #0f2744;
  font-size: 16px;
  font-weight: 700;
}
.col h3::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 32px;
  height: 3px;
  border-radius: 3px;
  background: #0865d8;
}
.col a {
  width: fit-content;
  font-size: 14.5px;
  color: #64748b;
  transition: all 0.2s ease;
}
.col a:hover {
  color: #0865d8;
  transform: translateX(4px);
}

/* ====== KANTOR PUSAT (Kartu Putih Terpisah) ====== */
.office {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 32px;
  padding: 32px;
  margin-bottom: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); /* Shadow sangat halus untuk efek kartu */
}

.office-info h3 {
  color: #0f2744;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.office-sub {
  margin: 6px 0 24px;
  color: #64748b;
  font-size: 14px;
}

.contacts {
  list-style: none;
  display: grid;
  gap: 20px;
}
.contacts li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.ic {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #eff6ff; /* Biru sangat muda */
  color: #0865d8;
}
.ic svg {
  width: 20px;
  height: 20px;
}
.contacts small {
  display: block;
  margin-bottom: 4px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.contacts p {
  color: #1e293b;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.6;
}
.contacts a {
  transition: color 0.2s;
}
.contacts a:hover {
  color: #0865d8;
  text-decoration: underline;
}

.map {
  min-height: 280px;
  overflow: hidden;
  border-radius: 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}
.map iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  border: 0;
}

/* ====== BARIS BAWAH (Copyright) ====== */
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 24px 0 32px;
  border-top: 1px solid #e2e8f0;
  font-size: 13.5px;
  color: #64748b;
}
.bottom-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.bottom-right a {
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}
.bottom-right a:hover {
  color: #0865d8;
  text-decoration: underline;
}
.top {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: #ffffff;
  color: #0865d8;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.top:hover {
  background: #0865d8;
  color: #ffffff;
  border-color: #0865d8;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(8, 101, 216, 0.25);
}
.top svg {
  width: 18px;
  height: 18px;
}

/* ====== RESPONSIVE ====== */
@media (max-width: 1100px) {
  .main {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
  }
  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .office {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

@media (max-width: 650px) {
  .footer {
    padding-top: 56px;
  }
  .wrap {
    width: 88%;
  }
  .main {
    grid-template-columns: 1fr 1fr;
    gap: 36px 24px;
  }
  .map,
  .map iframe {
    min-height: 240px;
  }
  .bottom {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 24px;
  }
  .bottom-right {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 420px) {
  .main {
    grid-template-columns: 1fr;
  }
  .bottom-right {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
