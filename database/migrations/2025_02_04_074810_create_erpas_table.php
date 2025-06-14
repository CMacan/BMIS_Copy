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
            CREATE TABLE erpas (
                erpa_tal TEXT,
                erpa_hobb TEXT,
                erpa_other_skill TEXT,
                erpa_school TEXT,
                erpa_civic TEXT,
                erpa_community TEXT,
                erpa_workplace TEXT,
                erpa_seminar_title TEXT,
                erpa_seminar_date DATE,
                erpa_seminar_organizer TEXT,
                CHECK (prof_demog_type = 'erpa')
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
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'erpas') THEN
                    DROP TABLE erpas CASCADE;
                END IF;
            END $$;
        ");
    }
};
