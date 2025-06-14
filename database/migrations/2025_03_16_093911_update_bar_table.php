<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('barangays', function (Blueprint $table) {
            $table->string('bar_location', 250)->after('bar_name')->nullable();
            $table->string('bar_gmaplink', 500)->change();
            $table->string('bar_fb_link', 500)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangays', function (Blueprint $table) {
            // Drop the 'bar_location' column
            $table->dropColumn('bar_location');

            // Change 'bar_gmaplink' back to 255 characters
            DB::statement('UPDATE barangays SET bar_gmaplink = LEFT(bar_gmaplink, 255) WHERE LENGTH(bar_gmaplink) > 255');
            $table->string('bar_gmaplink', 255)->nullable()->change();

            // Change 'bar_fb_link' back to 255 characters
            DB::statement('UPDATE barangays SET bar_fb_link = LEFT(bar_fb_link, 255) WHERE LENGTH(bar_fb_link) > 255');
            $table->string('bar_fb_link', 255)->nullable()->change();
        });
    }
};
