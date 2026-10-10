<?php

namespace App\Controllers\Api;

/**
 * Endpoint dashboard admin. Bentuk baris sengaja sama dengan data di
 * src/data/adminData.js, jadi AdminListPage.vue tidak perlu diubah strukturnya.
 */
class Admin extends BaseApi
{
    private const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // aturan perubahan status per bagian (cerminan "actions" di sections adminData.js)
    private const ATURAN = [
        'verifikasi' => ['tabel' => 'umkm', 'dari' => ['menunggu'], 'ke' => ['aktif', 'ditolak']],
        'umkm'       => ['tabel' => 'umkm', 'dari' => ['aktif', 'ditangguhkan'], 'ke' => ['aktif', 'ditangguhkan']],
        'produk'     => ['tabel' => 'products', 'dari' => ['tampil', 'disembunyikan'], 'ke' => ['tampil', 'disembunyikan']],
        'pengguna'   => ['tabel' => 'users', 'dari' => ['aktif', 'diblokir'], 'ke' => ['aktif', 'diblokir']],
        'laporan'    => ['tabel' => 'reports', 'dari' => ['baru'], 'ke' => ['selesai']],
    ];

    // ------------------------------------------------------------ angka lencana
    /** Ringan: hanya dua angka untuk sidebar dan lonceng topbar. */
    public function badge()
    {
        return $this->respond([
            'verifikasi' => $this->hitung('umkm', ['status' => 'menunggu']),
            'laporan'    => $this->hitung('reports', ['status' => 'baru']),
        ]);
    }

    // ------------------------------------------------------------ dashboard
    public function dashboard()
    {
        $defs = [
            ['label' => 'UMKM aktif', 'tabel' => 'umkm', 'nilai' => ['status' => 'aktif'], 'baru' => []],
            ['label' => 'Produk tampil', 'tabel' => 'products', 'nilai' => ['status' => 'tampil'], 'baru' => []],
            ['label' => 'Total pesanan', 'tabel' => 'orders', 'nilai' => [], 'baru' => []],
            ['label' => 'Customer', 'tabel' => 'users', 'nilai' => ['peran' => 'customer'], 'baru' => ['peran' => 'customer']],
        ];

        $stats = [];
        foreach ($defs as $df) {
            $h    = $this->harian($df['tabel'], $df['baru']);
            $prev = array_sum(array_slice($h, 0, 7));
            $cur  = array_sum(array_slice($h, 7));
            $pct  = $prev > 0 ? ($cur - $prev) / $prev * 100 : ($cur > 0 ? 100 : 0);

            $stats[] = [
                'label' => $df['label'],
                'value' => $this->hitung($df['tabel'], $df['nilai']),
                'delta' => ($pct >= 0 ? '+' : '-') . number_format(abs($pct), 1, ',', '.') . '%',
                'trend' => array_slice($h, 7),
            ];
        }

        // grafik pesanan 7 hari terakhir
        $pesanan7 = array_slice($this->harian('orders'), 7);
        $hari     = [];
        for ($i = 6; $i >= 0; $i--) {
            $hari[] = self::HARI[(int) date('w', strtotime("-$i days"))];
        }

        // UMKM per kategori
        $kat = $this->db->table('umkm u')
            ->select('c.nama AS name, COUNT(*) AS n', false)
            ->join('categories c', 'c.id = u.category_id', 'left')
            ->where('u.status', 'aktif')->groupBy('c.id')->orderBy('n', 'DESC')
            ->get()->getResultArray();
        $totalKat = array_sum(array_column($kat, 'n')) ?: 1;
        $kategori = array_map(static fn ($k) => [
            'name' => $k['name'] ?? 'Lainnya',
            'n'    => (int) $k['n'],
            'pct'  => (int) round($k['n'] / $totalKat * 100),
        ], $kat);

        // antrean verifikasi
        $antrean = $this->daftarUmkm('menunggu', '', 5);

        // pesanan terbaru
        $terbaru = array_slice($this->daftarPesanan('', ''), 0, 5);

        // UMKM terlaris (jumlah pesanan, tanpa yang dibatalkan)
        $top = $this->db->table('orders o')
            ->select('u.nama AS name, COUNT(*) AS n', false)
            ->join('umkm u', 'u.id = o.umkm_id')
            ->where('o.status !=', 'dibatalkan')->groupBy('u.id')->orderBy('n', 'DESC')->limit(4)
            ->get()->getResultArray();

        // aktivitas terbaru
        $feed  = [];
        $umkm  = $this->db->table('umkm')->where('status', 'menunggu')->orderBy('created_at', 'DESC')->get(1)->getRowArray();
        $feed[] = ['t' => 'UMKM baru mendaftar', 'd' => $umkm['nama'] ?? 'Tidak ada', 'ago' => $this->lalu($umkm['created_at'] ?? null), 'tone' => 'amber'];

        $lap = $this->db->table('reports')->orderBy('created_at', 'DESC')->get(1)->getRowArray();
        if ($lap) {
            $feed[] = ['t' => 'Laporan customer baru', 'd' => $this->namaTarget($lap['target_tipe'], (int) $lap['target_id']), 'ago' => $this->lalu($lap['created_at']), 'tone' => 'rose'];
        }

        $ord = $this->db->table('orders o')->select('o.kode, o.created_at, u.nama AS umkm')
            ->join('umkm u', 'u.id = o.umkm_id')->orderBy('o.id', 'DESC')->get(1)->getRowArray();
        if ($ord) {
            $feed[] = ['t' => 'Pesanan baru masuk', 'd' => '#' . $ord['kode'] . ' · ' . $ord['umkm'], 'ago' => $this->lalu($ord['created_at']), 'tone' => 'blue'];
        }

        return $this->respond([
            'menunggu'      => $this->hitung('umkm', ['status' => 'menunggu']),
            'laporanBaru'   => $this->hitung('reports', ['status' => 'baru']),
            'stats'         => $stats,
            'hari'          => $hari,
            'pesanan7hari'  => $pesanan7,
            'totalUmkm'     => array_sum(array_column($kategori, 'n')),
            'kategori'      => $kategori,
            'antrean'       => $antrean,
            'pesananTerbaru' => $terbaru,
            'teratas'       => array_map(static fn ($t) => ['name' => $t['name'], 'n' => (int) $t['n']], $top),
            'feed'          => $feed,
        ]);
    }

