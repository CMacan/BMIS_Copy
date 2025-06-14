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
        Schema::table('barangays', function (Blueprint $table) {
            // Rename columns
            $table->renameColumn('bar_city', 'bar_gmaplink');
            $table->renameColumn('bar_municipal', 'municipal_or_city');

            // Add new column for Facebook link
            $table->string('facebook')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangays', function (Blueprint $table) {
            // Rollback column renaming
            $table->renameColumn('bar_gmaplink', 'bar_city');
            $table->renameColumn('municipal_or_city', 'bar_municipal');

            // Drop the Facebook column
            $table->dropColumn('facebook');
        });
    }
};

