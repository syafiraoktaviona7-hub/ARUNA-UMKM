<?php

namespace App\Controllers\Api;

use DomainException;

/** Pesanan dan laporan milik customer yang sedang login. */
class Customer extends BaseApi
{
    // Ongkir ditentukan server (jangan percaya angka dari browser)
    private const ONGKIR = ['jne' => 15000, 'jnt' => 17000];

    // ---------------------------------------------------------- buat pesanan
    /**
     * Body: { items: [{id, qty}], nama_penerima?, no_hp_penerima?, alamat_kirim?, catatan?, metode_bayar? }
     * Keranjang berisi banyak UMKM otomatis dipecah menjadi satu pesanan per UMKM.
     */
    public function pesananBuat()
    {
        $u = $this->currentUser();
        $d = $this->body();

        $items = [];
        foreach ((is_array($d['items'] ?? null) ? $d['items'] : []) as $it) {
            $id  = (int) ($it['id'] ?? 0);
            $qty = (int) ($it['qty'] ?? 0);
            if ($id < 1 || $qty < 1) {
                continue;
            }
            $items[$id] = min(99, ($items[$id] ?? 0) + $qty);
        }
        if (! $items) {
            return $this->galat('Keranjang kosong.');
        }

        $str = static fn (string $k, int $max) => ($v = trim((string) ($d[$k] ?? ''))) !== '' ? mb_substr($v, 0, $max) : null;

        $penerima = $str('nama_penerima', 120) ?? $u['nama'];
        $hp       = $str('no_hp_penerima', 20) ?? $u['no_hp'];
        $alamat   = $str('alamat_kirim', 400);
        $catatan  = $str('catatan', 255);
        $metode   = $str('metode_bayar', 40);
        $kirim    = $str('pengiriman', 30);
        $ongkir   = self::ONGKIR[$kirim ?? ''] ?? 0;

        $ids = array_keys($items);
        $ph  = implode(',', array_fill(0, count($ids), '?'));
        $hasil = [];

        $this->db->transBegin();

        try {
            // Kunci baris produk agar stok tidak bisa dibeli dua kali sekaligus
            $rows = $this->db->query(
                "SELECT p.id, p.nama, p.harga, p.stok, p.umkm_id
                   FROM products p JOIN umkm um ON um.id = p.umkm_id
                  WHERE p.id IN ($ph) AND p.status = 'tampil' AND um.status = 'aktif' FOR UPDATE",
                $ids
            )->getResultArray();
            $byId = array_column($rows, null, 'id');

            $perUmkm = [];
            foreach ($items as $pid => $qty) {
                $p = $byId[$pid] ?? null;
                if (! $p) {
                    throw new DomainException('Ada produk di keranjang yang sudah tidak tersedia. Muat ulang keranjangmu.');
                }
                if ((int) $p['stok'] < $qty) {
                    throw new DomainException('Stok "' . $p['nama'] . '" tinggal ' . (int) $p['stok'] . '.');
                }
                $perUmkm[(int) $p['umkm_id']][] = ['p' => $p, 'qty' => $qty];
            }

            foreach ($perUmkm as $umkmId => $baris) {
                $total = 0;
                foreach ($baris as $b) {
                    $total += (int) $b['p']['harga'] * $b['qty'];
                }

                $this->db->table('orders')->insert([
                    'kode'           => 'TMP' . bin2hex(random_bytes(6)),
                    'customer_id'    => $u['id'],
                    'umkm_id'        => $umkmId,
                    'total'          => $total + $ongkir,
                    'pengiriman'     => $kirim,
                    'ongkir'         => $ongkir,
                    'metode_bayar'   => $metode,
                    'nama_penerima'  => $penerima,
                    'no_hp_penerima' => $hp,
                    'alamat_kirim'   => $alamat,
                    'catatan'        => $catatan,
                    'status'         => 'diproses',
                ]);
                $orderId = (int) $this->db->insertID();
                $kode    = 'ORD-' . (1000 + $orderId);
                $this->db->table('orders')->where('id', $orderId)->update(['kode' => $kode]);

                $itemRows = [];
                foreach ($baris as $b) {
                    $itemRows[] = [
                        'order_id'   => $orderId,
                        'product_id' => (int) $b['p']['id'],
                        'nama'       => $b['p']['nama'],
                        'harga'      => (int) $b['p']['harga'],
                        'qty'        => $b['qty'],
                    ];
                    $this->db->table('products')
                        ->set('stok', 'stok - ' . (int) $b['qty'], false)
                        ->set('terjual', 'terjual + ' . (int) $b['qty'], false)
                        ->where('id', (int) $b['p']['id'])->update();
                }
                $this->db->table('order_items')->insertBatch($itemRows);

                $toko = $this->db->table('umkm')
                    ->select('nama, whatsapp, bank, no_rekening, nama_rekening')
                    ->where('id', $umkmId)->get()->getRowArray();

                $hasil[] = [
                    'id'    => $orderId,
                    'kode'  => $kode,
                    'subtotal' => $total,
                    'ongkir'   => $ongkir,
                    'total' => $total + $ongkir,
                    'status' => 'diproses',
                    'umkm'  => [
                        'id'            => $umkmId,
                        'nama'          => $toko['nama'],
                        'whatsapp'      => $toko['whatsapp'] ?? '',
                        'bank'          => $toko['bank'] ?? '',
                        'no_rekening'   => $toko['no_rekening'] ?? '',
                        'nama_rekening' => $toko['nama_rekening'] ?? '',
                    ],
                ];
            }

            $this->db->transCommit();
        } catch (DomainException $e) {
            $this->db->transRollback();

            return $this->galat($e->getMessage());
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', 'Checkout gagal: ' . $e->getMessage());

            return $this->galat('Pesanan gagal dibuat. Coba lagi sebentar lagi.', 500);
        }

        return $this->respond(['orders' => $hasil], 201);
    }

