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
        // Drop old child tables
        DB::statement("DROP TABLE IF EXISTS childrens CASCADE;");
        DB::statement("DROP TABLE IF EXISTS erpas CASCADE;");
        DB::statement("DROP TABLE IF EXISTS lgbts CASCADE;");
        DB::statement("DROP TABLE IF EXISTS pwds CASCADE;");
        DB::statement("DROP TABLE IF EXISTS seniors CASCADE;");
        DB::statement("DROP TABLE IF EXISTS solo_parents CASCADE;");
        DB::statement("DROP TABLE IF EXISTS womens CASCADE;");
    }

    public function down(): void
    {
        // No rollback, because we are restructuring the schema
    }
};
