<script setup>
import { computed } from "vue";
import { db } from "@/data/adminData";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();
const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const count = (list, status) => list.filter((x) => x.status === status).length;

// Dummy: tren untuk sparkline dan grafik
const spark = (arr) => {
  const max = Math.max(...arr), min = Math.min(...arr);
  return arr.map((v, i) => `${(i / (arr.length - 1)) * 80},${26 - ((v - min) / (max - min || 1)) * 22}`).join(" ");
};

const stats = computed(() => [
  { label: "UMKM aktif", value: count(db.umkm, "aktif"), delta: "+12,5%", tone: "blue", icon: "M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6", trend: [3, 4, 4, 6, 5, 7, 8] },
  { label: "Produk tampil", value: count(db.produk, "tampil"), delta: "+8,2%", tone: "green", icon: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5", trend: [2, 3, 3, 4, 6, 5, 7] },
  { label: "Total pesanan", value: db.pesanan.length, delta: "+10,3%", tone: "violet", icon: "M6 6h15l-2 9H8zM6 6L5 3H2", trend: [4, 3, 5, 5, 7, 6, 9] },
  { label: "Customer", value: db.pengguna.filter((p) => p.peran === "Customer").length, delta: "+5,6%", tone: "rose", icon: "M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8", trend: [1, 2, 2, 3, 3, 4, 4] },
]);

const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const orders = [12, 18, 9, 22, 27, 31, 24];
const W = 560, H = 190;
const pts = computed(() => {
  const max = Math.max(...orders) * 1.15;
  return orders.map((v, i) => [(i / (orders.length - 1)) * W, H - (v / max) * H]);
});
const line = computed(() => pts.value.map((p) => p.join(",")).join(" "));
const area = computed(() => `0,${H} ${line.value} ${W},${H}`);

const colors = ["#0865d8", "#4f9bff", "#22b07d", "#f5a524", "#8f7bf0"];
const cats = computed(() => {
  const map = {};
  db.umkm.forEach((u) => (map[u.kategori] = (map[u.kategori] || 0) + 1));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, n], i) => ({ name, n, color: colors[i % colors.length], pct: Math.round((n / db.umkm.length) * 100) }));
});
const donut = computed(() => {
  let acc = 0;
  return "conic-gradient(" + cats.value.map((c) => { const from = acc; acc += c.pct; return `${c.color} ${from}% ${acc}%`; }).join(",") + ")";
});

const queue = computed(() => db.umkm.filter((u) => u.status === "menunggu"));
const newReports = computed(() => count(db.laporan, "baru"));
const top = [["Kopi Arjuna", 64], ["Sambal Mama Dewi", 51], ["Kerajinan Bambu Lestari", 38], ["Keripik Tempe Bu Sari", 27]];
const feed = computed(() => [
  { t: "UMKM baru mendaftar", d: queue.value[0]?.nama || "Tidak ada", ago: "2 jam lalu", tone: "amber" },
  { t: "Laporan customer baru", d: db.laporan[0].target, ago: "5 jam lalu", tone: "rose" },
  { t: "Pesanan baru masuk", d: db.pesanan[0].id + " · " + db.pesanan[0].umkm, ago: "kemarin", tone: "blue" },
]);
const actions = [
  { l: "Verifikasi UMKM", s: "verifikasi", tone: "amber" },
  { l: "Kelola produk", s: "produk", tone: "green" },
  { l: "Lihat laporan", s: "laporan", tone: "rose" },
  { l: "Pantau pesanan", s: "pesanan", tone: "blue" },
];
</script>

