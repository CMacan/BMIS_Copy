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
        Schema::create('sign_up_requests', function (Blueprint $table) {
            $table->id();
            $table->string('sign_up_fname')->nullable();
            $table->string('sign_up_lname')->nullable();
            $table->date('sign_up_birthdate')->nullable();
            $table->string('sign_up_contact')->nullable();
            $table->string('sign_up_email')->nullable()->unique();
            $table->string('sign_up_password')->nullable();
            $table->timestamps();
        });
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('vote_fname')->nullable();
            $table->string('vote_lname')->nullable();
            $table->date('vote_birthdate')->nullable();
            $table->date('vote_res_date')->nullable();
            $table->unsignedBigInteger('bar_id')->nullable();
            $table->foreign('bar_id')->references('id')->on('barangays')->nullOnDelete();
            $table->timestamps();
        });
        Schema::table('attachments', function (Blueprint $table) {
            $table->unsignedBigInteger('sign_up_id')->nullable();
            $table->foreign('sign_up_id')->references('id')->on('sign_up_requests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropForeign(['sign_up_id']);
            $table->dropColumn('sign_up_id');
        });
        Schema::dropIfExists('sign_up_requests');
        Schema::dropIfExists('voters');
    }
};
