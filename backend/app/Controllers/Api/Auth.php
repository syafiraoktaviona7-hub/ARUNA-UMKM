<?php

namespace App\Controllers\Api;

use App\Libraries\Jwt;
use App\Libraries\OtpService; 

class Auth extends BaseApi
{
    /** Ambil nilai string pertama yang terisi dari beberapa kemungkinan nama field. */
    private function ambil(array $d, array $keys): string
    {
        foreach ($keys as $k) {
            if (isset($d[$k]) && is_scalar($d[$k]) && trim((string) $d[$k]) !== '') {
                return trim((string) $d[$k]);
            }
        }

        return '';
    }

    /** Field form yang tidak punya kolom sendiri disimpan sebagai JSON di users.extra. */
    private function sisaanExtra(array $d, array $buang = []): array
    {
        $dikenal = ['id', 'name', 'nama', 'fullName', 'namaLengkap', 'email', 'phone', 'noHp', 'no_hp',
            'telepon', 'role', 'peran', 'tipe', 'passwordLama', 'currentPassword'];
        $out = [];
        foreach ($d as $k => $v) {
            if (in_array($k, $dikenal, true) || in_array($k, $buang, true) || ! is_scalar($v)) {
                continue;
            }
            foreach (['pass', 'sandi', 'confirm', 'konfirmasi'] as $x) {
                if (stripos((string) $k, $x) !== false) {
                    continue 2;
                }
            }
            $out[$k] = $v;
        }

        return $out;
    }

    private function noWa(string $v): string
    {
        $v = preg_replace('/\D/', '', $v);
        if ($v !== '' && str_starts_with($v, '0')) {
            $v = '62' . substr($v, 1);
        }

        return $v;
    }

    /** Bentuk user untuk frontend (sama dengan objek user di useAuth.js lama). */
    private function formatUser(array $row): array
    {
        $extra = json_decode((string) ($row['extra'] ?? ''), true);
        $u     = array_merge(is_array($extra) ? $extra : [], [
            'id'    => (int) $row['id'],
            'name'  => $row['nama'],
            'email' => $row['email'],
            'phone' => $row['no_hp'] ?? '',
            'role'  => $row['peran'],
        ]);

        if ($row['peran'] === 'penjual') {
            $t = $this->db->table('umkm')->select('id, nama, status')
                ->where('user_id', $row['id'])->orderBy('id')->get(1)->getRowArray();
            if ($t) {
                $u['namaToko']   = $t['nama'];
                $u['umkmId']     = (int) $t['id'];
                $u['umkmStatus'] = $t['status'];
            }
        }

        return $u;
    }

    public function register()
    {
        $d        = $this->body();
        $nama     = $this->ambil($d, ['name', 'nama', 'fullName', 'namaLengkap']);
        $email    = strtolower($this->ambil($d, ['email']));
        $password = (string) ($d['password'] ?? '');
        $phone    = $this->ambil($d, ['phone', 'nomorHp', 'noHp', 'no_hp', 'telepon']);
        $namaToko = $this->ambil($d, ['namaToko', 'nama_toko', 'shopName']);
        $roleIn   = strtolower($this->ambil($d, ['role', 'peran', 'tipe']));
        $peran    = (in_array($roleIn, ['penjual', 'seller', 'umkm'], true) || $namaToko !== '') ? 'penjual' : 'customer';

        if ($nama === '') {
            return $this->galat('Nama wajib diisi.');
        }
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->galat('Format email tidak valid.');
        }
        if (strlen($password) < 6) {
            return $this->galat('Kata sandi minimal 6 karakter.');
        }
        if ($peran === 'penjual' && $namaToko === '') {
            return $this->galat('Nama toko wajib diisi.');
        }
        if ($this->db->table('users')->where('email', $email)->countAllResults() > 0) {
            return $this->galat('Email sudah terdaftar.', 409);
        }

