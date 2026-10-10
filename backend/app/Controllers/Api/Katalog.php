<?php

namespace App\Controllers\Api;

/**
 * Endpoint publik (tanpa login). Bentuk JSON sengaja sama dengan data dummy di
 * src/data/*.js supaya komponen frontend cukup mengganti sumber datanya.
 */
class Katalog extends BaseApi
{
    // ------------------------------------------------------------ kategori
    public function kategori()
    {
        $rows = $this->db->table('categories')->orderBy('urutan')->get()->getResultArray();

        return $this->respond(array_map(static fn ($r) => [
            'id'    => (int) $r['id'],
            'name'  => $r['nama'],
            'slug'  => $r['slug'],
            'color' => $r['warna'],
            'bg'    => $r['bg'],
            'icon'  => $r['icon_svg'],
            'image' => $r['gambar'],
        ], $rows));
    }

    // ---------------------------------------------------------------- umkm
    public function umkmList()
    {
        $b = $this->db->table('umkm u')
            ->select('u.id, u.nama AS name, c.nama AS category, u.provinsi AS province, u.kota AS city, u.kecamatan AS district, u.gambar AS image')
            ->join('categories c', 'c.id = u.category_id', 'left')
            ->where('u.status', 'aktif');

        $this->filterWilayah($b, 'u');

        $kat = trim((string) $this->request->getGet('kategori'));
        if ($kat !== '' && $kat !== 'Semua') {
            $b->where('c.nama', $kat);
        }
        $q = trim((string) $this->request->getGet('q'));
        if ($q !== '') {
            $b->like('u.nama', $q);
        }

        $rows = $b->orderBy('u.id')->limit($this->batas())->get()->getResultArray();

        return $this->respond(array_map(fn ($r) => $this->rapikanUmkm($r), $rows));
    }

    public function umkmDetail($id)
    {
        $r = $this->db->table('umkm u')
            ->select('u.id, u.nama AS name, c.nama AS category, u.provinsi AS province, u.kota AS city, u.kecamatan AS district, u.gambar AS image, u.whatsapp, u.deskripsi AS description, u.alamat AS address')
            ->join('categories c', 'c.id = u.category_id', 'left')
            ->where('u.id', (int) $id)->where('u.status', 'aktif')
            ->get()->getRowArray();

        if (! $r) {
            return $this->galat('UMKM tidak ditemukan.', 404);
        }

        $produk = $this->produkBuilder()->where('p.umkm_id', (int) $id)->orderBy('p.id')->get()->getResultArray();

        $out             = $this->rapikanUmkm($r);
        $out['whatsapp'] = $r['whatsapp'] ?? '';
        $out['description'] = $r['description'] ?? '';
        $out['address']     = $r['address'] ?? '';
        $out['produk']      = array_map(fn ($p) => $this->rapikanProduk($p), $produk);

        return $this->respond($out);
    }

    private function rapikanUmkm(array $r): array
    {
        $r['id']       = (int) $r['id'];
        $r['category'] = $r['category'] ?? '';
        $r['image']    = $r['image'] ?? '';

        return $r;
    }

    // -------------------------------------------------------------- produk
    private function produkBuilder()
    {
        return $this->db->table('products p')
            ->select('p.id, p.nama AS name, p.umkm_id AS umkmId, u.nama AS shop, c.nama AS category, p.jenis, p.harga AS price, p.terjual AS sold, u.provinsi AS province, u.kota AS city, u.kecamatan AS district, p.gambar AS image, u.whatsapp, p.stok, p.deskripsi')
            ->join('umkm u', 'u.id = p.umkm_id')
            ->join('categories c', 'c.id = p.category_id')
            ->where('p.status', 'tampil')
            ->where('u.status', 'aktif');
    }

    private function rapikanProduk(array $r): array
    {
        foreach (['id', 'umkmId', 'price', 'sold', 'stok'] as $k) {
            $r[$k] = (int) $r[$k];
        }
        $r['jenis']     = $r['jenis'] ?? '';
        $r['whatsapp']  = $r['whatsapp'] ?? '';
        $r['image']     = $r['image'] ?? '';
        $r['deskripsi'] = $r['deskripsi'] ?? '';

        return $r;
    }

