<?php
namespace Database\Seeders;

use App\Models\CustomerType;
use Illuminate\Database\Seeder;

class CustomerTypeSeeder extends Seeder
{
    public function run(): void
    {
        $customerTypes = [
            [
                'name' => 'Umum / Retail',
                'description' => 'Pelanggan regular atau pembeli eceran',
            ],
            [
                'name' => 'Member',
                'description' => 'Pelanggan terdaftar yang berhak mendapat poin atau diskon khusus member',
            ],
            [
                'name' => 'Grosir / Reseller',
                'description' => 'Pelanggan yang membeli dalam partai besar untuk dijual kembali',
            ],
            [
                'name' => 'VIP',
                'description' => 'Pelanggan khusus dengan penawaran dan pelayanan prioritas',
            ],
        ];

        foreach ($customerTypes as $type) {
            CustomerType::firstOrCreate(['name' => $type['name']], $type);
        }
    }
}