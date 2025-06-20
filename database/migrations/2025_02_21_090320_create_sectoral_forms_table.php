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
        Schema::create('sectoral_forms', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name'); // Name of the form
            $table->text('description')->nullable(); // Description of the form
            $table->string('category')->nullable(); // Category of the form
            $table->text('addtl_detail')->nullable(); // Additional details
            $table->string('image')->nullable(); // Image URL or path
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sectoral_forms');
    }
};
