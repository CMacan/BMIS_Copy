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
             // Adding new columns
             $table->string('bar_motto')->nullable()->after('bar_email');
             $table->string('bar_systname')->nullable()->after('bar_motto');
             $table->text('bar_vission')->nullable()->after('bar_systname');
             $table->text('bar_mission')->nullable()->after('bar_vission');
             $table->text('bar_value')->nullable()->after('bar_mission');
 
             // Renaming an existing column
             $table->renameColumn('bar_picture', 'bar_logo');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangays', function (Blueprint $table) {
            // Dropping the newly added columns
            $table->dropColumn(['bar_motto', 'bar_systname', 'bar_vission', 'bar_mission', 'bar_value']);

            // Renaming column back to its original name
            $table->renameColumn('bar_logo', 'bar_picture');
        });
    }
};