<template>
  <div class="page">
    <div class="left">
      <section class="hero">
        <div>
          <h2>Halo, {{ user?.name }}</h2>
          <p>
            Ada <b>{{ queue.length }} UMKM</b> menunggu verifikasi dan
            <b>{{ newReports }} laporan</b> baru dari customer hari ini.
          </p>
          <RouterLink class="cta" :to="{ name: 'admin-section', params: { section: 'verifikasi' } }">Periksa verifikasi</RouterLink>
        </div>
        <div class="art" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>

      <section class="stats" aria-label="Ringkasan">
        <article v-for="s in stats" :key="s.label" class="stat" :class="s.tone">
          <div class="top-row">
            <span class="chip"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="s.icon" /></svg></span>
            <em class="delta">{{ s.delta }}</em>
          </div>
          <small>{{ s.label }}</small>
          <strong>{{ s.value }}</strong>
          <svg class="spark" viewBox="0 0 80 28" preserveAspectRatio="none"><polyline :points="spark(s.trend)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>
          <span class="vs">dibanding 7 hari lalu</span>
        </article>
      </section>

      <div class="row">
        <section class="card grow">
          <div class="head"><h3>Pesanan 7 hari terakhir</h3><span class="pill">7 hari</span></div>
          <svg class="area" :viewBox="`0 0 ${W} ${H + 24}`" role="img" aria-label="Grafik pesanan 7 hari">
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0865d8" stop-opacity=".28" /><stop offset="1" stop-color="#0865d8" stop-opacity="0" /></linearGradient></defs>
            <line v-for="n in 3" :key="n" x1="0" x2="560" :y1="(H / 3) * n" :y2="(H / 3) * n" stroke="#e2ecf8" />
            <polygon :points="area" fill="url(#g)" />
            <polyline :points="line" fill="none" stroke="#0865d8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
            <g v-for="(p, i) in pts" :key="i"><circle :cx="p[0]" :cy="p[1]" r="4.5" fill="#fff" stroke="#0865d8" stroke-width="2.5" /><text :x="p[0]" :y="p[1] - 12" text-anchor="middle" font-size="12" fill="#5c718a">{{ orders[i] }}</text><text :x="p[0]" :y="H + 20" text-anchor="middle" font-size="12" fill="#5c718a">{{ days[i] }}</text></g>
          </svg>
        </section>

        <section class="card cat">
          <div class="head"><h3>UMKM per kategori</h3></div>
          <div class="donut" :style="{ background: donut }"><span><b>{{ db.umkm.length }}</b><small>UMKM</small></span></div>
          <ul>
            <li v-for="c in cats" :key="c.name"><i :style="{ background: c.color }"></i>{{ c.name }}<b>{{ c.pct }}%</b></li>
          </ul>
        </section>
      </div>

      <section class="card">
        <div class="head"><h3>Pesanan terbaru</h3><RouterLink :to="{ name: 'admin-section', params: { section: 'pesanan' } }">Lihat semua</RouterLink></div>
        <div class="scroll">
          <table>
            <thead><tr><th>No.</th><th>Customer</th><th>UMKM</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="o in db.pesanan" :key="o.id"><td>{{ o.id }}</td><td>{{ o.pelanggan }}</td><td>{{ o.umkm }}</td><td>{{ rupiah(o.total) }}</td><td><span class="badge" :class="o.status">{{ o.status }}</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <aside class="right">
      <section class="card">
        <div class="head"><h3>Aktivitas terbaru</h3></div>
        <ul class="feed">
          <li v-for="f in feed" :key="f.t"><span class="dot" :class="f.tone"></span><div><b>{{ f.t }}</b><small>{{ f.d }}</small></div><time>{{ f.ago }}</time></li>
        </ul>
      </section>

      <section class="card">
        <div class="head"><h3>UMKM terlaris</h3><RouterLink :to="{ name: 'admin-section', params: { section: 'umkm' } }">Lihat semua</RouterLink></div>
        <ol class="top">
          <li v-for="([n, v], i) in top" :key="n"><span>{{ i + 1 }}</span><b>{{ n }}</b><small>{{ v }} pesanan</small></li>
        </ol>
      </section>

      <section class="card">
        <div class="head"><h3>Aksi cepat</h3></div>
        <div class="qa">
          <RouterLink v-for="a in actions" :key="a.s" :to="{ name: 'admin-section', params: { section: a.s } }" :class="a.tone">{{ a.l }}</RouterLink>
        </div>
      </section>
    </aside>
  </div>
</template>

<style scoped>
.page { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: start; }
.left, .right { display: grid; gap: 20px; min-width: 0; }
.card { padding: 20px; background: var(--white); border: 1px solid var(--line); border-radius: 16px; }
.head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.head h3 { font-size: 1rem; font-weight: 600; }
.head a { font-size: 0.85rem; color: var(--blue); }
.pill { padding: 4px 12px; font-size: 0.8rem; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; }

