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
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('purchase_id')
                ->constrained('purchases')
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->foreignId('unit_id')
                ->constrained('units')
                ->restrictOnDelete();

            $table->string('product_name');

            $table->string('sku', 50)
                ->nullable();

            $table->decimal('quantity', 15, 3)
                ->default(0);

            $table->decimal('conversion_factor', 15, 3)
                ->default(1);

            $table->decimal('base_quantity', 15, 3)
                ->default(0);

            $table->decimal('unit_price', 15, 2)
                ->default(0);

            $table->decimal('subtotal', 15, 2)
                ->default(0);

            $table->decimal('discount_percent', 8, 2)
                ->default(0);

            $table->decimal('discount_amount', 15, 2)
                ->default(0);

            $table->decimal('tax_percent', 8, 2)
                ->default(0);

            $table->decimal('tax_amount', 15, 2)
                ->default(0);

            $table->decimal('total', 15, 2)
                ->default(0);

            $table->string('batch_number', 100)
                ->nullable();

            $table->date('production_date')
                ->nullable();

            $table->date('expiry_date')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('purchase_id');
            $table->index('product_id');
            $table->index('unit_id');
            $table->index('batch_number');
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
