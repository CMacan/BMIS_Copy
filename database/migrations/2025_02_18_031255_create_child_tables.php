<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildTables extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create 'childrens' table
        Schema::create('childrens', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->string('child_parent')->nullable();
            $table->timestamps();
        });

        // Create 'womens' table
        Schema::create('womens', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->boolean('women_is_breadwinner')->default(false);
            $table->timestamps();
        });

        // Create 'pwds' table
        Schema::create('pwds', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->string('pwd_disability')->nullable();
            $table->string('pwd_fb_acc')->nullable();
            $table->timestamps();
        });

        // Create 'lgbts' table
        Schema::create('lgbts', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->string('lgbt_gender_identity')->nullable();
            $table->string('lgbt_sexual_orient')->nullable();
            $table->timestamps();
        });

        // Create 'erpas' table
        Schema::create('erpas', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->text('erpa_tal')->nullable();
            $table->text('erpa_hobb')->nullable();
            $table->text('erpa_other_skill')->nullable();
            $table->text('erpa_school')->nullable();
            $table->text('erpa_civic')->nullable();
            $table->text('erpa_community')->nullable();
            $table->text('erpa_workplace')->nullable();
            $table->text('erpa_seminar_title')->nullable();
            $table->date('erpa_seminar_date')->nullable();
            $table->text('erpa_seminar_organizer')->nullable();
            $table->timestamps();
        });

        // Create 'solo_parents' table
        Schema::create('solo_parents', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->decimal('solo_mon_income', 10, 2)->nullable();
            $table->decimal('solo_tot_mon_inc', 10, 2)->nullable();
            $table->text('solo_classi')->nullable();
            $table->text('solo_prob')->nullable();
            $table->text('solo_resource')->nullable();
            $table->text('solo_parent_circumstance')->nullable();
            $table->text('solo_parent_needs')->nullable();
            $table->text('solo_parent_fam_rscrs')->nullable();
            $table->timestamps();
        });

        // Create 'seniors' table
        Schema::create('seniors', function (Blueprint $table) {
            $table->unsignedBigInteger('prof_id')->primary();
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->string('snr_ref_code', 50)->nullable();
            $table->string('snr_ethnic_origin', 50)->nullable();
            $table->string('snr_dialect', 50)->nullable();
            $table->string('snr_osca_id_num', 50)->nullable();
            $table->string('snr_gsis_sss', 50)->nullable();
            $table->string('snr_tin', 50)->nullable();
            $table->string('snr_philhealth', 50)->nullable();
            $table->string('snr_sc_association_id_num', 50)->nullable();
            $table->string('snr_other_govt_id', 50)->nullable();
            $table->boolean('snr_capability_to_travel')->default(false);
            $table->boolean('snr_svc_biz_emp')->default(false);
            $table->decimal('snr_cur_pension', 10, 2)->nullable();
            $table->text('snr_area_of_specialization')->nullable();
            $table->text('snr_share_skill')->nullable();
            $table->boolean('snr_comm_serv_involve')->default(false);
            $table->text('snr_residing_with')->nullable();
            $table->text('snr_src_of_inc')->nullable();
            $table->text('snr_immovable_asset')->nullable();
            $table->text('snr_movable_asset')->nullable();
            $table->decimal('snr_monthly_inc', 10, 2)->nullable();
            $table->text('snr_problem_need')->nullable();
            $table->text('snr_medic_concern')->nullable();
            $table->text('snr_dental_concern')->nullable();
            $table->text('snr_optical')->nullable();
            $table->text('snr_hearing')->nullable();
            $table->text('snr_social_emotional')->nullable();
            $table->text('snr_medic_maintenance')->nullable();
            $table->text('snr_diff')->nullable();
            $table->boolean('snr_has_medical_checkup')->default(false);
            $table->date('snr_medical_checkup_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('childrens');
        Schema::dropIfExists('womens');
        Schema::dropIfExists('pwds');
        Schema::dropIfExists('lgbts');
        Schema::dropIfExists('erpas');
        Schema::dropIfExists('solo_parents');
        Schema::dropIfExists('seniors');
    }
}
