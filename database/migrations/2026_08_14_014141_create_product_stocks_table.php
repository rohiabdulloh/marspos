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
        Schema::create('product_stocks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->cascadeOnDelete();

            $table->foreignId('batch_id')
                ->nullable()
                ->constrained('product_batches')
                ->nullOnDelete();

            $table->decimal('quantity', 15, 3)
                ->default(0);

            $table->decimal('reserved_quantity', 15, 3)
                ->default(0);

            $table->decimal('average_cost', 15, 2)
                ->default(0);

            $table->timestamps();

            // Satu produk + batch hanya memiliki satu saldo
            // pada satu gudang.
            $table->unique(
                ['product_id', 'warehouse_id', 'batch_id'],
                'product_stocks_product_warehouse_batch_unique'
            );

            $table->index(['product_id', 'warehouse_id']);
            $table->index('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_stocks');
    }
};
