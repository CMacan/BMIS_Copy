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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('prof_picture')->nullable();
            $table->string('prof_mname')->nullable();
            $table->string('prof_suffix')->nullable();
            $table->string('prof_religion')->nullable();
            $table->string('prof_cstatus')->nullable();
            $table->string('prof_educattain')->nullable();
            $table->string('prof_occupation')->nullable();
            $table->integer('prof_age')->nullable();
            $table->string('prof_restype')->nullable();
            $table->date('prof_start_date')->nullable();
            $table->boolean('prof_is_4ps')->default(false);
            $table->string('prof_res_type')->nullable();
            $table->string('prof_demog_type')->nullable();
            $table->foreignId('house_id')->nullable()->references('id')->on('households')->nullOnDelete();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');         
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