    private function hitung(string $tabel, array $where = []): int
    {
        $b = $this->db->table($tabel);
        if ($where) {
            $b->where($where);
        }

        return (int) $b->countAllResults();
    }

    /** Jumlah baris baru per hari selama $hari hari terakhir (lama -> baru). */
    private function harian(string $tabel, array $where = [], int $hari = 14): array
    {
        $mulai = date('Y-m-d', strtotime('-' . ($hari - 1) . ' days'));
        $b     = $this->db->table($tabel)
            ->select('DATE(created_at) AS d, COUNT(*) AS n', false)
            ->where('created_at >=', $mulai . ' 00:00:00');
        if ($where) {
            $b->where($where);
        }
        $map = array_column($b->groupBy('DATE(created_at)')->get()->getResultArray(), 'n', 'd');

        $out = [];
        for ($i = $hari - 1; $i >= 0; $i--) {
            $out[] = (int) ($map[date('Y-m-d', strtotime("-$i days"))] ?? 0);
        }

        return $out;
    }

    private function namaTarget(string $tipe, int $id): string
    {
        $tabel = ['umkm' => 'umkm', 'produk' => 'products', 'jasa' => 'jasa'][$tipe] ?? null;
        if (! $tabel) {
            return '-';
        }
        $r = $this->db->table($tabel)->select('nama')->where('id', $id)->get()->getRowArray();

        return $r['nama'] ?? '(sudah dihapus)';
    }

    // --------------------------------------------------------------- daftar
    public function daftar(string $section)
    {
        $status = trim((string) $this->request->getGet('status'));
        $q      = trim((string) $this->request->getGet('q'));

        $rows = match ($section) {
            'verifikasi' => $this->daftarUmkm('menunggu', $q),
            'umkm'       => $this->daftarUmkm($status, $q),
            'produk'     => $this->daftarProduk($status, $q),
            'pengguna'   => $this->daftarPengguna($status, $q),
            'pesanan'    => $this->daftarPesanan($status, $q),
            'laporan'    => $this->daftarLaporan($status, $q),
        };

        return $this->respond($rows);
    }

    private function pakaiStatus($b, string $kolom, string $status): void
    {
        if ($status !== '' && $status !== 'semua') {
            $b->where($kolom, $status);
        }
    }

    private function daftarUmkm(string $status, string $q, int $limit = 500): array
    {
        $b = $this->db->table('umkm u')
            ->select('u.id, u.nama, us.nama AS pemilik, c.nama AS kategori, u.kota, u.created_at, u.status')
            ->join('users us', 'us.id = u.user_id', 'left')
            ->join('categories c', 'c.id = u.category_id', 'left');
        $this->pakaiStatus($b, 'u.status', $status);
        if ($q !== '') {
            $b->groupStart()->like('u.nama', $q)->orLike('us.nama', $q)->groupEnd();
        }

        return array_map(fn ($r) => [
            'id'       => (int) $r['id'],
            'nama'     => $r['nama'],
            'pemilik'  => $r['pemilik'] ?? '-',
            'kategori' => $r['kategori'] ?? '-',
            'kota'     => $r['kota'],
            'tgl'      => $this->tanggal($r['created_at']),
            'status'   => $r['status'],
        ], $b->orderBy('u.created_at', 'DESC')->limit($limit)->get()->getResultArray());
    }

