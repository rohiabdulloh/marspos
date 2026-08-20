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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
        
            $table->string('code', 50)->unique();
            $table->string('name');
        
            /*
            |--------------------------------------------------------------------------
            | Tipe Promo
            |--------------------------------------------------------------------------
            | buy_x_get_y, percentage, fixed, minimum_purchase
            */
            $table->string('type', 30);
        
            /*
            |--------------------------------------------------------------------------
            | Buy X Get Y Rule
            |--------------------------------------------------------------------------
            */
            $table->decimal('buy_quantity', 15, 3)->nullable();
            $table->decimal('get_quantity', 15, 3)->nullable();
        
            /*
            |--------------------------------------------------------------------------
            | Discount Value Rule
            |--------------------------------------------------------------------------
            */
            $table->decimal('discount_value', 15, 2)->nullable();
            $table->string('discount_type', 20)->nullable(); // percentage / fixed
        
            /*
            |--------------------------------------------------------------------------
            | Minimum Pembelian & Batas Diskon
            |--------------------------------------------------------------------------
            */
            $table->decimal('minimum_purchase', 15, 2)->default(0);
            $table->decimal('max_discount_amount', 15, 2)->nullable(); // Opsional: batas maksimal potongan
        
            /*
            |--------------------------------------------------------------------------
            | Periode & Prioritas
            |--------------------------------------------------------------------------
            */
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->integer('priority')->default(0); // Menentukan promo mana yang dieksekusi duluan jika ada bentrok
        
            /*
            |--------------------------------------------------------------------------
            | Limit & Status
            |--------------------------------------------------------------------------
            */
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('usage_count')->default(0);
            $table->boolean('is_active')->default(true);
        
            $table->text('description')->nullable();
            $table->softDeletes();
        
            $table->timestamps();
        
            // Indexes untuk performa pencarian saat kasir bertransaksi
            $table->index('type');
            $table->index('is_active');
            $table->index(['start_at', 'end_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
