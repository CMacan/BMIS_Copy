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
            CREATE TABLE pwds (
                pwd_disability TEXT,
                pwd_fb_acc VARCHAR(255),
                CHECK (prof_demog_type = 'pwd')
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
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'pwds') THEN
                    DROP TABLE pwds CASCADE;
                END IF;
            END $$;
        ");
    }
};
