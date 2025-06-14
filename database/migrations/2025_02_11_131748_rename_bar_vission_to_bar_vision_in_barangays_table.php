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
            // Rename the column from bar_vission to bar_vision
            $table->renameColumn('bar_vission', 'bar_vision');
            $table->renameColumn('bar_off_stday', 'bar_stday');
            $table->renameColumn('bar_off_endday', 'bar_endday');
            $table->renameColumn('bar_off_sthour', 'bar_sthour');
            $table->renameColumn('bar_off_endhour', 'bar_endhour');
        });
        Schema::table('profiles', function (Blueprint $table) {
            // Rename the column from bar_vission to bar_vision
            $table->boolean('prof_is_house_head')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangays', function (Blueprint $table) {
            // Reverse the rename if needed
            $table->renameColumn('bar_vision', 'bar_vission');
            $table->renameColumn('bar_stday', 'bar_off_stday');
            $table->renameColumn('bar_endday', 'bar_off_endday');
            $table->renameColumn('bar_sthour', 'bar_off_sthour');
            $table->renameColumn('bar_endhour', 'bar_off_endhour');
        });
        Schema::table('profiles', function (Blueprint $table) {
            // Reverse the rename if needed
            $table->dropColumn('prof_is_house_head');
        });
    }
};
