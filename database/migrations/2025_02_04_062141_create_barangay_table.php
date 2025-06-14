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
        Schema::create('barangays', function (Blueprint $table) {
            $table->id();
            $table->string('bar_name')->default('Sawang Calero');
            $table->string('bar_city')->default('Cebu City');
            $table->string('bar_municipal')->nullable();
            $table->string('bar_prov')->default('Cebu');
            $table->string('bar_contact')->nullable();
            $table->string('bar_email')->nullable();
            $table->string('bar_fb_link')->nullable();
            $table->string('bar_off_stday')->nullable();
            $table->string('bar_off_endday')->nullable();
            $table->time('bar_off_sthour')->nullable();
            $table->time('bar_off_endhour')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
