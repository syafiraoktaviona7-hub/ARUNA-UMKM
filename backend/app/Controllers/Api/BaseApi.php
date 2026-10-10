<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Jwt;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Database\BaseConnection;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

abstract class BaseApi extends BaseController
{
    use ResponseTrait;

    protected BaseConnection $db;

    protected const BULAN_PENDEK  = [1 => 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    protected const BULAN_PANJANG = [1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
        $this->db = db_connect();
    }

    /** Isi body JSON sebagai array (kosong kalau tidak valid). */
    protected function body(): array
    {
        try {
            $d = $this->request->getJSON(true);
        } catch (\Throwable $e) {
            $d = null;
        }

        return is_array($d) ? $d : [];
    }

    /** Respons galat: {"message": "..."} */
    protected function galat(string $pesan, int $kode = 422)
    {
        return $this->respond(['message' => $pesan], $kode);
    }

    /** Baris users milik token yang sedang dipakai (filter auth sudah memastikan valid). */
    protected function currentUser(): ?array
    {
        $p = Jwt::fromRequest();
        if (! $p) {
            return null;
        }

        return $this->db->table('users')->where('id', (int) ($p['sub'] ?? 0))->get()->getRowArray();
    }

    /** "4 Okt 2026" atau, kalau $panjang, "4 Oktober 2026". */
    protected function tanggal(?string $dt, bool $panjang = false): string
    {
        if (! $dt) {
            return '';
        }
        $t     = strtotime($dt);
        $bulan = $panjang ? self::BULAN_PANJANG : self::BULAN_PENDEK;

        return date('j', $t) . ' ' . $bulan[(int) date('n', $t)] . ' ' . date('Y', $t);
    }

    /** "5 jam lalu", "kemarin", dst. */
    protected function lalu(?string $dt): string
    {
        if (! $dt) {
            return '';
        }
        $s = max(0, time() - strtotime($dt));
        if ($s < 3600) {
            return max(1, intdiv($s, 60)) . ' menit lalu';
        }
        if ($s < 86400) {
            return intdiv($s, 3600) . ' jam lalu';
        }
        $h = intdiv($s, 86400);

        return $h === 1 ? 'kemarin' : $h . ' hari lalu';
    }

    /** Filter ?provinsi=&kota=&kecamatan= untuk tabel dengan alias $a. */
    protected function filterWilayah($builder, string $a): void
    {
        foreach (['provinsi', 'kota', 'kecamatan'] as $k) {
            $v = trim((string) $this->request->getGet($k));
            if ($v !== '') {
                $builder->where("$a.$k", $v);
            }
        }
    }

    protected function batas(): int
    {
        $n = (int) $this->request->getGet('limit');

        return $n > 0 ? min($n, 500) : 200;
    }
}