<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barangay_officials', function (Blueprint $table) {
            $table->id();
            $table->string('bar_off_position');
            $table->text('bar_off_term_st')->nullable(); 
            $table->text('bar_off_term_end')->nullable(); 
            $table->text('bar_off_status')->nullable();
            $table->foreignId('bar_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('profiles')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::table('attachments', function (Blueprint $table) {
            $table->foreignId('prof_id')->nullable()->constrained('profiles')->onDelete('cascade');
        });
        Schema::table('barangays', function (Blueprint $table) {
            $table->string('bar_picture')->nullable()->after('bar_email');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->boolean('prof_is_verified')->default(false);
            $table->boolean('prof_is_demog_verified')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_officials');
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropForeign(['prof_id']);
            $table->dropColumn('prof_id');
        });
        Schema::table('barangays', function (Blueprint $table) {
            $table->dropColumn('bar_picture');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('prof_is_verified');
            $table->dropColumn('prof_is_demog_verified');
        });
    }
};
