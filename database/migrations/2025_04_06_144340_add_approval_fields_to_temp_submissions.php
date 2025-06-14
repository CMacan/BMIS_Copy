<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            $table->foreignId('approved_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
                  
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('declined_at')->nullable();
            $table->foreignId('declined_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            // Check and drop foreign keys only if they exist
            if (Schema::hasColumn('temp_submissions', 'approved_by')) {
                $table->dropForeign(['approved_by']);
            }
            if (Schema::hasColumn('temp_submissions', 'declined_by')) {
                $table->dropForeign(['declined_by']);
            }

            // Drop the columns if they exist
            if (Schema::hasColumn('temp_submissions', 'approved_by')) {
                $table->dropColumn('approved_by');
            }
            if (Schema::hasColumn('temp_submissions', 'approved_at')) {
                $table->dropColumn('approved_at');
            }
            if (Schema::hasColumn('temp_submissions', 'declined_at')) {
                $table->dropColumn('declined_at');
            }
            if (Schema::hasColumn('temp_submissions', 'declined_by')) {
                $table->dropColumn('declined_by');
            }
        });
    }
};
