<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            // Add new columns
            $table->string('form_type')->after('profile_id'); // Stores the type of form submitted
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('form_type'); // Status of the submission
        });
    }

    public function down()
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            // Rollback: Remove the added columns
            $table->dropColumn(['form_type', 'status']);
        });
    }
};
