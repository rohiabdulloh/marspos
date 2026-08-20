<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductUnit;
use App\Models\ProductPrice;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada minimal 1 unit dasar yang tersedia di database
        $units = Unit::all();
        if ($units->isEmpty()) {
            return; // Atau buat unit default jika belum ada
        }

        // Buat 10 produk dummy
        Product::factory(10)->create()->each(function ($product) use ($units) {
            // Ambil unit acak selain unit dasar untuk dijadikan satuan konversi tambahan
            $randomUnit = $units->where('id', '!=', $product->base_unit_id)->random();

            if ($randomUnit) {
                // Buat 1 data konversi satuan (Contoh: 1 Dus = 12 Pcs)
                ProductUnit::create([
                    'product_id' => $product->id,
                    'unit_id' => $randomUnit->id,
                    'conversion_factor' => 12,
                    'purchase_price' => $product->purchase_price * 12,
                    'selling_price' => $product->selling_price * 12,
                    'is_purchase_unit' => true,
                    'is_sale_unit' => true,
                ]);
            }

            // Buat level harga khusus (Contoh: Harga Member / Grosir)
            ProductPrice::create([
                'product_id' => $product->id,
                'unit_id' => $product->base_unit_id,
                'price_type' => 'Member',
                'price' => $product->selling_price * 0.9, // Diskon 10% untuk member
                'minimum_quantity' => 1,
                'is_active' => true,
            ]);

            ProductPrice::create([
                'product_id' => $product->id,
                'unit_id' => $randomUnit?->id ?? $product->base_unit_id,
                'price_type' => 'Grosir',
                'price' => $product->selling_price * 11, // Harga grosir paketan
                'minimum_quantity' => 1,
                'is_active' => true,
            ]);
        });
    }
}