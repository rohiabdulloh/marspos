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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Produk & Lokasi
            |--------------------------------------------------------------------------
            */
            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
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
            | Tipe Mutasi
            |--------------------------------------------------------------------------
            |
            | purchase
            | sale
            | sale_return
            | purchase_return
            | adjustment
            | opname
            | transfer_in
            | transfer_out
            |
            */
            $table->string('movement_type', 30);

            /*
            |--------------------------------------------------------------------------
            | Referensi
            |--------------------------------------------------------------------------
            |
            | Menyimpan ID transaksi sumber.
            |
            */
            $table->string('reference_type', 50)
                ->nullable();

            $table->unsignedBigInteger('reference_id')
                ->nullable();

            $table->string('reference_number', 100)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Quantity
            |--------------------------------------------------------------------------
            |
            | quantity:
            | jumlah sesuai unit transaksi
            |
            | base_quantity:
            | jumlah dalam unit dasar
            |
            */
            $table->decimal('quantity', 15, 3)
                ->default(0);

            $table->decimal('base_quantity', 15, 3)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Saldo Stok
            |--------------------------------------------------------------------------
            |
            | before_quantity:
            | saldo sebelum mutasi
            |
            | after_quantity:
            | saldo setelah mutasi
            |
            */
            $table->decimal('before_quantity', 15, 3)
                ->default(0);

            $table->decimal('after_quantity', 15, 3)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Cost
            |--------------------------------------------------------------------------
            */
            $table->decimal('unit_cost', 15, 2)
                ->default(0);

            $table->decimal('total_cost', 15, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | User & Waktu
            |--------------------------------------------------------------------------
            */
            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->dateTime('movement_date');

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Index
            |--------------------------------------------------------------------------
            */
            $table->index([
                'product_id',
                'warehouse_id',
            ]);

            $table->index('movement_type');

            $table->index([
                'reference_type',
                'reference_id',
            ]);

            $table->index('movement_date');

            $table->index('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
