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
        Schema::table('households', function (Blueprint $table) {
            $table->string('house_type')->nullable();
            $table->string('house_ownership')->nullable();
            $table->integer('house_year')->nullable();
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('prof_restype');
            $table->string('prof_fname')->nullable()->after('prof_picture');
            $table->string('prof_lname')->nullable()->after('prof_fname');
            $table->string('prof_sex')->nullable()->after('prof_mname');
            $table->date('prof_birthdate')->nullable();
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('user_fname');
            $table->dropColumn('user_lname');
            $table->dropColumn('user_gender');
            $table->dropColumn('user_birthdate');
            $table->foreignId('prof_id')->nullable()->references('id')->on('profiles')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('households', function (Blueprint $table) {
            $table->dropColumn('house_type');
            $table->dropColumn('house_ownership');
            $table->dropColumn('house_year');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('prof_restype')->nullable();
            $table->dropColumn('prof_fname');
            $table->dropColumn('prof_lname');
            $table->dropColumn('prof_sex');
            $table->dropColumn('prof_birthdate');
            $table->foreignId('user_id')->nullable()->references('id')->on('users')->nullOnDelete();     
        });
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_fname')->nullable()->after('user_uname');
            $table->string('user_lname')->nullable()->after('user_fname');
            $table->enum('user_gender', ['male', 'female', 'other'])->nullable();
            $table->date('user_birthdate')->nullable();
            $table->dropForeign(['prof_id']);
            $table->dropColumn('prof_id');
        });
    }
};
