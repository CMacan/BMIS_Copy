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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('addr_city')->nullable();
            $table->string('addr_barangay')->nullable();
            $table->string('addr_region')->nullable();
            $table->string('addr_block')->nullable();
            $table->string('addr_sitio')->nullable();
            $table->string('addr_street')->nullable();
            $table->string('addr_houseno')->nullable();
            $table->string('addr_province')->nullable();
            $table->string('addr_type')->nullable();
            $table->foreignId('house_id')->nullable()->constrained('households')->nullOnDelete();
            $table->foreignId('emerg_id')->nullable()->constrained('emergency_contacts')->nullOnDelete();
            $table->foreignId('prof_id')->nullable()->constrained('profiles')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
