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
        Schema::create('product_units', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->foreignId('unit_id')
                ->constrained('units')
                ->restrictOnDelete();

            /**
             * Berapa satuan dasar yang terdapat
             * dalam 1 satuan ini.
             *
             * Contoh:
             *
             * Unit = Karung
             * conversion_factor = 25
             *
             * Artinya:
             * 1 Karung = 25 Kg
             */
            $table->decimal('conversion_factor', 15, 3)->default(1);

            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->decimal('selling_price', 15, 2)->nullable();

            $table->boolean('is_purchase_unit')->default(false);
            $table->boolean('is_sale_unit')->default(false);
            $table->boolean('is_default')->default(false);

            $table->timestamps();

            $table->unique(['product_id', 'unit_id']);

            $table->index('product_id');
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_units');
    }
};
