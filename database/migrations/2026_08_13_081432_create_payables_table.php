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
        Schema::create('payables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('supplier_id')
                ->constrained('suppliers')
                ->restrictOnDelete();

            $table->foreignId('purchase_id')
                ->unique()
                ->constrained('purchases')
                ->restrictOnDelete();

            $table->string('invoice_number', 50);

            $table->date('transaction_date');

            $table->date('due_date');

            $table->decimal('original_amount', 15, 2)
                ->default(0);

            $table->decimal('paid_amount', 15, 2)
                ->default(0);

            $table->decimal('remaining_amount', 15, 2)
                ->default(0);

            $table->string('status', 30)
                ->default('unpaid');

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('supplier_id');
            $table->index('transaction_date');
            $table->index('due_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payables');
    }
};
