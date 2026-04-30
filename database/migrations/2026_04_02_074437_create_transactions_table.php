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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
        
            // jenis transaksi
            $table->string('type'); 
            // sales, purchase, expense, payment, journal
        
            $table->date('date');
        
            $table->string('reference')->nullable();
        
            // relasi bisnis
            $table->foreignId('customer_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
        
            $table->foreignId('supplier_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
        
            $table->text('description')->nullable();
        
            $table->decimal('total_debit', 18, 2)->default(0);
            $table->decimal('total_credit', 18, 2)->default(0);
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
