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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();

            $table->string('code', 50)
                ->unique();

            $table->string('name');

            /*
            |--------------------------------------------------------------------------
            | Jenis Diskon
            |--------------------------------------------------------------------------
            |
            | percentage
            | fixed
            |
            */
            $table->string('type', 20)
                ->default('percentage');

            $table->decimal('value', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Batas Diskon
            |--------------------------------------------------------------------------
            */
            $table->decimal('max_discount_amount', 15, 2)
                ->nullable();

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
            | Penggunaan
            |--------------------------------------------------------------------------
            |
            | product
            | category
            | transaction
            |
            */
            $table->string('scope', 30)
                ->default('transaction');

            $table->boolean('is_active')
                ->default(true);

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index('type');
            $table->index('scope');
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
        Schema::dropIfExists('discounts');
    }
};
