<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { katalog } from "@/services/api";
import ArticleSidebar from "@/components/ArticleSidebar.vue";

const route = useRoute();
const article = ref(null);

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return;
    try {
      article.value = await katalog.artikelDetail(id);
    } catch {
      article.value = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <main class="page">
    <div v-if="article" class="wrap layout">
      <!-- ARTIKEL UTAMA -->
      <article class="post">
        <div class="chips">
          <span v-for="c in article.categories" :key="c" class="chip">
            {{ c }}
          </span>
        </div>

        <h1>{{ article.title }}</h1>

        <div class="byline">
          <p class="author">{{ article.author }}</p>
          <p class="meta">{{ article.date }} • {{ article.time }}</p>
        </div>

        <img class="cover" :src="article.image" :alt="article.title" />

        <div class="content">
          <template v-for="(b, i) in article.content" :key="i">
            <h2 v-if="b.type === 'h2'">{{ b.text }}</h2>
            <p v-else>{{ b.text }}</p>
          </template>
        </div>

        <RouterLink to="/#artikel" class="back">
          ← Kembali ke daftar artikel
        </RouterLink>
      </article>

      <!-- SIDEBAR -->
      <ArticleSidebar :current-id="article.id" />
    </div>

    <div v-else class="wrap missing">
      <h1>Artikel tidak ditemukan</h1>
      <p>Artikel yang kamu cari mungkin sudah dipindahkan atau dihapus.</p>
      <RouterLink to="/#artikel" class="back">
        ← Kembali ke daftar artikel
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* =========================
   HALAMAN
========================= */
.page {
  padding: 40px 0 80px;
  background: #fff;
  overflow-x: hidden;
  width: 100%;
}

.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

/* =========================
   LAYOUT
========================= */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: 0;
}

.post {
  min-width: 0;
  padding-right: 36px;
  border-right: 1px solid #e2ecf8;
}

/* =========================
   CHIPS
========================= */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.chip {
  padding: 7px 18px;
  border-radius: 20px;
  background: #eaf4ff;
  color: #0865d8;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

/* =========================
   JUDUL
========================= */
h1 {
  color: #142d4e;
  font-size: clamp(26px, 3.4vw, 44px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.byline {
  margin-top: 14px;
}

.author {
  color: #142d4e;
  font-size: 16px;
  font-weight: 600;
}

.meta {
  margin-top: 4px;
  color: #647994;
  font-size: 14px;
  font-weight: 500;
}

/* =========================
   COVER
========================= */
.cover {
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 460px;
  margin: 24px 0 28px;
  object-fit: cover;
  border-radius: 12px;
  background: #e9f1f8;
}

/* =========================
   KONTEN
========================= */
.content {
  max-width: 46em;
}

.content h2 {
  margin: 28px 0 10px;
  color: #142d4e;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  word-wrap: break-word;
}

.content p {
  margin-bottom: 14px;
  color: #3c5069;
  font-size: 16px;
  line-height: 1.9;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* =========================
   BACK LINK
========================= */
.back {
  display: inline-block;
  margin-top: 28px;
  color: #0865d8;
  font-size: 14px;
  font-weight: 600;
}

.back:hover {
  text-decoration: underline;
}

/* =========================
   NOT FOUND
========================= */
.missing {
  padding: 60px 0;
}

.missing p {
  margin: 10px 0 0;
  color: #647994;
}

/* =========================
   RESPONSIVE
========================= */

/* Tablet: sidebar turun ke bawah */
@media (max-width: 1000px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .post {
    padding-right: 0;
    border-right: none;
  }
}

/* Mobile: padding & font size */
@media (max-width: 768px) {
  .page {
    padding: 28px 0 60px;
  }

  h1 {
    font-size: clamp(24px, 6vw, 32px);
    line-height: 1.3;
  }

  .author {
    font-size: 15px;
  }

  .meta {
    font-size: 13px;
  }

  .cover {
    margin: 20px 0 24px;
    max-height: 320px;
    border-radius: 10px;
  }

  .content h2 {
    font-size: 19px;
    margin: 24px 0 8px;
  }

  .content p {
    font-size: 15px;
    line-height: 1.85;
  }
}

/* Mobile kecil */
@media (max-width: 480px) {
  .page {
    padding: 20px 0 50px;
  }

  h1 {
    font-size: 22px;
    letter-spacing: -0.5px;
  }

  .author {
    font-size: 14px;
  }

  .meta {
    font-size: 12px;
  }

  .chip {
    font-size: 12px;
    padding: 6px 14px;
  }

  .cover {
    margin: 16px 0 20px;
    max-height: 260px;
    border-radius: 8px;
  }

  .content h2 {
    font-size: 17px;
  }

  .content p {
    font-size: 14.5px;
    line-height: 1.8;
  }

  .back {
    font-size: 13px;
    margin-top: 24px;
  }
}
</style>