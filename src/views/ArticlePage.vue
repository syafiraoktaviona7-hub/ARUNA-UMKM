<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { articles } from "@/data/articles";
import ArticleSidebar from "@/components/ArticleSidebar.vue";

const route = useRoute();
const article = computed(() =>
  articles.find((a) => String(a.id) === route.params.id),
);
</script>

<template>
  <main class="page">
    <div v-if="article" class="wrap layout">
      <article class="post">
        <div class="chips">
          <span v-for="c in article.categories" :key="c" class="chip">{{
            c
          }}</span>
        </div>

        <h1>{{ article.title }}</h1>
        <p class="author">{{ article.author }}</p>
        <p class="meta">{{ article.date }} • {{ article.time }}</p>

        <img class="cover" :src="article.image" :alt="article.title" />

        <div class="content">
          <template v-for="(b, i) in article.content" :key="i">
            <h2 v-if="b.type === 'h2'">{{ b.text }}</h2>
            <p v-else>{{ b.text }}</p>
          </template>
        </div>

        <RouterLink to="/#artikel" class="back"
          >← Kembali ke daftar artikel</RouterLink
        >
      </article>

      <ArticleSidebar :current-id="article.id" />
    </div>

    <div v-else class="wrap missing">
      <h1>Artikel tidak ditemukan</h1>
      <p>Artikel yang kamu cari mungkin sudah dipindahkan atau dihapus.</p>
      <RouterLink to="/#artikel" class="back"
        >← Kembali ke daftar artikel</RouterLink
      >
    </div>
  </main>
</template>

<style scoped>
.page {
  padding: 40px 0 80px;
  background: #fff;
}
.wrap {
  width: 85.5%;
  max-width: 1440px;
  margin: 0 auto;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
}

.post {
  padding-right: 36px;
  border-right: 1px solid #e2ecf8;
}

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
}

h1 {
  color: #142d4e;
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.8px;
}
.author {
  margin-top: 14px;
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

.cover {
  width: 100%;
  max-height: 460px;
  margin: 24px 0 28px;
  object-fit: cover;
  border-radius: 12px;
  background: #e9f1f8;
}

.content {
  max-width: 46em;
}
.content h2 {
  margin: 28px 0 10px;
  color: #142d4e;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
}
.content p {
  margin-bottom: 14px;
  color: #3c5069;
  font-size: 16px;
  line-height: 1.9;
}

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

.missing {
  padding: 60px 0;
}
.missing p {
  margin: 10px 0 0;
  color: #647994;
}

@media (max-width: 1000px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .post {
    padding-right: 0;
    border-right: none;
  }
}
@media (max-width: 650px) {
  .page {
    padding-top: 24px;
  }
  .wrap {
    width: 88%;
  }
}
</style>
