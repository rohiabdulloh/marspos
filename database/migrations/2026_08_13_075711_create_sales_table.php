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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Identitas Transaksi
            |--------------------------------------------------------------------------
            */
            $table->string('invoice_number', 50)->unique();

            $table->dateTime('transaction_date');

            /*
            |--------------------------------------------------------------------------
            | Relasi
            |--------------------------------------------------------------------------
            */
            $table->foreignId('store_id')
                ->constrained('stores')
                ->restrictOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->restrictOnDelete();

            $table->foreignId('customer_id')
                ->nullable()
                ->constrained('customers')
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Jenis Transaksi
            |--------------------------------------------------------------------------
            |
            | retail   = penjualan biasa
            | wholesale = grosir
            | credit   = penjualan kredit
            |
            */
            $table->string('sale_type', 30)
                ->default('retail');

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            |
            | draft
            | completed
            | partially_paid
            | unpaid
            | cancelled
            |
            */
            $table->string('status', 30)
                ->default('completed');

            /*
            |--------------------------------------------------------------------------
            | Perhitungan
            |--------------------------------------------------------------------------
            */
            $table->decimal('subtotal', 15, 2)
                ->default(0);

            $table->decimal('discount_amount', 15, 2)
                ->default(0);

            $table->decimal('tax_amount', 15, 2)
                ->default(0);

            $table->decimal('shipping_cost', 15, 2)
                ->default(0);

            $table->decimal('rounding_amount', 15, 2)
                ->default(0);

            $table->decimal('grand_total', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Pembayaran
            |--------------------------------------------------------------------------
            */
            $table->decimal('paid_amount', 15, 2)
                ->default(0);

            $table->decimal('change_amount', 15, 2)
                ->default(0);

            $table->decimal('due_amount', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Informasi Tambahan
            |--------------------------------------------------------------------------
            */
            $table->string('reference_number', 100)
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->text('cancellation_reason')
                ->nullable();

            $table->dateTime('cancelled_at')
                ->nullable();

            $table->foreignId('cancelled_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Index
            |--------------------------------------------------------------------------
            */
            $table->index('transaction_date');
            $table->index('store_id');
            $table->index('warehouse_id');
            $table->index('customer_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('sale_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
