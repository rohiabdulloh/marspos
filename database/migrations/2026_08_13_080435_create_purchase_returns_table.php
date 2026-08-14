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
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();

            $table->string('return_number', 50)
                ->unique();

            $table->dateTime('return_date');

            $table->foreignId('purchase_id')
                ->constrained('purchases')
                ->restrictOnDelete();

            $table->foreignId('store_id')
                ->constrained('stores')
                ->restrictOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->restrictOnDelete();

            $table->foreignId('supplier_id')
                ->constrained('suppliers')
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('status', 30)
                ->default('completed');

            $table->decimal('subtotal', 15, 2)
                ->default(0);

            $table->decimal('discount_amount', 15, 2)
                ->default(0);

            $table->decimal('tax_amount', 15, 2)
                ->default(0);

            $table->decimal('total', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Settlement
            |--------------------------------------------------------------------------
            |
            | credit_note
            | cash
            | transfer
            | offset_payable
            |
            */
            $table->string('settlement_method', 30)
                ->nullable();

            $table->decimal('settlement_amount', 15, 2)
                ->default(0);

            $table->text('reason')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('return_date');
            $table->index('purchase_id');
            $table->index('supplier_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_returns');
    }
};
