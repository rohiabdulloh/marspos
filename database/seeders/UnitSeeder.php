<?php
namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // --- PRIORITAS 1: PALING SERING DIGUNAKAN (Kasir & Ritel Umum) ---
            [
                'name' => 'Piece',
                'short_name' => 'Pcs',
                'description' => 'Satuan umum per buah / satuan terkecil (Paling sering)',
                'is_active' => true,
            ],
            [
                'name' => 'Kilogram',
                'short_name' => 'Kg',
                'description' => 'Satuan berat standar (sembako, buah, daging, dll)',
                'is_active' => true,
            ],
            [
                'name' => 'Pack',
                'short_name' => 'Pck',
                'description' => 'Kemasan plastik atau bungkus sedang',
                'is_active' => true,
            ],
            [
                'name' => 'Box',
                'short_name' => 'Box',
                'description' => 'Kemasan kardus atau kotak',
                'is_active' => true,
            ],
            [
                'name' => 'Lusin',
                'short_name' => 'Lsn',
                'description' => 'Satuan jumlah per 12 buah',
                'is_active' => true,
            ],
            [
                'name' => 'Liter',
                'short_name' => 'L',
                'description' => 'Satuan volume cairan (minyak goreng, deterjen cair, dll)',
                'is_active' => true,
            ],

            // --- PRIORITAS 2: SERING DIGUNAKAN (Grosir & Toko Kelontong) ---
            [
                'name' => 'Karton',
                'short_name' => 'Karton',
                'description' => 'Kemasan kardus besar (dus mie, air mineral)',
                'is_active' => true,
            ],
            [
                'name' => 'Renceng',
                'short_name' => 'Renceng',
                'description' => 'Kemasan gantung isi beberapa sachet (kopi, shampoo)',
                'is_active' => true,
            ],
            [
                'name' => 'Sachet',
                'short_name' => 'Sachet',
                'description' => 'Kemasan kecil sekali pakai',
                'is_active' => true,
            ],
            [
                'name' => 'Sak / Karung',
                'short_name' => 'Sak',
                'description' => 'Kemasan karung besar (beras, terigu, gula pasir)',
                'is_active' => true,
            ],
            [
                'name' => 'Gram',
                'short_name' => 'Gr',
                'description' => 'Satuan berat kecil (bumbu dapur, rempah, snack gramasi)',
                'is_active' => true,
            ],
            [
                'name' => 'Mililiter',
                'short_name' => 'Ml',
                'description' => 'Satuan volume kecil (minuman botol kecil, parfum, obat)',
                'is_active' => true,
            ],

            // --- PRIORITAS 3: KEBUTUHAN SPESIFIK / MENENGAH ---
            [
                'name' => 'Botol',
                'short_name' => 'Btl',
                'description' => 'Kemasan botol (kecap, saus, sirup, obat)',
                'is_active' => true,
            ],
            [
                'name' => 'Kaleng',
                'short_name' => 'Kaleng',
                'description' => 'Kemasan logam kaleng (susu kental manis, sarden)',
                'is_active' => true,
            ],
            [
                'name' => 'Ons',
                'short_name' => 'Ons',
                'description' => 'Satuan berat tradisional (1 ons = 100 gram)',
                'is_active' => true,
            ],
            [
                'name' => 'Pasang',
                'short_name' => 'Psg',
                'description' => 'Untuk alas kaki, kaos kaki, atau barang berpasangan',
                'is_active' => true,
            ],
            [
                'name' => 'Roll',
                'short_name' => 'Roll',
                'description' => 'Kemasan gulungan (kertas kasir, isolasi, kabel)',
                'is_active' => true,
            ],
            [
                'name' => 'Unit',
                'short_name' => 'Unit',
                'description' => 'Untuk barang elektronik / perangkat bernomor seri',
                'is_active' => true,
            ],

            // --- PRIORITAS 4: JARANG DIGUNAKAN / KHUSUS (Tekstil, Grosir Besar, dll) ---
            [
                'name' => 'Galon',
                'short_name' => 'Gln',
                'description' => 'Kemasan air mineral besar atau bahan kimia',
                'is_active' => true,
            ],
            [
                'name' => 'Meter',
                'short_name' => 'M',
                'description' => 'Untuk toko kain, tali, atau pipa',
                'is_active' => true,
            ],
            [
                'name' => 'Yard',
                'short_name' => 'Yard',
                'description' => 'Satuan panjang standar industri kain/tekstil',
                'is_active' => true,
            ],
            [
                'name' => 'Centimeter',
                'short_name' => 'Cm',
                'description' => 'Satuan panjang kecil',
                'is_active' => true,
            ],
            [
                'name' => 'Rim',
                'short_name' => 'Rim',
                'description' => 'Satuan khusus kertas (500 lembar)',
                'is_active' => true,
            ],
            [
                'name' => 'Gross',
                'short_name' => 'Gross',
                'description' => 'Satuan jumlah per 144 buah (12 lusin)',
                'is_active' => true,
            ],
            [
                'name' => 'Miligram',
                'short_name' => 'Mg',
                'description' => 'Satuan berat sangat kecil (farmasi/obat)',
                'is_active' => true,
            ],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['short_name' => $unit['short_name']], $unit);
        }
    }
}