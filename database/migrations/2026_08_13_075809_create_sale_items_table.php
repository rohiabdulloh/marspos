<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sale_id')
                ->constrained('sales')
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->foreignId('unit_id')
                ->constrained('units')
                ->restrictOnDelete();

            $table->foreignId('batch_id')
                ->nullable()
                ->constrained('product_batches')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Snapshot Produk
            |--------------------------------------------------------------------------
            */
            $table->string('product_name');

            $table->string('sku', 50)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Quantity
            |--------------------------------------------------------------------------
            |
            | quantity
            | = jumlah sesuai satuan yang dipilih kasir
            |
            | base_quantity
            | = jumlah yang dikonversi ke satuan dasar
            |
            */
            $table->decimal('quantity', 15, 3)
                ->default(1);

            $table->decimal('conversion_factor', 15, 3)
                ->default(1);

            $table->decimal('base_quantity', 15, 3)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Harga
            |--------------------------------------------------------------------------
            */
            $table->decimal('unit_price', 15, 2)
                ->default(0);

            $table->decimal('cost_price', 15, 2)
                ->default(0);

            $table->decimal('subtotal', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Diskon
            |--------------------------------------------------------------------------
            */
            $table->decimal('discount_percent', 8, 2)
                ->default(0);

            $table->decimal('discount_amount', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Pajak
            |--------------------------------------------------------------------------
            */
            $table->decimal('tax_percent', 8, 2)
                ->default(0);

            $table->decimal('tax_amount', 15, 2)
                ->default(0);

            $table->decimal('total', 15, 2)
                ->default(0);

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('sale_id');
            $table->index('product_id');
            $table->index('unit_id');
            $table->index('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
