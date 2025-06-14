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
        Schema::table('sign_up_requests', function (Blueprint $table) {
            $table->string('sign_up_city')->nullable();
            $table->string('sign_up_barangay')->nullable();
            $table->string('sign_up_region')->nullable();
            $table->string('sign_up_block')->nullable();
            $table->string('sign_up_sitio')->nullable();
            $table->string('sign_up_street')->nullable();
            $table->string('sign_up_houseno')->nullable();
            $table->string('sign_up_province')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sign_up_requests', function (Blueprint $table) {
            $table->dropColumn([
                'sign_up_city',
                'sign_up_barangay',
                'sign_up_region',
                'sign_up_block',
                'sign_up_sitio',
                'sign_up_street',
                'sign_up_houseno',
                'sign_up_province',
            ]);
        });
    }
};