        // Cek nomor HP duplikat
if ($phone !== '') {
    $otpSvc = new OtpService();
    $canon  = $otpSvc->normalizePhone($phone);

    if ($canon) {
        $digits = ltrim($canon, '+');            // 62852...
        $lokal  = '0' . substr($digits, 2);      // 0852...

        $sudahDipakai = $this->db->table('users')
            ->groupStart()
                ->where('no_hp', $canon)
                ->orWhere('no_hp', $digits)
                ->orWhere('no_hp', $lokal)
            ->groupEnd()
            ->countAllResults();

        if ($sudahDipakai > 0) {
            return $this->galat('Nomor HP sudah terdaftar. Silakan login atau gunakan nomor lain.', 409);
        }

        // simpan versi kanonik ke DB
        $phone = $canon;
    }
}

        $tokoKeys = ['namaToko', 'nama_toko', 'shopName', 'kategori', 'category', 'kategoriUsaha',
            'provinsi', 'kota', 'kecamatan', 'alamat', 'whatsapp', 'deskripsi'];
        $extra = $this->sisaanExtra($d, $peran === 'penjual' ? $tokoKeys : []);

        $this->db->transBegin();

        try {
            $this->db->table('users')->insert([
                'nama'          => $nama,
                'email'         => $email,
                'no_hp'         => $phone !== '' ? $phone : null,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'peran'         => $peran,
                'extra'         => $extra ? json_encode($extra, JSON_UNESCAPED_UNICODE) : null,
            ]);
            $uid = (int) $this->db->insertID();

            if ($peran === 'penjual') {
                $katNama = $this->ambil($d, ['kategori', 'category', 'kategoriUsaha']);
                $kat     = $katNama !== '' ? $this->db->table('categories')->where('nama', $katNama)->get()->getRowArray() : null;
                $wa      = $this->noWa($this->ambil($d, ['whatsapp', 'phone', 'nomorHp', 'noHp', 'no_hp', 'telepon']));

                $this->db->table('umkm')->insert([
                    'user_id'     => $uid,
                    'nama'        => $namaToko,
                    'category_id' => $kat['id'] ?? null,
                    'deskripsi'   => $this->ambil($d, ['deskripsi']) ?: null,
                    'whatsapp'    => $wa !== '' ? $wa : null,
                    'provinsi'    => $this->ambil($d, ['provinsi']),
                    'kota'        => $this->ambil($d, ['kota']),
                    'kecamatan'   => $this->ambil($d, ['kecamatan']),
                    'alamat'      => $this->ambil($d, ['alamat']) ?: null,
                    'status'      => 'menunggu',
                ]);
            }

            $this->db->transCommit();
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', 'Register gagal: ' . $e->getMessage());

            return $this->galat('Pendaftaran gagal. Coba lagi sebentar lagi.', 500);
        }

        $row = $this->db->table('users')->where('id', $uid)->get()->getRowArray();

