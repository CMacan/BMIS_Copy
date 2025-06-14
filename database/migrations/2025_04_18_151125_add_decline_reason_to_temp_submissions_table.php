<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            $table->text('decline_reason')
                  ->nullable()
                  ->after('status')
                  ->comment('Detailed reason for submission decline');
            
            // Optional: Add index if you'll be searching/filtering by this
            // $table->index(['status']);
        });
    }

    public function down()
    {
        Schema::table('temp_submissions', function (Blueprint $table) {
            $table->dropColumn('decline_reason');
        });
    }
};
