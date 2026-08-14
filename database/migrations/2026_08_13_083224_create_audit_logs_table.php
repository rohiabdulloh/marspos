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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Action
            |--------------------------------------------------------------------------
            |
            | created
            | updated
            | deleted
            | cancelled
            | restored
            | approved
            | completed
            |
            */
            $table->string('action', 30);

            /*
            |--------------------------------------------------------------------------
            | Target
            |--------------------------------------------------------------------------
            */
            $table->string('auditable_type', 100);

            $table->unsignedBigInteger('auditable_id');

            /*
            |--------------------------------------------------------------------------
            | Data Perubahan
            |--------------------------------------------------------------------------
            */
            $table->json('old_values')
                ->nullable();

            $table->json('new_values')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Request Information
            |--------------------------------------------------------------------------
            */
            $table->ipAddress('ip_address')
                ->nullable();

            $table->text('user_agent')
                ->nullable();

            $table->string('url')
                ->nullable();

            $table->timestamps();

            $table->index('user_id');

            $table->index([
                'auditable_type',
                'auditable_id',
            ]);

            $table->index('action');

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
