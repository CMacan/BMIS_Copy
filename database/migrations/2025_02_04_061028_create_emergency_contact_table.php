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
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('emerg_fname');
            $table->string('emerg_lname');
            $table->string('emerg_relation');
            $table->string('emerg_contact');
            $table->string('emerg_cstatus')->nullable();
            $table->string('emerg_educattain')->nullable();
            $table->string('emerg_occupation')->nullable();
            $table->string('emerg_restype')->nullable();
            $table->foreignId('prof_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};
