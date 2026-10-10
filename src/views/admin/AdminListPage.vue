<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { sections } from "@/data/adminData";
import { admin } from "@/services/api";
import { useAdminCounts } from "@/composables/useAdminCounts";

const route = useRoute();
const { refresh: refreshCounts } = useAdminCounts();

const search = ref(String(route.query.q || ""));
const status = ref("");
const rows = ref([]);
const loading = ref(true);
const error = ref("");
const busy = ref("");

const cfg = computed(() => sections[route.params.section]);

let timer;
let seq = 0;

// Ambil data dari server (filter status dan pencarian dikerjakan backend)
async function load() {
  if (!cfg.value) return;
  const my = ++seq;
  loading.value = true;
  error.value = "";
  try {
    const data = await admin.daftar(route.params.section, {
      status: status.value,
      q: search.value.trim(),
    });
    if (my === seq) rows.value = data;
  } catch (e) {
    if (my === seq) {
      rows.value = [];
      error.value = e.message;
    }
  } finally {
    if (my === seq) loading.value = false;
  }
}

// Ganti halaman atau datang dari pencarian di topbar (?q=...)
watch(() => [route.params.section, route.query.q], ([, q]) => {
  search.value = String(q || "");
  status.value = "";
});

watch([() => route.params.section, status, search], () => {
  clearTimeout(timer);
  timer = setTimeout(load, 250);
});

load();
onBeforeUnmount(() => clearTimeout(timer));

const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const cell = (r, key) => (cfg.value.money?.includes(key) ? rupiah(r[key]) : r[key]);
const canAct = (a, r) => !a.when || a.when.includes(r.status);

async function act(a, r) {
  if (busy.value) return;
  busy.value = `${r.id}:${a.label}`;
  error.value = "";
  try {
    await admin.ubahStatus(route.params.section, r.id, a.set);
    await Promise.all([load(), refreshCounts()]);
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = "";
  }
}
</script>

<template>
  <div v-if="cfg">
    <p class="desc">{{ cfg.desc }}</p>

    <div class="tools">
      <input v-model="search" type="search" placeholder="Cari nama atau kata kunci" aria-label="Cari" />
      <select v-if="cfg.statuses.length" v-model="status" aria-label="Filter status">
        <option value="">Semua status</option>
        <option v-for="s in cfg.statuses" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <p v-if="error" class="err" role="alert">{{ error }}</p>

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
                :disabled="!!busy"
                @click="act(a, r)"
              >
                {{ a.label }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="loading" class="empty">Memuat data...</p>
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
@media (max-width: 560px) {
  .tools input { min-width: 100%; max-width: none; }
  .tools select { flex: 1; }
  th, td { padding: 11px 12px; }
}
.err { margin-bottom: 14px; padding: 10px 14px; font-size: 0.9rem; color: #b3261e; background: #fdecea; border-radius: 8px; }
.acts button:disabled { opacity: 0.6; cursor: wait; }
.empty { padding: 40px 16px; text-align: center; color: var(--muted); }
</style>