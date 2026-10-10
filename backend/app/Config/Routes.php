<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->setAutoRoute(false);

// Preflight CORS (header-nya diisi filter 'cors')
$routes->options('(:any)', static fn () => service('response')->setStatusCode(204));

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function (RouteCollection $routes) {
    // ---------- Publik ----------
    $routes->get('kategori', 'Katalog::kategori');
    $routes->get('umkm', 'Katalog::umkmList');
    $routes->get('umkm/(:num)', 'Katalog::umkmDetail/$1');
    $routes->get('produk', 'Katalog::produkList');
    $routes->get('produk/(:num)', 'Katalog::produkDetail/$1');
    $routes->get('jasa-kategori', 'Katalog::jasaKategori');
    $routes->get('jasa', 'Katalog::jasaList');
    $routes->get('artikel', 'Katalog::artikelList');
    $routes->get('artikel/(:num)', 'Katalog::artikelDetail/$1');

    $routes->post('auth/register', 'Auth::register');
    $routes->post('auth/login', 'Auth::login');
    $routes->post('auth/request-otp', 'Auth::requestOtp');
    $routes->post('auth/verify-otp',  'Auth::verifyOtp');

    // ---------- Semua peran yang sudah login ----------
    $routes->group('', ['filter' => 'auth'], static function (RouteCollection $routes) {
        $routes->get('auth/me', 'Auth::me');
        $routes->put('auth/me', 'Auth::updateMe');
    });

    // ---------- Customer ----------
    $routes->group('', ['filter' => 'auth:customer'], static function (RouteCollection $routes) {
        $routes->post('pesanan', 'Customer::pesananBuat');
        $routes->get('pesanan', 'Customer::pesananList');
        $routes->get('pesanan/(:num)', 'Customer::pesananDetail/$1');
        $routes->patch('pesanan/(:num)/batal', 'Customer::pesananBatal/$1');
        $routes->post('laporan', 'Customer::laporanBuat');
    });

    // ---------- Admin ----------
    $routes->group('admin', ['filter' => 'auth:admin'], static function (RouteCollection $routes) {
        $routes->get('dashboard', 'Admin::dashboard');
        $routes->get('badge', 'Admin::badge');
        $routes->get('(verifikasi|umkm|produk|pengguna|pesanan|laporan)', 'Admin::daftar/$1');
        $routes->patch('(verifikasi|umkm|produk|pengguna|pesanan|laporan)/(:num)/status', 'Admin::ubahStatus/$1/$2');
    });
});