        return $this->respond([
            'token' => Jwt::encode(['sub' => $uid, 'role' => $peran]),
            'user'  => $this->formatUser($row),
        ], 201);
    }

    public function login()
    {
        $d   = $this->body();
        $row = $this->db->table('users')->where('email', strtolower(trim((string) ($d['email'] ?? ''))))->get()->getRowArray();

        if (! $row || ! password_verify((string) ($d['password'] ?? ''), $row['password_hash'])) {
            return $this->galat('Email atau kata sandi salah.', 401);
        }
        if ($row['status'] !== 'aktif') {
            return $this->galat('Akun ini diblokir. Hubungi admin ARUNA.', 403);
        }

        return $this->respond([
            'token' => Jwt::encode(['sub' => (int) $row['id'], 'role' => $row['peran']]),
            'user'  => $this->formatUser($row),
        ]);
    }

    public function me()
    {
        return $this->respond($this->formatUser($this->currentUser()));
    }

    public function updateMe()
    {
        $u   = $this->currentUser();
        $d   = $this->body();
        $upd = [];

        $nama = $this->ambil($d, ['name', 'nama', 'fullName', 'namaLengkap']);
        if ($nama !== '') {
            $upd['nama'] = $nama;
        }

        $email = strtolower($this->ambil($d, ['email']));
        if ($email !== '' && $email !== $u['email']) {
            if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->galat('Format email tidak valid.');
            }
            $dipakai = $this->db->table('users')->where('email', $email)->where('id !=', $u['id'])->countAllResults();
            if ($dipakai > 0) {
                return $this->galat('Email sudah digunakan oleh akun lain.', 409);
            }
            $upd['email'] = $email;
        }

        foreach (['phone', 'nomorHp', 'noHp', 'no_hp', 'telepon'] as $k) {
            if (array_key_exists($k, $d)) {
                $v            = trim((string) $d[$k]);
                $upd['no_hp'] = $v !== '' ? $v : null;
                break;
            }
        }

        if (! empty($d['password'])) {
            $lama = (string) ($d['passwordLama'] ?? $d['currentPassword'] ?? '');
            if (! password_verify($lama, $u['password_hash'])) {
                return $this->galat('Kata sandi lama salah.');
            }
            if (strlen((string) $d['password']) < 6) {
                return $this->galat('Kata sandi baru minimal 6 karakter.');
            }
            $upd['password_hash'] = password_hash((string) $d['password'], PASSWORD_DEFAULT);
        }

        $namaTokoBaru = $this->ambil($d, ['namaToko', 'nama_toko']);
        $extraBaru    = $this->sisaanExtra($d, ['namaToko', 'nama_toko', 'umkmId', 'umkmStatus']);
        if ($extraBaru) {
            $lama           = json_decode((string) ($u['extra'] ?? ''), true);
            $upd['extra']   = json_encode(array_merge(is_array($lama) ? $lama : [], $extraBaru), JSON_UNESCAPED_UNICODE);
        }

        if ($upd) {
            $this->db->table('users')->where('id', $u['id'])->update($upd);
        }
        if ($u['peran'] === 'penjual' && $namaTokoBaru !== '') {
            $this->db->table('umkm')->where('user_id', $u['id'])->update(['nama' => $namaTokoBaru]);
        }

        $row = $this->db->table('users')->where('id', $u['id'])->get()->getRowArray();

        return $this->respond($this->formatUser($row));
    }

        // ==================== OTP WhatsApp ====================

    /**
     * POST /api/auth/request-otp
     * Body: { "phone": "0812xxxx", "tujuan": "login"|"register" }
     */
    public function requestOtp()
    {
        $d     = $this->body();
        $phone = $this->ambil($d, ['phone', 'nomorHp', 'noHp', 'no_hp', 'telepon']);

        $svc   = new OtpService();
        $canon = $svc->normalizePhone($phone);

        if (! $canon) {
            return $this->galat('Nomor HP tidak valid.');
        }

        $tujuan = strtolower($this->ambil($d, ['tujuan', 'purpose'])) ?: 'login';
        if (! in_array($tujuan, ['login', 'register'], true)) {
            $tujuan = 'login';
        }

        // Rate limit sederhana: cooldown 60 detik per nomor
        $cek = $this->db->table('otp_codes')
            ->where('phone', $canon)
            ->where('tujuan', $tujuan)
            ->where('created_at >', date('Y-m-d H:i:s', time() - OtpService::RESEND_COOLDOWN_SECONDS))
            ->orderBy('id', 'DESC')
            ->get(1)->getRowArray();

        if ($cek) {
            $sisa = OtpService::RESEND_COOLDOWN_SECONDS - (time() - strtotime($cek['created_at']));
            return $this->galat("Mohon tunggu {$sisa} detik sebelum minta OTP lagi.", 429);
        }

        $code = $svc->generateCode();
        $hash = $svc->hashCode($code);

        $this->db->table('otp_codes')->insert([
            'phone'      => $canon,
            'code_hash'  => $hash,
            'tujuan'     => $tujuan,
            'percobaan'  => 0,
            'expires_at' => date('Y-m-d H:i:s', time() + OtpService::OTP_TTL_SECONDS),
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        if (! $svc->sendViaWhatsapp($canon, $code)) {
            return $this->galat('Gagal mengirim OTP WhatsApp. Coba lagi nanti.', 500);
        }

        return $this->respond([
            'status'  => true,
            'message' => 'OTP telah dikirim ke WhatsApp ' . $svc->maskPhone($canon),
            'phone'   => $canon,
        ]);
    }

    /**
     * POST /api/auth/verify-otp
     * Body: { "phone": "0812xxxx", "code": "123456", "tujuan": "login" }
     *
     * Kalau tujuan=login dan nomor sudah terdaftar → langsung kembalikan token+user.
     * Kalau nomor belum terdaftar → hanya kembalikan status verified (frontend lanjut ke form register).
     */
    public function verifyOtp()
    {
        $d     = $this->body();
        $phone = $this->ambil($d, ['phone', 'nomorHp', 'noHp', 'no_hp', 'telepon']);
        $code  = $this->ambil($d, ['code', 'otp', 'kode']);

        $svc   = new OtpService();
        $canon = $svc->normalizePhone($phone);

        if (! $canon) {
            return $this->galat('Nomor HP tidak valid.');
        }
        if ($code === '' || ! preg_match('/^\d{4,8}$/', $code)) {
            return $this->galat('Kode OTP tidak valid.');
        }

        $tujuan = strtolower($this->ambil($d, ['tujuan', 'purpose'])) ?: 'login';

        $row = $this->db->table('otp_codes')
            ->where('phone', $canon)
            ->where('tujuan', $tujuan)
            ->where('used_at', null)
            ->orderBy('id', 'DESC')
            ->get(1)->getRowArray();

        if (! $row) {
            return $this->galat('Kode OTP tidak ditemukan. Minta kode baru.', 404);
        }
        if (strtotime($row['expires_at']) < time()) {
            return $this->galat('Kode OTP sudah kedaluwarsa. Minta kode baru.', 410);
        }
        if ((int) $row['percobaan'] >= 5) {
            return $this->galat('Terlalu banyak percobaan. Minta kode baru.', 429);
        }
        if (! $svc->verifyCode($code, $row['code_hash'])) {
            $this->db->table('otp_codes')->where('id', $row['id'])
                ->update(['percobaan' => (int) $row['percobaan'] + 1]);
            return $this->galat('Kode OTP salah.', 401);
        }

        // Tandai terpakai
        $this->db->table('otp_codes')->where('id', $row['id'])
            ->update(['used_at' => date('Y-m-d H:i:s')]);

        // Cek apakah nomor sudah terdaftar
$digits = ltrim($canon, '+');
$lokal  = '0' . substr($digits, 2);
$user   = $this->db->table('users')
    ->groupStart()
        ->where('no_hp', $canon)
        ->orWhere('no_hp', $digits)
        ->orWhere('no_hp', $lokal)
    ->groupEnd()
    ->get(1)->getRowArray();

// Kalau tujuan=register dan nomor sudah terdaftar → tolak
if ($tujuan === 'register' && $user) {
    return $this->galat('Nomor HP sudah terdaftar. Silakan login atau gunakan nomor lain.', 409);
}

if (! $user) {
    return $this->respond([
        'status'     => true,
        'registered' => false,
        'message'    => 'Nomor terverifikasi. Silakan lengkapi pendaftaran.',
        'phone'      => $canon,
    ]);
}

if ($user['status'] !== 'aktif') {
    return $this->galat('Akun ini diblokir. Hubungi admin ARUNA.', 403);
}

return $this->respond([
    'status'     => true,
    'registered' => true,
    'token'      => Jwt::encode(['sub' => (int) $user['id'], 'role' => $user['peran']]),
    'user'       => $this->formatUser($user),
]);
    }
}