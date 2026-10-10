<?php

namespace App\Libraries;

use RuntimeException;

/**
 * JWT HS256 sederhana tanpa library tambahan.
 * Rahasia diambil dari JWT_SECRET di file .env
 */
class Jwt
{
    private static function b64e(string $d): string
    {
        return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
    }

    private static function b64d(string $d): string
    {
        return (string) base64_decode(strtr($d, '-_', '+/'));
    }

    private static function secret(): string
    {
        $s = (string) env('JWT_SECRET', '');
        if (strlen($s) < 16) {
            throw new RuntimeException('JWT_SECRET di file .env belum diisi (minimal 16 karakter).');
        }

        return $s;
    }

    public static function encode(array $payload, int $ttl = 604800): string
    {
        $now            = time();
        $payload['iat'] = $now;
        $payload['exp'] = $now + $ttl;
        $h              = self::b64e(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $p              = self::b64e(json_encode($payload));
        $s              = self::b64e(hash_hmac('sha256', "$h.$p", self::secret(), true));

        return "$h.$p.$s";
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$h, $p, $s] = $parts;
        $calc        = self::b64e(hash_hmac('sha256', "$h.$p", self::secret(), true));
        if (! hash_equals($calc, $s)) {
            return null;
        }

        $data = json_decode(self::b64d($p), true);
        if (! is_array($data) || ($data['exp'] ?? 0) < time()) {
            return null;
        }

        return $data;
    }

    public static function fromRequest(): ?array
    {
        $header = service('request')->getHeaderLine('Authorization');
        if (! preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            return null;
        }

        return self::decode(trim($m[1]));
    }
}