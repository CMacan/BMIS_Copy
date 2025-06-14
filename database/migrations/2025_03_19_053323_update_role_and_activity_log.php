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
            $table->dropColumn('sign_up_contact');
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn('log_controller');
            $table->dropColumn('log_con_funct');
        });
        
        Schema::rename('role_user', 'role_users');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sign_up_requests', function (Blueprint $table) {
            $table->string('sign_up_contact')->nullable();
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('log_controller')->nullable();
            $table->string('log_con_funct')->nullable();
        });

        Schema::rename('role_users', 'role_user');
    }
};
