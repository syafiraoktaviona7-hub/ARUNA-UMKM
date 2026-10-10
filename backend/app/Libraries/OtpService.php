<?php

namespace App\Libraries;

class OtpService
{
    public const OTP_TTL_SECONDS          = 300;  // 5 menit
    public const RESEND_COOLDOWN_SECONDS  = 60;   // 1 menit

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
        $config     = config(\Config\Whatsapp::class);
        $gatewayUrl = $config->gatewayUrl;
        $apiKey     = $config->apiKey;

        if (empty($apiKey)) {
            log_message('error', 'OTP WhatsApp: whatsapp.apiKey belum diisi di .env.');
            return false;
        }

        $message = "🔐 *Aruna UMKM - Kode OTP Login*\n\n"
            . "Kode verifikasi kamu:\n\n"
            . '*' . implode('  ', str_split($code)) . "*\n\n"
            . '⏱ Berlaku hanya *' . (self::OTP_TTL_SECONDS / 60) . " menit*\n\n"
            . "---\n"
            . "⚠️ Jangan bagikan kode ini ke siapa pun.";

        $body = [
            'api_key'  => $apiKey,
            'receiver' => $canonicalPhone,
            'data'     => ['message' => $message],
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $gatewayUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => json_encode($body),
            CURLOPT_HTTPHEADER     => ['Accept: application/json', 'Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error || $response === false) {
            log_message('error', 'Gagal kirim OTP WhatsApp (curl): ' . $error);
            return false;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            log_message('error', "Gagal kirim OTP WhatsApp (HTTP {$httpCode}): " . $response);
            return false;
        }

        log_message('info', 'OTP WhatsApp terkirim ke ' . $canonicalPhone);
        return true;
    }
}