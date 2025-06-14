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
        Schema::table('voters', function (Blueprint $table) {
            $table->unsignedBigInteger('precinct_id')->nullable()->after('vote_lname'); // Add the column
            $table->foreign('precinct_id')
            ->references('id')
            ->on('precinct_numbers')
            ->onDelete('cascade'); // Foreign key
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            $table->dropForeign(['precinct_id']);
            $table->dropColumn('precinct_id');
        });
    }
};
