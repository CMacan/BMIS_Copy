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
        //
        Schema::table('temp_submissions', function (Blueprint $table) {
            // Remove the FORM_TYPE column
            $table->dropColumn('form_type');

            // Add the form_id column as a foreign key referencing the FORMS table
            $table->unsignedBigInteger('form_id')->after('profile_id')->nullable();
            $table->foreign('form_id')->references('id')->on('sectoral_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('temp_submissions', function (Blueprint $table) {
            // Reverse the changes if the migration is rolled back
            $table->string('form_type')->nullable(); // Add the FORM_TYPE column back
            $table->dropForeign(['form_id']); // Drop the foreign key constraint
            $table->dropColumn('form_id'); // Drop the form_id column
        });
    }
};
