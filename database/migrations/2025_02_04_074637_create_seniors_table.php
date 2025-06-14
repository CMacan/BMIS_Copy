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
            CREATE TABLE seniors (
                snr_ref_code VARCHAR(50),
                snr_ethnic_origin VARCHAR(50),
                snr_dialect VARCHAR(50),
                snr_osca_id_num VARCHAR(50),
                snr_gsis_sss VARCHAR(50),
                snr_tin VARCHAR(50),
                snr_philhealth VARCHAR(50),
                snr_sc_association_id_num VARCHAR(50),
                snr_other_govt_id VARCHAR(50),
                snr_capability_to_travel BOOLEAN,
                snr_svc_biz_emp BOOLEAN,
                snr_cur_pension NUMERIC(10,2),
                snr_area_of_specialization TEXT,
                snr_share_skill TEXT,
                snr_comm_serv_involve BOOLEAN,
                snr_residing_with TEXT,
                snr_src_of_inc TEXT,
                snr_immovable_asset TEXT,
                snr_movable_asset TEXT,
                snr_monthly_inc NUMERIC(10,2),
                snr_problem_need TEXT,
                snr_medic_concern TEXT,
                snr_dental_concern TEXT,
                snr_optical TEXT,
                snr_hearing TEXT,
                snr_social_emotional TEXT,
                snr_medic_maintenance TEXT,
                snr_diff TEXT,
                snr_has_medical_checkup BOOLEAN,
                snr_medical_checkup_date DATE,
                CHECK (prof_demog_type = 'senior')
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
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'seniors') THEN
                    DROP TABLE seniors CASCADE;
                END IF;
            END $$;
        ");
    }
};
