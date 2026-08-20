<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'brand_id' => Brand::inRandomOrder()->first()?->id ?? Brand::factory(),
            'base_unit_id' => Unit::inRandomOrder()->first()?->id ?? Unit::factory(),
            'sku' => 'SKU-' . strtoupper($this->faker->unique()->bothify('###-???')),
            'barcode' => $this->faker->unique()->numerify('##########'),
            'name' => $this->faker->words(3, true),
            'type' => 'product',
            'description' => $this->faker->sentence(),
            'purchase_price' => $this->faker->numberBetween(10000, 50000),
            'selling_price' => $this->faker->numberBetween(60000, 100000),
            'minimum_stock' => 5,
            'maximum_stock' => 100,
            'has_batch' => false,
            'has_expiry' => false,
            'image' => null,
            'is_active' => true,
        ];
    }
}