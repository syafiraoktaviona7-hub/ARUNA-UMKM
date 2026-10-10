<?php

namespace App\Controllers\Api;

class Penjual extends BaseApi
{
    /** Ambil UMKM milik penjual yang sedang login. */
    private function umkmSaya(): ?array
    {
        $u = $this->currentUser();
        if (! $u) return null;

        return $this->db->table('umkm')
            ->where('user_id', $u['id'])
            ->orderBy('id')
            ->get(1)->getRowArray();
    }

    /** GET /api/penjual/dashboard */
    public function dashboard()
    {
        $u = $this->currentUser();
        if (! $u || $u['peran'] !== 'penjual') {
            return $this->galat('Akses khusus penjual.', 403);
        }

        $umkm = $this->umkmSaya();
        if (! $umkm) {
            return $this->galat('Akun Anda belum memiliki toko/UMKM.', 404);
        }

        $umkmId = (int) $umkm['id'];

        $totalProduk = $this->db->table('products')
            ->where('umkm_id', $umkmId)
            ->countAllResults();

        $produkAktif = $this->db->table('products')
            ->where('umkm_id', $umkmId)
            ->where('status', 'tampil')
            ->countAllResults();

        $pesananBaru = $this->db->table('orders')
            ->where('umkm_id', $umkmId)
            ->where('status', 'diproses')
            ->countAllResults();

        $pesananTotal = $this->db->table('orders')
            ->where('umkm_id', $umkmId)
            ->countAllResults();

        $totalPenjualan = $this->db->table('orders')
            ->selectSum('total')
            ->where('umkm_id', $umkmId)
            ->where('status', 'selesai')
            ->get()->getRowArray()['total'] ?? 0;

        // Pesanan terbaru (5)
        $pesananTerbaru = $this->db->table('orders o')
            ->select('o.id, o.kode, o.total, o.status, o.created_at, u.nama AS nama_customer')
            ->join('users u', 'u.id = o.customer_id', 'left')
            ->where('o.umkm_id', $umkmId)
            ->orderBy('o.created_at', 'DESC')
            ->get(5)->getResultArray();

        // Produk stok menipis (<= 5)
        $stokMenipis = $this->db->table('products')
            ->select('id, nama, stok, harga')
            ->where('umkm_id', $umkmId)
            ->where('stok <=', 5)
            ->orderBy('stok')
            ->get(5)->getResultArray();

        return $this->respond([
            'umkm' => [
                'id'     => $umkmId,
                'nama'   => $umkm['nama'],
                'status' => $umkm['status'],
                'kota'   => $umkm['kota'],
            ],
            'statistik' => [
                'totalProduk'    => (int) $totalProduk,
                'produkAktif'    => (int) $produkAktif,
                'pesananBaru'    => (int) $pesananBaru,
                'pesananTotal'   => (int) $pesananTotal,
                'totalPenjualan' => (int) $totalPenjualan,
            ],
            'pesananTerbaru' => $pesananTerbaru,
            'stokMenipis'    => $stokMenipis,
        ]);
    }

    /** GET /api/penjual/produk */
    public function produkList()
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $q = trim((string) $this->request->getGet('q'));

        $b = $this->db->table('products')
            ->select('id, nama, harga, stok, terjual, jenis, status, gambar, category_id')
            ->where('umkm_id', $umkm['id'])
            ->orderBy('created_at', 'DESC');

        if ($q !== '') $b->like('nama', $q);

