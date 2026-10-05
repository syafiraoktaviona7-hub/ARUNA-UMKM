<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { db, sections } from "@/data/adminData";

const route = useRoute();
const search = ref("");
const status = ref("");

const cfg = computed(() => sections[route.params.section]);

watch(() => route.params.section, () => {
  search.value = "";
  status.value = "";
});

const rows = computed(() => {
  const c = cfg.value;
  const q = search.value.trim().toLowerCase();
  return db[c.data].filter((r) => {
    if (c.fixed && r.status !== c.fixed) return false;
    if (status.value && r.status !== status.value) return false;
    return !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q));
  });
});

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const cell = (r, key) => (cfg.value.money?.includes(key) ? rupiah(r[key]) : r[key]);
const canAct = (a, r) => !a.when || a.when.includes(r.status);
</script>

<template>
  <div v-if="cfg">
    <p class="desc">{{ cfg.desc }}</p>

    <div class="tools">
      <input v-model="search" type="search" placeholder="Cari nama, kota, atau kata kunci" aria-label="Cari" />
      <select v-if="cfg.statuses.length" v-model="status" aria-label="Filter status">
        <option value="">Semua status</option>
        <option v-for="s in cfg.statuses" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="table-wrap">
      <table v-if="rows.length">
        <thead>
          <tr>
            <th v-for="[, label] in cfg.columns" :key="label">{{ label }}</th>
            <th>Status</th>
            <th v-if="cfg.actions.length">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td v-for="[key] in cfg.columns" :key="key">{{ cell(r, key) }}</td>
            <td><span class="badge" :class="r.status">{{ r.status }}</span></td>
            <td v-if="cfg.actions.length" class="acts">
              <button
                v-for="a in cfg.actions.filter((x) => canAct(x, r))"
                :key="a.label"
                :class="a.tone"
                @click="r.status = a.set"
              >
                {{ a.label }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Tidak ada data yang cocok. Ubah kata kunci atau filter status.</p>
    </div>
  </div>
</template>

<style scoped>
.desc { margin-bottom: 16px; color: var(--muted); }
.tools { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.tools input, .tools select {
  padding: 10px 14px; background: var(--white); color: var(--ink);
  border: 1px solid var(--line); border-radius: var(--radius);
}
.tools input { flex: 1; min-width: 220px; max-width: 360px; }
.table-wrap { overflow-x: auto; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { padding: 13px 16px; text-align: left; white-space: nowrap; }
th { font-weight: 500; color: var(--muted); background: var(--bg); }
tbody tr + tr td { border-top: 1px solid var(--line); }
.badge { padding: 3px 10px; font-size: 0.8rem; border-radius: 999px; background: var(--bg); color: var(--muted); }
.badge.aktif, .badge.tampil, .badge.selesai { background: #e3f6ec; color: #17794a; }
.badge.menunggu, .badge.diproses, .badge.baru { background: #fff3dc; color: #9a6200; }
.badge.dikirim { background: #e4efff; color: var(--blue-dark); }
.badge.ditangguhkan, .badge.ditolak, .badge.diblokir, .badge.dibatalkan, .badge.disembunyikan { background: #fdecea; color: #b3261e; }
.acts { display: flex; gap: 8px; }
.acts button { padding: 6px 12px; font-size: 0.85rem; border-radius: 8px; background: var(--white); border: 1px solid var(--line); }
.acts .ok { color: #fff; background: var(--blue); border-color: var(--blue); }
.acts .ok:hover { background: var(--blue-dark); }
.acts .bad { color: #b3261e; border-color: #f0c4c0; }
.acts .bad:hover { background: #fdecea; }
.empty { padding: 40px 16px; text-align: center; color: var(--muted); }
</style>