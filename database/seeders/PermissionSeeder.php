<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['perm_name' => 'add_annc', 'category' => 'Announcements'],
            ['perm_name' => 'edit_annc', 'category' => 'Announcements'],
            ['perm_name' => 'del_annc', 'category' => 'Announcements'],
            ['perm_name' => 'view_annc', 'category' => 'Announcements'],
            ['perm_name' => 'add_res', 'category' => 'Residents'],
            ['perm_name' => 'edit_res', 'category' => 'Residents'],
            ['perm_name' => 'del_res', 'category' => 'Residents'],
            ['perm_name' => 'view_res', 'category' => 'Residents'],
            ['perm_name' => 'add_prof', 'category' => 'Profiles'],
            ['perm_name' => 'edit_prof', 'category' => 'Profiles'],
            ['perm_name' => 'del_prof', 'category' => 'Profiles'],
            ['perm_name' => 'view_prof', 'category' => 'Profiles'],
            ['perm_name' => 'add_acc', 'category' => 'Accounts'],
            ['perm_name' => 'edit_acc', 'category' => 'Accounts'],
            ['perm_name' => 'del_acc', 'category' => 'Accounts'],
            ['perm_name' => 'view_acc', 'category' => 'Accounts'],
            ['perm_name' => 'add_voter', 'category' => 'Voters'],
            ['perm_name' => 'edit_voter', 'category' => 'Voters'],
            ['perm_name' => 'del_voter', 'category' => 'Voters'],
            ['perm_name' => 'view_voter', 'category' => 'Voters'],
            ['perm_name' => 'add_prog', 'category' => 'Programs'],
            ['perm_name' => 'edit_prog', 'category' => 'Programs'],
            ['perm_name' => 'del_prog', 'category' => 'Programs'],
            ['perm_name' => 'view_prog', 'category' => 'Programs'],
            ['perm_name' => 'view_complaints', 'category' => 'Complaints'],
            ['perm_name' => 'resolve_complaints', 'category' => 'Complaints'],
            ['perm_name' => 'assign_complaints', 'category' => 'Complaints'],
            ['perm_name' => 'view_reports', 'category' => 'Reports'],
            ['perm_name' => 'view_accs', 'category' => 'Accounts'],
            ['perm_name' => 'manage_comm', 'category' => 'Community'],
            ['perm_name' => 'manage_brgy_info', 'category' => 'Barangay Info'],
            ['perm_name' => 'manage_roles', 'category' => 'Roles'],
            ['perm_name' => 'manage_logs', 'category' => 'Logs'],
            ['perm_name' => 'manage_feedbacks', 'category' => 'Feedbacks'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'perm_name' => $permission['perm_name'],
            ], [
                'category' => $permission['category'],
            ]);
        }
    }
}
// php artisan db:seed --class=PermissionSeeder