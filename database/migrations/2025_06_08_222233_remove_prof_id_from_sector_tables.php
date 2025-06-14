<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        $tables = ['seniors', 'lgbts', 'erpas', 'childrens', 'womens', 'solo_parents', 'pwds'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['prof_id']); // if foreign key exists
                $table->dropColumn('prof_id');
            });
        }
    }

    public function down()
    {
        $tables = ['seniors', 'lgbtqs', 'erpas', 'childrens', 'womens', 'solo_parents', 'pwds'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedBigInteger('prof_id')->nullable();
                $table->foreign('prof_id')
                      ->references('id')
                      ->on('profiles')
                      ->onDelete('cascade');
            });
        }
    }
};