    public function produkList()
    {
        $b = $this->produkBuilder();
        $this->filterWilayah($b, 'u');

        $kat = trim((string) $this->request->getGet('kategori'));
        if ($kat !== '' && $kat !== 'Semua') {
            $b->where('c.nama', $kat);
        }
        $jenis = trim((string) $this->request->getGet('jenis'));
        if ($jenis !== '') {
            $b->where('p.jenis', $jenis);
        }
        $umkm = (int) $this->request->getGet('umkm');
        if ($umkm > 0) {
            $b->where('p.umkm_id', $umkm);
        }
        $q = trim((string) $this->request->getGet('q'));
        if ($q !== '') {
            $b->like('p.nama', $q);
        }

        switch ($this->request->getGet('urut')) {
            case 'terlaris':
                $b->orderBy('p.terjual', 'DESC');
                break;
            case 'termurah':
                $b->orderBy('p.harga', 'ASC');
                break;
            case 'termahal':
                $b->orderBy('p.harga', 'DESC');
                break;
            default:
                $b->orderBy('p.id', 'ASC');
        }

        $rows = $b->limit($this->batas())->get()->getResultArray();

        return $this->respond(array_map(fn ($r) => $this->rapikanProduk($r), $rows));
    }

    public function produkDetail($id)
    {
        $r = $this->produkBuilder()->where('p.id', (int) $id)->get()->getRowArray();

        return $r ? $this->respond($this->rapikanProduk($r)) : $this->galat('Produk tidak ditemukan.', 404);
    }

    // ---------------------------------------------------------------- jasa
    public function jasaKategori()
    {
        $rows = $this->db->table('jasa_categories')->orderBy('urutan')->get()->getResultArray();

        return $this->respond(array_map(static fn ($r) => [
            'name' => $r['nama'], 'desc' => $r['deskripsi'], 'icon' => $r['icon_svg'],
        ], $rows));
    }

    public function jasaList()
    {
        $b = $this->db->table('jasa j')
            ->select('j.id, j.nama AS name, jc.nama AS category, j.deskripsi AS description, j.harga_label AS price, j.mode, j.whatsapp, j.provinsi AS province, j.kota AS city, j.kecamatan AS district')
            ->join('jasa_categories jc', 'jc.id = j.category_id')
            ->where('j.status', 'aktif');

        $this->filterWilayah($b, 'j');

        $kat = trim((string) $this->request->getGet('kategori'));
        if ($kat !== '' && $kat !== 'Semua') {
            $b->where('jc.nama', $kat);
        }
        $q = trim((string) $this->request->getGet('q'));
        if ($q !== '') {
            $b->like('j.nama', $q);
        }

        $rows = $b->orderBy('j.id')->limit($this->batas())->get()->getResultArray();
        foreach ($rows as &$r) {
            $r['id']       = (int) $r['id'];
            $r['whatsapp'] = $r['whatsapp'] ?? '';
        }

        return $this->respond($rows);
    }

    // ------------------------------------------------------------- artikel
    private function rapikanArtikel(array $r, array $tags): array
    {
        return [
            'id'         => (int) $r['id'],
            'slug'       => $r['slug'],
            'province'   => $r['provinsi'] ?? '',
            'title'      => $r['judul'],
            'excerpt'    => $r['ringkasan'] ?? '',
            'tag'        => $r['tag_utama'] ?? '',
            'categories' => $tags,
            'author'     => $r['penulis'],
            'date'       => $this->tanggal($r['terbit_pada'], true),
            'time'       => $r['menit_baca'] . ' menit baca',
            'image'      => $r['gambar'] ?? '',
        ];
    }

    private function tagsUntuk(array $ids): array
    {
        if (! $ids) {
            return [];
        }
        $out = [];
        foreach ($this->db->table('article_tags')->whereIn('article_id', $ids)->get()->getResultArray() as $t) {
            $out[(int) $t['article_id']][] = $t['tag'];
        }

        return $out;
    }

    public function artikelList()
    {
        $b = $this->db->table('articles')->where('status', 'terbit');

        $prov = trim((string) $this->request->getGet('provinsi'));
        if ($prov !== '') {
            // Artikel nasional + artikel khusus provinsi tersebut
            $b->groupStart()->where('provinsi IS NULL', null, false)->orWhere('provinsi', $prov)->groupEnd();
        }

        $rows = $b->orderBy('terbit_pada', 'DESC')->limit($this->batas())->get()->getResultArray();
        $tags = $this->tagsUntuk(array_map(static fn ($r) => (int) $r['id'], $rows));

        return $this->respond(array_map(fn ($r) => $this->rapikanArtikel($r, $tags[(int) $r['id']] ?? []), $rows));
    }

    public function artikelDetail($id)
    {
        $r = $this->db->table('articles')->where('id', (int) $id)->where('status', 'terbit')->get()->getRowArray();
        if (! $r) {
            return $this->galat('Artikel tidak ditemukan.', 404);
        }

        $tags   = $this->tagsUntuk([(int) $r['id']]);
        $out    = $this->rapikanArtikel($r, $tags[(int) $r['id']] ?? []);
        $blocks = $this->db->table('article_blocks')->where('article_id', (int) $id)->orderBy('urutan')->get()->getResultArray();

        $out['content'] = array_map(static fn ($b) => ['type' => $b['tipe'], 'text' => $b['teks']], $blocks);

        return $this->respond($out);
    }
}