    private function daftarProduk(string $status, string $q): array
    {
        $b = $this->db->table('products p')
            ->select('p.id, p.nama, u.nama AS umkm, c.nama AS kategori, p.harga, p.status')
            ->join('umkm u', 'u.id = p.umkm_id')
            ->join('categories c', 'c.id = p.category_id');
        $this->pakaiStatus($b, 'p.status', $status);
        if ($q !== '') {
            $b->groupStart()->like('p.nama', $q)->orLike('u.nama', $q)->groupEnd();
        }

        return array_map(static fn ($r) => [
            'id'       => (int) $r['id'],
            'nama'     => $r['nama'],
            'umkm'     => $r['umkm'],
            'kategori' => $r['kategori'],
            'harga'    => (int) $r['harga'],
            'status'   => $r['status'],
        ], $b->orderBy('p.id', 'DESC')->limit(500)->get()->getResultArray());
    }

    private function daftarPengguna(string $status, string $q): array
    {
        $b = $this->db->table('users')->select('id, nama, email, peran, status')->whereIn('peran', ['penjual', 'customer']);
        $this->pakaiStatus($b, 'status', $status);
        if ($q !== '') {
            $b->groupStart()->like('nama', $q)->orLike('email', $q)->groupEnd();
        }

        return array_map(static fn ($r) => [
            'id'     => (int) $r['id'],
            'nama'   => $r['nama'],
            'email'  => $r['email'],
            'peran'  => ucfirst($r['peran']),
            'status' => $r['status'],
        ], $b->orderBy('id', 'DESC')->limit(500)->get()->getResultArray());
    }

    private function daftarPesanan(string $status, string $q): array
    {
        $b = $this->db->table('orders o')
            ->select('o.kode, cu.nama AS pelanggan, u.nama AS umkm, o.total, o.created_at, o.status')
            ->join('users cu', 'cu.id = o.customer_id')
            ->join('umkm u', 'u.id = o.umkm_id');
        $this->pakaiStatus($b, 'o.status', $status);
        if ($q !== '') {
            $b->groupStart()->like('o.kode', $q)->orLike('cu.nama', $q)->orLike('u.nama', $q)->groupEnd();
        }

        return array_map(fn ($r) => [
            'id'        => '#' . $r['kode'],
            'pelanggan' => $r['pelanggan'],
            'umkm'      => $r['umkm'],
            'total'     => (int) $r['total'],
            'tgl'       => $this->tanggal($r['created_at']),
            'status'    => $r['status'],
        ], $b->orderBy('o.id', 'DESC')->limit(500)->get()->getResultArray());
    }

    private function daftarLaporan(string $status, string $q): array
    {
        $b = $this->db->table('reports r')
            ->select('r.id, pe.nama AS pelapor, r.target_tipe, r.target_id, r.alasan, r.status')
            ->join('users pe', 'pe.id = r.pelapor_id');
        $this->pakaiStatus($b, 'r.status', $status);
        if ($q !== '') {
            $b->groupStart()->like('pe.nama', $q)->orLike('r.alasan', $q)->groupEnd();
        }

        return array_map(fn ($r) => [
            'id'      => (int) $r['id'],
            'pelapor' => $r['pelapor'],
            'target'  => $this->namaTarget($r['target_tipe'], (int) $r['target_id']),
            'alasan'  => $r['alasan'],
            'status'  => $r['status'],
        ], $b->orderBy('r.id', 'DESC')->limit(500)->get()->getResultArray());
    }

    // ---------------------------------------------------------- ubah status
    /** PATCH /api/admin/{bagian}/{id}/status   body: { "status": "aktif" } */
    public function ubahStatus(string $section, string $id)
    {
        $aturan = self::ATURAN[$section] ?? null;
        if (! $aturan) {
            return $this->galat('Bagian ini hanya untuk dilihat, statusnya tidak bisa diubah.', 405);
        }

        $ke = (string) ($this->body()['status'] ?? '');
        if (! in_array($ke, $aturan['ke'], true)) {
            return $this->galat('Status tujuan tidak valid.');
        }

        $row = $this->db->table($aturan['tabel'])->where('id', (int) $id)->get()->getRowArray();
        if (! $row) {
            return $this->galat('Data tidak ditemukan.', 404);
        }
        if ($section === 'pengguna' && $row['peran'] === 'admin') {
            return $this->galat('Akun admin tidak bisa diubah dari sini.', 403);
        }
        if (! in_array($row['status'], $aturan['dari'], true)) {
            return $this->galat('Status saat ini tidak bisa diubah ke status tersebut.', 409);
        }

        $this->db->table($aturan['tabel'])->where('id', (int) $id)->update(['status' => $ke]);

        return $this->respond(['id' => (int) $id, 'status' => $ke]);
    }
}