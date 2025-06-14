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
            CREATE TABLE solo_parents (
                solo_mon_income NUMERIC(10,2),
                solo_tot_mon_inc NUMERIC(10,2),
                solo_classi TEXT,
                solo_prob TEXT,
                solo_resource TEXT,
                solo_parent_circumstance TEXT,
                solo_parent_needs TEXT,
                solo_parent_fam_rscrs TEXT,
                CHECK (prof_demog_type = 'solo_parent')
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
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'solo_parents') THEN
                    DROP TABLE solo_parents CASCADE;
                END IF;
            END $$;
        ");
    }
};
