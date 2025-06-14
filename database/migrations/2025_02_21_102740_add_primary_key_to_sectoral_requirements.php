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
        Schema::table('sectoral_requirements', function (Blueprint $table) {
            $table->id()->first(); // Add 'id' column as primary key at the first position
        });
    }

    public function down(): void
    {
        Schema::table('sectoral_requirements', function (Blueprint $table) {
            $table->dropColumn('id'); // Rollback if necessary
        });
    }
};
