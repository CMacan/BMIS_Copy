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
        Schema::table('household_join_requests', function (Blueprint $table) {
            $table->renameColumn('status','house_j_status');
        });
        Schema::table('attachments', function (Blueprint $table) {
            $table->string('attach_src')->nullable()->after('attach_type');
            $table->string('attach_name')->nullable()->after('attach_src');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('household_join_requests', function (Blueprint $table) {
            $table->renameColumn('house_j_status','status');
        });
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn('attach_src');
            $table->dropColumn('attach_name');
        });
    }
};