    // ------------------------------------------------------- riwayat pesanan
    private function bentukPesanan(array $orders): array
    {
        if (! $orders) {
            return [];
        }
        $items = [];
        $rows  = $this->db->table('order_items')
            ->whereIn('order_id', array_map(static fn ($o) => (int) $o['id'], $orders))
            ->orderBy('id')->get()->getResultArray();
        foreach ($rows as $r) {
            $items[(int) $r['order_id']][] = [
                'id'    => $r['product_id'] !== null ? (int) $r['product_id'] : null,
                'name'  => $r['nama'],
                'price' => (int) $r['harga'],
                'qty'   => (int) $r['qty'],
            ];
        }

        return array_map(fn ($o) => [
            'id'       => (int) $o['id'],
            'kode'     => $o['kode'],
            'umkmId'   => (int) $o['umkm_id'],
            'umkm'     => $o['umkm'],
            'whatsapp' => $o['whatsapp'] ?? '',
            'total'    => (int) $o['total'],
            'status'   => $o['status'],
            'tgl'      => $this->tanggal($o['created_at']),
            'items'    => $items[(int) $o['id']] ?? [],
        ], $orders);
    }

    private function pesananBuilder(int $customerId)
    {
        return $this->db->table('orders o')
            ->select('o.id, o.kode, o.umkm_id, o.total, o.status, o.created_at, u.nama AS umkm, u.whatsapp')
            ->join('umkm u', 'u.id = o.umkm_id')
            ->where('o.customer_id', $customerId);
    }

    public function pesananList()
    {
        $u    = $this->currentUser();
        $rows = $this->pesananBuilder((int) $u['id'])->orderBy('o.id', 'DESC')->limit($this->batas())->get()->getResultArray();

        return $this->respond($this->bentukPesanan($rows));
    }

    public function pesananDetail($id)
    {
        $u = $this->currentUser();
        $r = $this->pesananBuilder((int) $u['id'])->where('o.id', (int) $id)->get()->getRowArray();
        if (! $r) {
            return $this->galat('Pesanan tidak ditemukan.', 404);
        }

        return $this->respond($this->bentukPesanan([$r])[0]);
    }

    /** Customer hanya boleh membatalkan pesanan yang masih "diproses". Stok dikembalikan. */
    public function pesananBatal($id)
    {
        $u = $this->currentUser();

        $this->db->transBegin();

        try {
            $o = $this->db->query(
                'SELECT id, status FROM orders WHERE id = ? AND customer_id = ? FOR UPDATE',
                [(int) $id, (int) $u['id']]
            )->getRowArray();

            if (! $o) {
                $this->db->transRollback();

                return $this->galat('Pesanan tidak ditemukan.', 404);
            }
            if ($o['status'] !== 'diproses') {
                $this->db->transRollback();

                return $this->galat('Pesanan yang sudah dikirim atau selesai tidak bisa dibatalkan.', 409);
            }

            $this->db->table('orders')->where('id', (int) $id)->update(['status' => 'dibatalkan']);

            $items = $this->db->table('order_items')->where('order_id', (int) $id)->where('product_id IS NOT NULL', null, false)->get()->getResultArray();
            foreach ($items as $it) {
                $this->db->table('products')
                    ->set('stok', 'stok + ' . (int) $it['qty'], false)
                    ->set('terjual', 'GREATEST(terjual - ' . (int) $it['qty'] . ', 0)', false)
                    ->where('id', (int) $it['product_id'])->update();
            }

            $this->db->transCommit();
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', 'Batal pesanan gagal: ' . $e->getMessage());

            return $this->galat('Gagal membatalkan pesanan.', 500);
        }

        return $this->respond(['id' => (int) $id, 'status' => 'dibatalkan']);
    }

    // --------------------------------------------------------------- laporan
    /** Body: { target_tipe: 'umkm'|'produk'|'jasa', target_id, alasan } */
    public function laporanBuat()
    {
        $u     = $this->currentUser();
        $d     = $this->body();
        $tipe  = (string) ($d['target_tipe'] ?? '');
        $tid   = (int) ($d['target_id'] ?? 0);
        $alasan = trim((string) ($d['alasan'] ?? ''));

        $tabel = ['umkm' => 'umkm', 'produk' => 'products', 'jasa' => 'jasa'][$tipe] ?? null;
        if (! $tabel) {
            return $this->galat('Jenis laporan tidak dikenal.');
        }
        if ($alasan === '') {
            return $this->galat('Alasan laporan wajib diisi.');
        }
        if ($this->db->table($tabel)->where('id', $tid)->countAllResults() === 0) {
            return $this->galat('Yang dilaporkan tidak ditemukan.', 404);
        }

        $this->db->table('reports')->insert([
            'pelapor_id'  => $u['id'],
            'target_tipe' => $tipe,
            'target_id'   => $tid,
            'alasan'      => mb_substr($alasan, 0, 255),
        ]);

        return $this->respond(['message' => 'Laporan terkirim. Terima kasih.'], 201);
    }
}