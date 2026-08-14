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
        Schema::create('product_batches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->restrictOnDelete();

            $table->string('batch_number', 100);

            $table->date('production_date')->nullable();
            $table->date('expiry_date')->nullable();

            $table->decimal('quantity', 15, 3)->default(0);

            $table->decimal('purchase_price', 15, 2)->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index([
                'product_id',
                'warehouse_id',
            ]);

            $table->index('batch_number');
            $table->index('expiry_date');

            $table->unique([
                'product_id',
                'warehouse_id',
                'batch_number',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_batches');
    }
};
