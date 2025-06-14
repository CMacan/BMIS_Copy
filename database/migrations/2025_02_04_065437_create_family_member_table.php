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
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->string('fmemb_relation');
            $table->boolean('fmemb_is_primary_contact')->default(false);
            $table->string('fmemb_working_status')->nullable();
            $table->foreignId('fam_id')->constrained('families')->onDelete('cascade');
            $table->foreignId('prof_id')->nullable()->constrained('profiles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
