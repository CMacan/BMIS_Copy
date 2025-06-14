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
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade'); // Registered User (Resident)
            $table->string('name')->nullable(); // Auto-fill if user is registered
            $table->string('address')->nullable(); // Auto-fill if user is registered
            $table->integer('age')->nullable(); // Auto-fill if user is registered
            $table->string('block')->nullable(); // Auto-fill if user is registered
            $table->string('civil_status')->nullable(); // New column
            $table->integer('copies')->default(1); // Default to 1 copy
            $table->string('purpose');
            $table->string('status')->default('pending'); // pending, approved, declined
            $table->string('document_type');
            $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('set null'); // Secretary who processed the request
            $table->string('requester_name')->nullable();
            $table->string('requester_email')->nullable();
            $table->string('requester_contact')->nullable();
            // Check if the column doesn't exist before adding it
            if (!Schema::hasColumn('document_requests', 'reference_id')) {
                $table->string('reference_id')->nullable()->after('requester_contact');
                $table->index('reference_id');
            }
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
