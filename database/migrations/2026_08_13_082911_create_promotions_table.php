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

            $table->string('code', 50)
                ->unique();

            $table->string('name');

            /*
            |--------------------------------------------------------------------------
            | Tipe Promo
            |--------------------------------------------------------------------------
            |
            | buy_x_get_y
            | percentage
            | fixed
            | minimum_purchase
            |
            */
            $table->string('type', 30);

            /*
            |--------------------------------------------------------------------------
            | Buy X Get Y
            |--------------------------------------------------------------------------
            */
            $table->decimal('buy_quantity', 15, 3)
                ->nullable();

            $table->decimal('get_quantity', 15, 3)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Discount
            |--------------------------------------------------------------------------
            */
            $table->decimal('discount_value', 15, 2)
                ->nullable();

            $table->string('discount_type', 20)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Minimum Pembelian
            |--------------------------------------------------------------------------
            */
            $table->decimal('minimum_purchase', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Periode
            |--------------------------------------------------------------------------
            */
            $table->dateTime('start_at')
                ->nullable();

            $table->dateTime('end_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Limit
            |--------------------------------------------------------------------------
            */
            $table->unsignedInteger('usage_limit')
                ->nullable();

            $table->unsignedInteger('usage_count')
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */
            $table->boolean('is_active')
                ->default(true);

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index('type');
            $table->index('is_active');
            $table->index([
                'start_at',
                'end_at',
            ]);
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