        return $this->respond($b->get()->getResultArray());
    }

    /** POST /api/penjual/produk */
    public function produkBuat()
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $d      = $this->body();
        $nama   = trim((string) ($d['nama'] ?? ''));
        $harga  = (int) ($d['harga'] ?? 0);
        $stok   = (int) ($d['stok'] ?? 0);
        $katId  = (int) ($d['category_id'] ?? 0);
        $jenis  = $d['jenis'] ?? null;
        $desk   = $d['deskripsi'] ?? null;
        $gambar = $d['gambar'] ?? null;

        if ($nama === '')  return $this->galat('Nama produk wajib diisi.');
        if ($harga <= 0)   return $this->galat('Harga harus lebih dari 0.');
        if ($katId <= 0)   return $this->galat('Kategori wajib dipilih.');

        $this->db->table('products')->insert([
            'umkm_id'     => $umkm['id'],
            'category_id' => $katId,
            'jenis'       => $jenis ?: null,
            'nama'        => $nama,
            'deskripsi'   => $desk,
            'harga'       => $harga,
            'stok'        => $stok,
            'gambar'      => $gambar,
            'status'      => 'tampil',
        ]);

        return $this->respond(['status' => true, 'id' => (int) $this->db->insertID()], 201);
    }

    /** PUT /api/penjual/produk/(:num) */
    public function produkUpdate($id = null)
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $id = (int) $id;
        $produk = $this->db->table('products')
            ->where('id', $id)
            ->where('umkm_id', $umkm['id'])
            ->get(1)->getRowArray();
        if (! $produk) return $this->galat('Produk tidak ditemukan.', 404);

        $d = $this->body();
        $upd = [];
        if (isset($d['nama']))        $upd['nama']        = trim((string) $d['nama']);
        if (isset($d['harga']))       $upd['harga']       = (int) $d['harga'];
        if (isset($d['stok']))        $upd['stok']        = (int) $d['stok'];
        if (isset($d['category_id'])) $upd['category_id'] = (int) $d['category_id'];
        if (isset($d['jenis']))       $upd['jenis']       = $d['jenis'] ?: null;
        if (isset($d['deskripsi']))   $upd['deskripsi']   = $d['deskripsi'];
        if (isset($d['gambar']))      $upd['gambar']      = $d['gambar'];
        if (isset($d['status']))      $upd['status']      = $d['status'] === 'disembunyikan' ? 'disembunyikan' : 'tampil';

        if (! $upd) return $this->galat('Tidak ada data yang diubah.');

        $this->db->table('products')->where('id', $id)->update($upd);

        return $this->respond(['status' => true]);
    }

    /** DELETE /api/penjual/produk/(:num) */
    public function produkHapus($id = null)
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $id = (int) $id;
        $produk = $this->db->table('products')
            ->where('id', $id)
            ->where('umkm_id', $umkm['id'])
            ->get(1)->getRowArray();
        if (! $produk) return $this->galat('Produk tidak ditemukan.', 404);

        $this->db->table('products')->where('id', $id)->delete();
        return $this->respond(['status' => true]);
    }

    /** GET /api/penjual/pesanan */
    public function pesananList()
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $status = trim((string) $this->request->getGet('status')); // diproses|dikirim|selesai|dibatalkan

        $b = $this->db->table('orders o')
            ->select('o.id, o.kode, o.total, o.status, o.metode_bayar, o.nama_penerima, o.no_hp_penerima, o.alamat_kirim, o.catatan, o.created_at, u.nama AS nama_customer, u.email AS email_customer')
            ->join('users u', 'u.id = o.customer_id', 'left')
            ->where('o.umkm_id', $umkm['id'])
            ->orderBy('o.created_at', 'DESC');

        if ($status !== '' && in_array($status, ['diproses','dikirim','selesai','dibatalkan'], true)) {
            $b->where('o.status', $status);
        }

        return $this->respond($b->get()->getResultArray());
    }

    /** GET /api/penjual/pesanan/(:num) */
    public function pesananDetail($id = null)
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $id = (int) $id;
        $order = $this->db->table('orders o')
            ->select('o.*, u.nama AS nama_customer, u.email AS email_customer')
            ->join('users u', 'u.id = o.customer_id', 'left')
            ->where('o.id', $id)
            ->where('o.umkm_id', $umkm['id'])
            ->get(1)->getRowArray();

        if (! $order) return $this->galat('Pesanan tidak ditemukan.', 404);

        $order['items'] = $this->db->table('order_items')
            ->where('order_id', $id)
            ->get()->getResultArray();

        return $this->respond($order);
    }

    /** PATCH /api/penjual/pesanan/(:num)/status */
    public function pesananUbahStatus($id = null)
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $id = (int) $id;
        $order = $this->db->table('orders')
            ->where('id', $id)
            ->where('umkm_id', $umkm['id'])
            ->get(1)->getRowArray();
        if (! $order) return $this->galat('Pesanan tidak ditemukan.', 404);

        $d = $this->body();
        $status = strtolower((string) ($d['status'] ?? ''));

        if (! in_array($status, ['diproses','dikirim','selesai','dibatalkan'], true)) {
            return $this->galat('Status tidak valid.');
        }

        $this->db->table('orders')->where('id', $id)->update(['status' => $status]);

        return $this->respond(['status' => true, 'order_status' => $status]);
    }

    /** GET /api/penjual/profil */
    public function profil()
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);
        return $this->respond($umkm);
    }

    /** PUT /api/penjual/profil */
    public function profilUpdate()
    {
        $umkm = $this->umkmSaya();
        if (! $umkm) return $this->galat('Akun Anda belum memiliki toko.', 404);

        $d = $this->body();
        $upd = [];

        foreach (['nama','deskripsi','whatsapp','nama_rekening','bank','no_rekening','provinsi','kota','kecamatan','alamat','gambar'] as $k) {
            if (array_key_exists($k, $d)) $upd[$k] = $d[$k];
        }
        if (isset($d['category_id'])) $upd['category_id'] = (int) $d['category_id'];

        if (! $upd) return $this->galat('Tidak ada data yang diubah.');

        $this->db->table('umkm')->where('id', $umkm['id'])->update($upd);

        return $this->respond(['status' => true]);
    }
}