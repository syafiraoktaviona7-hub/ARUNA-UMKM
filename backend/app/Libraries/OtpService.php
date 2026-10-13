<?php

namespace App\Libraries;

class OtpService
{
    /** Masa berlaku OTP dalam detik (5 menit) */
    public const OTP_TTL_SECONDS = 300;

    /** Jeda minimum sebelum boleh minta OTP baru untuk phone yang sama */
    public const RESEND_COOLDOWN_SECONDS = 60;

    /** Batas request OTP per phone dalam 1 jam */
    public const MAX_REQUEST_PER_PHONE_PER_HOUR = 5;

    /** Batas request OTP per IP dalam 1 jam */
    public const MAX_REQUEST_PER_IP_PER_HOUR = 10;

    /** Nama brand untuk pesan WhatsApp */
    protected const BRAND_NAME = 'Aruna UMKM';

    public function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function hashCode(string $code): string
    {
        return password_hash($code, PASSWORD_DEFAULT);
    }

    public function verifyCode(string $code, string $hash): bool
    {
        return password_verify($code, $hash);
    }

    public function normalizePhone(string $rawPhone): ?string
    {
        $digits = preg_replace('/[^\d]/', '', $rawPhone);

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '620')) {
            $digits = '62' . substr($digits, 3);
        } elseif (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62' . $digits;
        } elseif (!str_starts_with($digits, '62')) {
            return null;
        }

        if (strlen($digits) < 10 || strlen($digits) > 15) {
            return null;
        }

        return '+' . $digits;
    }

    public function maskPhone(string $canonicalPhone): string
    {
        $len = strlen($canonicalPhone);

        if ($len <= 8) {
            return substr($canonicalPhone, 0, 3) . str_repeat('*', max(0, $len - 3));
        }

        $prefix    = substr($canonicalPhone, 0, 5);
        $suffix    = substr($canonicalPhone, -3);
        $maskedLen = $len - strlen($prefix) - strlen($suffix);

        return $prefix . str_repeat('*', max(3, $maskedLen)) . $suffix;
    }

    public function sendViaWhatsapp(string $canonicalPhone, string $code): bool
    {
        $config = config(\Config\Whatsapp::class);

        if (empty($config->apiKey) || empty($config->gatewayUrl)) {
            log_message('error', 'OTP WhatsApp: whatsapp.gatewayUrl / whatsapp.apiKey belum diisi di .env.');
            return false;
        }

        $brand = self::BRAND_NAME;

        $message = "🔐 *{$brand} - Kode OTP Login*\n\n"
            . "Kode verifikasi kamu:\n\n"
            . '*' . implode('  ', str_split($code)) . "*\n\n"
            . '⏱ Berlaku hanya *' . (self::OTP_TTL_SECONDS / 60) . " menit*\n\n"
            . "---\n"
            . "⚠️ Jangan bagikan kode ini ke siapa pun.\n"
            . "{$brand} tidak pernah meminta kode OTP kamu.";

        $payload = [
            'api_key'   => $config->apiKey,
            'device_id' => (int) $config->deviceId,
            'to'        => ltrim($canonicalPhone, '+'),   // +62812... -> 62812...
            'type'      => 'text',
            'text'      => $message,
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $config->gatewayUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => ['Accept: application/json', 'Content-Type: application/json'],
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 20,
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        $status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error || $response === false) {
            log_message('error', 'Gagal kirim OTP WhatsApp (curl): ' . $error);
            return false;
        }

        log_message('info', "OTP WhatsApp: HTTP {$status} - {$response}");

        if ($status < 200 || $status >= 300) {
            log_message('error', "Gagal kirim OTP WhatsApp (HTTP {$status}): {$response}");
            return false;
        }

        $json = json_decode($response, true);
        if (is_array($json) && (
            !empty($json['error'])
            || (array_key_exists('ok', $json) && $json['ok'] === false)
            || (array_key_exists('success', $json) && $json['success'] === false)
            || (array_key_exists('status', $json) && $json['status'] === false)
        )) {
            log_message('error', 'Gagal kirim OTP WhatsApp (API): ' . $response);
            return false;
        }

        return true;
    }
}