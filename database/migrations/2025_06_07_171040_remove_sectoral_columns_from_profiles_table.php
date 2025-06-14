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
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'prof_is_lgbt',
                'prof_is_women',
                'prof_is_solo_parent',
                'prof_is_senior',
                'prof_is_pwd',
                'prof_is_children',
                'prof_is_erpa',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->boolean('prof_is_lgbt')->nullable();
            $table->boolean('prof_is_women')->nullable();
            $table->boolean('prof_is_solo_parent')->nullable();
            $table->boolean('prof_is_senior')->nullable();
            $table->boolean('prof_is_pwd')->nullable();
            $table->boolean('prof_is_children')->nullable();
            $table->boolean('prof_is_erpa')->nullable();
        });
    }
};
