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
        Schema::dropIfExists('family_members');
        Schema::dropIfExists('families');
        Schema::create('household_members', function (Blueprint $table) {
            $table->id();
            $table->string('hmemb_relation');
            $table->boolean('hmemb_is_primary_contact')->default(false);
            $table->string('hmemb_working_status')->nullable();
            $table->boolean('hmemb_is_dependent')->default(false);
            $table->boolean('hmemb_is_guardian')->default(false);
            $table->foreignId('house_id')->constrained('households')->onDelete('cascade');
            $table->foreignId('prof_id')->nullable()->constrained('profiles')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::table('notifications',function (Blueprint $table){
            $table->string('notif_title')->nullable()->after('id');
            $table->date('notif_date_read')->nullable()->after('notif_title');
            $table->date('notif_category')->nullable()->after('notif_date_read');
            $table->renameColumn('message','notif_message');
            $table->renameColumn('status','notif_status');
        });
        Schema::table('activity_logs',function (Blueprint $table){
            $table->string('log_controller')->nullable()->after('log_tableid');
            $table->string('log_con_funct')->nullable()->after('log_controller');
        });
        // Modify the roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->renameColumn('name','role_name');
        });
        
        // Modify the roles table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->String('perm_name');
            $table->timestamps();
        });
        
        // Modify the roles table
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permissions'); // Drop role_permissions table first
        Schema::dropIfExists('permissions'); // Then drop permissions table
        Schema::create('families', function (Blueprint $table) {
            $table->id();
            $table->string('fam_name');
            $table->decimal('fam_income', 20, 2)->default(0);
            $table->foreignId('house_id')->constrained('households')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->string('fmemb_relation');
            $table->boolean('fmemb_is_primary_contact')->default(false);
            $table->string('fmemb_working_status')->nullable();
            $table->foreignId('fam_id')->constrained('families')->onDelete('cascade');
            $table->foreignId('prof_id')->nullable()->constrained('profiles')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::dropIfExists('household_members');
        Schema::table('notifications',function (Blueprint $table){
            $table->dropColumn('notif_title');
            $table->dropColumn('notif_date_read');
            $table->dropColumn('notif_category');
            $table->renameColumn('notif_message','message');
            $table->renameColumn('notif_status','status');
        });
        Schema::table('activity_logs',function (Blueprint $table){
            $table->dropColumn('log_controller');
            $table->dropColumn('log_con_funct');
        });
        Schema::table('roles', function (Blueprint $table) {
            $table->renameColumn('role_name','name');
        });
    }
};

// $table->boolean('role_add_annc')->default(false);
// $table->boolean('role_edit_annc')->default(false);
// $table->boolean('role_del_annc')->default(false);
// $table->boolean('role_view_annc')->default(false);
// $table->boolean('role_add_res')->default(false);
// $table->boolean('role_edit_res')->default(false);
// $table->boolean('role_del_res')->default(false);
// $table->boolean('role_view_res')->default(true);
// $table->boolean('role_add_prog')->default(false);
// $table->boolean('role_edit_prog')->default(false);
// $table->boolean('role_del_prog')->default(false);
// $table->boolean('role_view_prog')->default(false);
// $table->boolean('role_view_complaints')->default(false);
// $table->boolean('role_resolve_complaints')->default(false);
// $table->boolean('role_assign_complaints')->default(false);
// $table->boolean('role_view_reports')->default(false);
// $table->boolean('role_view_accs')->default(false);
// $table->boolean('role_manage_comm')->default(false);
// $table->boolean('role_manage_brgy_info')->default(false);
// $table->boolean('role_manage_roles')->default(false);
// $table->boolean('role_manage_logs')->default(false);
// $table->boolean('role_manage_feedbacks')->default(false);

// $table->dropColumn('role_add_annc');
// $table->dropColumn('role_edit_annc');
// $table->dropColumn('role_del_annc');
// $table->dropColumn('role_view_annc');
// $table->dropColumn('role_add_res');
// $table->dropColumn('role_edit_res');
// $table->dropColumn('role_del_res');
// $table->dropColumn('role_view_res');
// $table->dropColumn('role_add_prog');
// $table->dropColumn('role_edit_prog');
// $table->dropColumn('role_del_prog');
// $table->dropColumn('role_view_prog');
// $table->dropColumn('role_view_complaints');
// $table->dropColumn('role_resolve_complaints');
// $table->dropColumn('role_assign_complaints');
// $table->dropColumn('role_view_reports');
// $table->dropColumn('role_view_accs');
// $table->dropColumn('role_manage_comm');
// $table->dropColumn('role_manage_brgy_info');
// $table->dropColumn('role_manage_roles');
// $table->dropColumn('role_manage_logs');
// $table->dropColumn('role_manage_feedbacks');