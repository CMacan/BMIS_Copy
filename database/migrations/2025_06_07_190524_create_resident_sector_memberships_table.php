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
        Schema::create('resident_sector_memberships', function (Blueprint $table) {
            $table->id();
            
            $table->boolean('mem_is_pwd')->default(false);
            $table->boolean('mem_is_lgbt')->default(false);
            $table->boolean('mem_is_solo_parent')->default(false);
            $table->boolean('mem_is_women')->default(false);
            $table->boolean('mem_is_erpa')->default(false);
            $table->boolean('mem_is_senior')->default(false);
            $table->boolean('mem_is_children')->default(false);

            $table->timestamp('verified_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable(); // optionally link this to users table if needed

            $table->unsignedBigInteger('sec_app_id');
            $table->unsignedBigInteger('prof_id');

            // Foreign keys
            $table->foreign('sec_app_id')->references('id')->on('temp_submissions')->onDelete('cascade');
            $table->foreign('prof_id')->references('id')->on('profiles')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident_sector_memberships');
    }
};
