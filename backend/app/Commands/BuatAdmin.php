<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class BuatAdmin extends BaseCommand
{
    protected $group       = 'ARUNA';
    protected $name        = 'aruna:admin';
    protected $description = 'Buat akun admin, atau reset kata sandinya kalau emailnya sudah ada.';
    protected $usage       = 'aruna:admin [email] [kata_sandi] [nama]';

    public function run(array $params)
    {
        $email = strtolower($params[0] ?? CLI::prompt('Email admin', 'admin@aruna.id'));
        $pw    = $params[1] ?? CLI::prompt('Kata sandi (minimal 8 karakter)');
        $nama  = $params[2] ?? 'Admin ARUNA';

        if (strlen($pw) < 8) {
            CLI::error('Kata sandi minimal 8 karakter.');

            return;
        }

        $db   = db_connect();
        $ada  = $db->table('users')->where('email', $email)->get()->getRowArray();
        $hash = password_hash($pw, PASSWORD_DEFAULT);

        if ($ada) {
            $db->table('users')->where('id', $ada['id'])->update([
                'password_hash' => $hash, 'peran' => 'admin', 'status' => 'aktif',
            ]);
            CLI::write("Akun {$email} diperbarui menjadi admin.", 'green');

            return;
        }

        $db->table('users')->insert([
            'nama' => $nama, 'email' => $email, 'password_hash' => $hash, 'peran' => 'admin',
        ]);
        CLI::write("Admin {$email} dibuat.", 'green');
    }
}