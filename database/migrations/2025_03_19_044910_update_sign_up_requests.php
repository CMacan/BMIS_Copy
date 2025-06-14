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
        Schema::table('sign_up_requests', function (Blueprint $table) {
            $table->string('sign_up_gender', 10)->after('sign_up_contact')->nullable();
            $table->string('sign_up_cstatus', 10)->after('sign_up_gender')->nullable();
            $table->boolean('sign_up_is_voter')->default(false)->after('sign_up_cstatus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sign_up_requests', function (Blueprint $table) {
            $table->dropColumn('sign_up_gender');
            $table->dropColumn('sign_up_cstatus');
            $table->dropColumn('sign_up_is_voter');
        });
    }
};
