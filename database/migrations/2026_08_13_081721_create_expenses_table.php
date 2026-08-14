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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();

            $table->string('expense_number', 50)
                ->unique();

            $table->dateTime('expense_date');

            $table->foreignId('store_id')
                ->constrained('stores')
                ->restrictOnDelete();

            $table->foreignId('cash_account_id')
                ->constrained('cash_accounts')
                ->restrictOnDelete();

            $table->foreignId('expense_category_id')
                ->constrained('expense_categories')
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->decimal('amount', 15, 2)
                ->default(0);

            $table->string('reference_number', 100)
                ->nullable();

            $table->text('description')
                ->nullable();

            $table->string('attachment')
                ->nullable();

            $table->string('status', 30)
                ->default('completed');

            $table->timestamps();

            $table->index('expense_date');
            $table->index('store_id');
            $table->index('cash_account_id');
            $table->index('expense_category_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
