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
        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cash_account_id')
                ->constrained('cash_accounts')
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Transaction
            |--------------------------------------------------------------------------
            |
            | income
            | expense
            |
            */
            $table->string('transaction_type', 30);

            $table->dateTime('transaction_date');

            $table->string('reference_type', 50)
                ->nullable();

            $table->unsignedBigInteger('reference_id')
                ->nullable();

            $table->string('reference_number', 100)
                ->nullable();

            $table->decimal('amount', 15, 2)
                ->default(0);

            $table->decimal('balance_before', 15, 2)
                ->default(0);

            $table->decimal('balance_after', 15, 2)
                ->default(0);

            $table->string('category', 50)
                ->nullable();

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index('cash_account_id');
            $table->index('transaction_type');
            $table->index('transaction_date');

            $table->index([
                'reference_type',
                'reference_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};
