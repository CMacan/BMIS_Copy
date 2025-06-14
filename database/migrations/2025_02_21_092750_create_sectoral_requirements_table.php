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
        Schema::create('sectoral_requirements', function (Blueprint $table) {
            $table->unsignedBigInteger('form_id'); // Foreign key to FORMS table
            $table->text('requirement'); // The requirement text
            $table->timestamps();

            // Define foreign key constraint
            $table->foreign('form_id')->references('id')->on('sectoral_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sectoral_requirements');
    }
};
