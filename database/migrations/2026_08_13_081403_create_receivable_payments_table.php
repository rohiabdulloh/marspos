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
        Schema::create('receivable_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('receivable_id')
                ->constrained('receivables')
                ->cascadeOnDelete();

            $table->foreignId('customer_id')
                ->constrained('customers')
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->decimal('amount', 15, 2)
                ->default(0);

            $table->string('payment_method', 30);

            $table->string('reference_number', 100)
                ->nullable();

            $table->dateTime('paid_at');

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('receivable_id');
            $table->index('customer_id');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receivable_payments');
    }
};
