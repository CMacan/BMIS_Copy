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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'name'
            ]);
            $table->string('user_uname')->nullable()->after('id')->unique();
            $table->string('user_fname')->nullable()->after('user_uname');
            $table->string('user_lname')->nullable()->after('user_fname');
            // $table->renameColumn('email', 'user_email');
            // $table->renameColumn('password', 'user_password');
            $table->date('user_birthdate')->nullable();
            $table->enum('user_gender', ['male', 'female', 'other'])->nullable();
            $table->string('user_contact')->nullable();
            $table->string('user_status')->default('active');
            //$table->string('user_type')->default('user');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_uname', 'user_fname', 'user_lname', 'user_birthdate', 
                'user_gender', 'user_contact', 'user_status', 
                'role_id'
            ]);
            $table->string('name')->default('john doe')->after('id');
            // $table->renameColumn('user_email','email');
            // $table->renameColumn('user_password','password');
        });
    }
};
