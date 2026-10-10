# ARUNA API (CodeIgniter 4)

Backend REST untuk frontend Vue ARUNA UMKM. MySQL + JWT, tanpa library tambahan selain CodeIgniter.

## Pemasangan (sekali saja)

1. Buat proyek CI4 di sebelah folder frontend:
   ```
   cd C:\xampp\htdocs
   composer create-project codeigniter4/appstarter aruna-api
   ```
2. Salin folder `app` dari paket ini ke `aruna-api\app` (timpa saat ditanya; hanya `Config\Routes.php` yang menimpa file bawaan).
3. Edit `app\Config\Filters.php` mengikuti `Filters-snippet.txt` (tiga tambahan kecil).
4. Salin `env.example` menjadi `.env` di `aruna-api`, lalu isi `JWT_SECRET`.
5. Import `aruna_umkm.sql` lewat phpMyAdmin (XAMPP: MySQL harus menyala).
6. Buat akun admin:
   ```
   C:\xampp\php\php.exe spark aruna:admin admin@aruna.id KataSandiKuat123 "Admin ARUNA"
   ```
7. Jalankan API:
   ```
   C:\xampp\php\php.exe spark serve
   ```
   API ada di http://localhost:8080/api
8. Frontend: pasang proxy Vite (`vite-proxy-snippet.txt`), salin `src/services/api.js` dan `src/composables/useAuth.js`.

Catatan Apache XAMPP: kalau tidak memakai `spark serve` dan header Authorization hilang, tambahkan di `public/.htaccess`:
`RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]`

## Endpoint

Semua respons JSON. Galat berbentuk `{ "message": "..." }`.

| Metode | Path | Akses | Keterangan |
|---|---|---|---|
| GET | /api/kategori | publik | kategori produk |
| GET | /api/umkm | publik | filter: kategori, provinsi, kota, kecamatan, q |
| GET | /api/umkm/{id} | publik | detail + daftar produk |
| GET | /api/produk | publik | filter: kategori, jenis, umkm, provinsi, kota, kecamatan, q, urut |
| GET | /api/produk/{id} | publik | detail produk |
| GET | /api/jasa-kategori, /api/jasa | publik | filter jasa: kategori, wilayah, q |
| GET | /api/artikel, /api/artikel/{id} | publik | `?provinsi=` = nasional + provinsi itu |
| POST | /api/auth/register | publik | customer atau penjual (penjual otomatis membuat UMKM berstatus `menunggu`) |
| POST | /api/auth/login | publik | mengembalikan `{ token, user }` |
| GET/PUT | /api/auth/me | login | profil sendiri |
| POST | /api/pesanan | customer | `{ items:[{id,qty}], ... }`, dipecah per UMKM, stok dikurangi |
| GET | /api/pesanan, /api/pesanan/{id} | customer | riwayat |
| PATCH | /api/pesanan/{id}/batal | customer | hanya status `diproses`, stok dikembalikan |
| POST | /api/laporan | customer | `{ target_tipe, target_id, alasan }` |
| GET | /api/admin/dashboard | admin | statistik, grafik, antrean, feed |
| GET | /api/admin/{verifikasi\|umkm\|produk\|pengguna\|pesanan\|laporan} | admin | `?status=&q=` |
| PATCH | /api/admin/{bagian}/{id}/status | admin | `{ "status": "aktif" }` |

Token dikirim lewat header `Authorization: Bearer <token>`. Peran dan status akun dicek ke database di setiap request.
