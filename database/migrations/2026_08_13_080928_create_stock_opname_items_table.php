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
        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stock_opname_id')
                ->constrained('stock_opnames')
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
            | Stock System
            |--------------------------------------------------------------------------
            */
            $table->decimal('system_quantity', 15, 3)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Stock Physical
            |--------------------------------------------------------------------------
            */
            $table->decimal('physical_quantity', 15, 3)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Difference
            |--------------------------------------------------------------------------
            */
            $table->decimal('difference_quantity', 15, 3)
                ->default(0);

            $table->decimal('unit_cost', 15, 2)
                ->default(0);

            $table->decimal('difference_value', 15, 2)
                ->default(0);

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('stock_opname_id');
            $table->index('product_id');
            $table->index('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname_items');
    }
};
