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
        DB::statement("
            CREATE TABLE womens (
                women_is_breadwinner BOOLEAN DEFAULT FALSE
                CHECK (prof_demog_type = 'women')
            ) INHERITS (profiles);
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            DO $$ 
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'womens') THEN
                    DROP TABLE womens CASCADE;
                END IF;
            END $$;
        ");
    }
};
