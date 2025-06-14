<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
       public function up()
    {
        $tables = ['seniors', 'lgbts', 'erpas', 'childrens', 'womens', 'solo_parents', 'pwds'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedBigInteger('sec_mem_id')->nullable()->after('prof_id');
                
                // Add foreign key constraint
                $table->foreign('sec_mem_id')
                      ->references('id')
                      ->on('resident_sector_memberships')
                      ->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        $tables = ['seniors', 'lgbtqs', 'erpas', 'childrens', 'womens', 'solo_parents', 'pwds'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['sec_mem_id']);
                $table->dropColumn('sec_mem_id');
            });
        }
    }
};
