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
        Schema::create('document_sequences', function (Blueprint $table) {
            $table->id();

            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Document Type
            |--------------------------------------------------------------------------
            |
            | sale
            | purchase
            | sale_return
            | purchase_return
            | stock_opname
            | stock_transfer
            | expense
            |
            */
            $table->string('document_type', 50);

            $table->string('prefix', 30);

            $table->string('period', 20);

            $table->unsignedBigInteger('last_number')
                ->default(0);

            $table->unsignedInteger('padding')
                ->default(5);

            $table->timestamps();

            $table->unique([
                'store_id',
                'document_type',
                'period',
            ]);

            $table->index('document_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_squences');
    }
};
