<script setup>
import { computed } from "vue";
import { db } from "@/data/adminData";

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const count = (list, status) => list.filter((x) => x.status === status).length;

const stats = computed(() => [
  { label: "UMKM aktif", value: count(db.umkm, "aktif"), note: `${db.umkm.length} terdaftar`, tone: "blue" },
  { label: "Menunggu verifikasi", value: count(db.umkm, "menunggu"), note: "perlu diperiksa", tone: "amber", to: "verifikasi" },
  { label: "Produk tampil", value: count(db.produk, "tampil"), note: `${db.produk.length} total`, tone: "green" },
  { label: "Pesanan", value: db.pesanan.length, note: `${count(db.pesanan, "selesai")} selesai`, tone: "violet" },
  { label: "Customer", value: db.pengguna.filter((p) => p.peran === "Customer").length, note: "terdaftar", tone: "rose" },
]);

// Dummy: pesanan 7 hari terakhir
const week = [
  ["Sen", 12], ["Sel", 18], ["Rab", 9], ["Kam", 22], ["Jum", 27], ["Sab", 31], ["Min", 24],
];
const max = Math.max(...week.map((w) => w[1]));

const byCategory = computed(() => {
  const map = {};
  db.umkm.forEach((u) => (map[u.kategori] = (map[u.kategori] || 0) + 1));
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
});

const queue = computed(() => db.umkm.filter((u) => u.status === "menunggu"));
const attention = computed(() => db.laporan.filter((l) => l.status === "baru"));
</script>

<template>
  <div class="grid">
    <section class="stats" aria-label="Ringkasan">
      <component :is="s.to ? 'RouterLink' : 'div'" v-for="s in stats" :key="s.label" :to="s.to ? { name: 'admin-section', params: { section: s.to } } : undefined" class="stat" :class="s.tone">
        <span>{{ s.label }}</span>
        <strong>{{ s.value }}</strong>
        <small>{{ s.note }}</small>
      </component>
    </section>

    <section class="card chart">
      <h2>Pesanan 7 hari terakhir</h2>
      <div class="bars">
        <div v-for="[day, n] in week" :key="day" class="col">
          <span class="n">{{ n }}</span>
          <div class="bar" :style="{ height: (n / max) * 100 + '%' }"></div>
          <span class="d">{{ day }}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>UMKM per kategori</h2>
      <ul class="cat">
        <li v-for="[name, n] in byCategory" :key="name">
          <span>{{ name }}</span>
          <div class="track"><i :style="{ width: (n / db.umkm.length) * 100 + '%' }"></i></div>
          <b>{{ n }}</b>
        </li>
      </ul>
    </section>

    <section class="card">
      <div class="head">
        <h2>Antrean verifikasi</h2>
        <RouterLink :to="{ name: 'admin-section', params: { section: 'verifikasi' } }">Lihat semua</RouterLink>
      </div>
      <ul v-if="queue.length" class="list">
        <li v-for="u in queue" :key="u.id"><div><b>{{ u.nama }}</b><small>{{ u.pemilik }} · {{ u.kota }}</small></div><span class="badge menunggu">{{ u.tgl }}</span></li>
      </ul>
      <p v-else class="empty">Semua pendaftaran sudah diperiksa.</p>
    </section>

    <section class="card">
      <div class="head">
        <h2>Laporan baru</h2>
        <RouterLink :to="{ name: 'admin-section', params: { section: 'laporan' } }">Lihat semua</RouterLink>
      </div>
      <ul v-if="attention.length" class="list">
        <li v-for="l in attention" :key="l.id"><div><b>{{ l.target }}</b><small>{{ l.alasan }}</small></div></li>
      </ul>
      <p v-else class="empty">Tidak ada laporan yang menunggu tindakan.</p>
    </section>

    <section class="card wide">
      <div class="head">
        <h2>Pesanan terbaru</h2>
        <RouterLink :to="{ name: 'admin-section', params: { section: 'pesanan' } }">Lihat semua</RouterLink>
      </div>
      <div class="scroll">
        <table>
          <thead><tr><th>No.</th><th>Customer</th><th>UMKM</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="o in db.pesanan" :key="o.id">
              <td>{{ o.id }}</td><td>{{ o.pelanggan }}</td><td>{{ o.umkm }}</td><td>{{ rupiah(o.total) }}</td>
              <td><span class="badge" :class="o.status">{{ o.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; }
.stats { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.stat { display: grid; gap: 2px; padding: 16px 18px; border-radius: var(--radius); border: 1px solid transparent; }
.stat span { font-size: 0.85rem; color: var(--muted); }
.stat strong { font-size: 1.9rem; font-weight: 600; }
.stat small { color: var(--muted); }
a.stat:hover { border-color: var(--blue); }
.blue { background: #e4efff; } .amber { background: #fff3dc; } .green { background: #e3f6ec; } .violet { background: #eee9fd; } .rose { background: #fde8ee; }
.card { grid-column: span 3; padding: 20px; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); }
.card.wide { grid-column: 1 / -1; }
.card h2 { margin-bottom: 14px; font-size: 1rem; font-weight: 600; }
.head { display: flex; justify-content: space-between; align-items: baseline; }
.head a { font-size: 0.85rem; color: var(--blue); }
.chart { grid-column: span 4; }
.chart + .card { grid-column: span 2; }
.bars { display: flex; align-items: flex-end; gap: 14px; height: 190px; }
.col { flex: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; }
.col .bar { width: 100%; max-width: 44px; min-height: 4px; background: var(--blue); border-radius: 8px 8px 0 0; opacity: 0.85; }
.col .n { font-size: 0.8rem; color: var(--muted); }
.col .d { font-size: 0.8rem; color: var(--muted); }
.cat { list-style: none; display: grid; gap: 14px; }
.cat li { display: grid; grid-template-columns: 80px 1fr 20px; align-items: center; gap: 10px; font-size: 0.9rem; }
.track { height: 8px; background: var(--bg); border-radius: 999px; overflow: hidden; }
.track i { display: block; height: 100%; background: var(--blue); border-radius: 999px; }
.list { list-style: none; display: grid; }
.list li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 0; }
.list li + li { border-top: 1px solid var(--line); }
.list b { display: block; font-weight: 500; }
.list small { color: var(--muted); }
.empty { padding: 18px 0; color: var(--muted); }
.scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { padding: 11px 10px; text-align: left; white-space: nowrap; }
th { font-weight: 500; color: var(--muted); }
tbody tr td { border-top: 1px solid var(--line); }
.badge { padding: 3px 10px; font-size: 0.8rem; border-radius: 999px; }
.badge.selesai { background: #e3f6ec; color: #17794a; }
.badge.menunggu, .badge.diproses { background: #fff3dc; color: #9a6200; }
.badge.dikirim { background: #e4efff; color: var(--blue-dark); }
.badge.dibatalkan { background: #fdecea; color: #b3261e; }

@media (max-width: 1100px) {
  .stats { grid-template-columns: repeat(3, 1fr); }
  .card, .chart, .chart + .card { grid-column: 1 / -1; }
}
@media (max-width: 600px) { .stats { grid-template-columns: repeat(2, 1fr); } }
</style>