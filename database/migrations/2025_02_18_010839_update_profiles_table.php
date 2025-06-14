<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Remove old columns
            $table->dropColumn(['prof_demog_type', 'applied_form']);

            // Add new boolean columns for demographic types
            $table->boolean('prof_is_lgbt')->default(false);
            $table->boolean('prof_is_women')->default(false);
            $table->boolean('prof_is_solo_parent')->default(false);
            $table->boolean('prof_is_senior')->default(false);
            $table->boolean('prof_is_pwd')->default(false);
            $table->boolean('prof_is_children')->default(false);
            $table->boolean('prof_is_erpa')->default(false);
        });
    }

    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Rollback: Re-add the dropped columns
            $table->string('prof_demog_type')->nullable();
            $table->string('applied_form')->nullable();

            // Remove the new boolean columns
            $table->dropColumn([
                'prof_is_lgbt', 'prof_is_women', 'prof_is_solo_parent',
                'prof_is_senior', 'prof_is_pwd', 'prof_is_children', 'prof_is_erpa'
            ]);
        });
    }
};
