<?php

namespace App\Filters;

use App\Libraries\Jwt;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Pemakaian di Routes: 'filter' => 'auth'            (semua peran yang login)
 *                      'filter' => 'auth:admin'      (hanya admin)
 *                      'filter' => 'auth:admin,penjual'
 * Peran dan status selalu dicek ke database, bukan dari isi token.
 */
class ApiAuth implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $payload = Jwt::fromRequest();
        if (! $payload) {
            return $this->tolak(401, 'Sesi tidak valid atau sudah berakhir. Silakan login lagi.');
        }

        $user = db_connect()->table('users')->select('id, peran, status')
            ->where('id', (int) ($payload['sub'] ?? 0))->get()->getRowArray();

        if (! $user) {
            return $this->tolak(401, 'Akun tidak ditemukan.');
        }
        if ($user['status'] !== 'aktif') {
            return $this->tolak(403, 'Akun ini diblokir. Hubungi admin ARUNA.');
        }
        if ($arguments && ! in_array($user['peran'], $arguments, true)) {
            return $this->tolak(403, 'Kamu tidak punya akses ke halaman ini.');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }

    private function tolak(int $kode, string $pesan)
    {
        return service('response')->setStatusCode($kode)->setJSON(['message' => $pesan]);
    }
}