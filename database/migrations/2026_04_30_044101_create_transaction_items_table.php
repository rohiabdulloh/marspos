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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('transaction_id')
                ->constrained()
                ->cascadeOnDelete();
        
            // COA (Chart of Accounts)
            $table->foreignId('account_id')
                ->constrained('accounts')
                ->cascadeOnDelete();
        
            $table->string('description')->nullable();
        
            $table->decimal('debit', 18, 2)->default(0);
            $table->decimal('credit', 18, 2)->default(0);
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