.hero { position: relative; overflow: hidden; display: flex; justify-content: space-between; gap: 20px; padding: 28px 32px; color: var(--white); border-radius: 18px; background: linear-gradient(120deg, var(--blue-dark), var(--blue) 60%, #3b8cf0); }
.hero h2 { margin-bottom: 8px; font-size: 1.6rem; font-weight: 600; }
.hero p { max-width: 420px; margin-bottom: 18px; opacity: 0.92; }
.cta { display: inline-block; padding: 10px 18px; font-weight: 600; color: var(--blue-dark); background: var(--white); border-radius: 10px; }
.cta:focus-visible { outline-color: var(--white); }
.art { position: relative; flex: 0 0 200px; }
.art i { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.14); }
.art i:nth-child(1) { right: -30px; top: -60px; width: 220px; height: 220px; }
.art i:nth-child(2) { right: 60px; bottom: -50px; width: 120px; height: 120px; background: rgba(255,255,255,0.2); }
.art i:nth-child(3) { right: 10px; top: 30px; width: 54px; height: 54px; background: #ffd9a8; opacity: 0.9; }

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.stat { display: grid; gap: 2px; padding: 18px; border: 1px solid transparent; border-radius: 18px; }
.top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.stat .chip { display: grid; place-items: center; width: 42px; height: 42px; background: var(--white); border-radius: 12px; box-shadow: 0 4px 12px rgba(20, 45, 78, 0.08); }
.delta { padding: 3px 10px; font-size: 0.78rem; font-style: normal; font-weight: 600; color: #17794a; background: var(--white); border-radius: 999px; }
.stat small { color: var(--muted); }
.stat strong { font-size: 2rem; font-weight: 600; line-height: 1.15; color: var(--ink); }
.spark { width: 100%; height: 34px; margin-top: 8px; }
.vs { font-size: 0.72rem; color: var(--muted); }
.blue { background: linear-gradient(160deg, #d6e6ff, #f0f6ff); border-color: #c9ddfb; color: var(--blue); }
.green { background: linear-gradient(160deg, #d3f2e2, #effaf4); border-color: #c3ebd5; color: #17a068; }
.violet { background: linear-gradient(160deg, #e5ddfc, #f5f2fe); border-color: #d9cffa; color: #6e56e0; }
.rose { background: linear-gradient(160deg, #fcdde6, #fef2f6); border-color: #f8cdd9; color: #e0436a; }
.amber { background: #fff3dc; color: #c27f00; }

.row { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: 20px; }
.area { width: 100%; height: auto; }
.cat .donut { display: grid; place-items: center; width: 150px; height: 150px; margin: 4px auto 16px; border-radius: 50%; }
.donut span { display: grid; place-items: center; width: 92px; height: 92px; background: var(--white); border-radius: 50%; line-height: 1.1; }
.donut b { font-size: 1.4rem; } .donut small { color: var(--muted); font-size: 0.75rem; }
.cat ul { list-style: none; display: grid; gap: 8px; font-size: 0.88rem; }
.cat li { display: flex; align-items: center; gap: 8px; }
.cat li i { width: 10px; height: 10px; border-radius: 3px; }
.cat li b { margin-left: auto; font-weight: 500; }

.scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { padding: 11px 10px; text-align: left; white-space: nowrap; }
th { font-weight: 500; color: var(--muted); }
tbody td { border-top: 1px solid var(--line); }
.badge { padding: 3px 10px; font-size: 0.8rem; border-radius: 999px; }
.badge.selesai { background: #e3f6ec; color: #17794a; }
.badge.diproses { background: #fff3dc; color: #9a6200; }
.badge.dikirim { background: #e4efff; color: var(--blue-dark); }
.badge.dibatalkan { background: #fdecea; color: #b3261e; }

.feed { list-style: none; display: grid; gap: 14px; }
.feed li { display: grid; grid-template-columns: 10px 1fr auto; gap: 10px; align-items: start; font-size: 0.88rem; }
.feed b { display: block; font-weight: 500; } .feed small, .feed time { color: var(--muted); font-size: 0.78rem; }
.dot { width: 10px; height: 10px; margin-top: 5px; border-radius: 50%; }
.dot.amber { background: #f5a524; } .dot.rose { background: #e0436a; } .dot.blue { background: var(--blue); }
.top { list-style: none; display: grid; gap: 12px; }
.top li { display: grid; grid-template-columns: 26px 1fr auto; gap: 10px; align-items: center; font-size: 0.88rem; }
.top span { display: grid; place-items: center; width: 26px; height: 26px; font-size: 0.8rem; font-weight: 600; color: var(--blue); background: #e4efff; border-radius: 8px; }
.top b { font-weight: 500; } .top small { color: var(--muted); }
.qa { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.qa a { padding: 14px 12px; font-size: 0.85rem; font-weight: 500; border-radius: 12px; }
.qa a:hover { filter: brightness(0.97); }

@media (max-width: 1250px) { .page { grid-template-columns: 1fr; } .right { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1000px) { .stats { grid-template-columns: repeat(2, 1fr); } .row { grid-template-columns: 1fr; } .right { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .art { display: none; } .hero { padding: 22px; } }
</style>