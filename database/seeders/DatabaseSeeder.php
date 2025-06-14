<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Role; // Import the Role model
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class, // Command: php artisan db:seed --class=SuperAdminSeeder
            // PermissionSeeder::class, // Command: php artisan db:seed --class=PermissionSeeder
            // RegularUserSeeder::class, // Command: php artisan db:seed --class=RegularUserSeeder
        ]);

        // forms and barangay seeders
        // $this->call(SectoralFormsSeeder::class);
        // $this->call(BarangaySeeder::class);

        //!!Dont Delete
        // User::factory(10)->create();


        // Uncomment this if you want to call other seeders
        // $this->call([
        //     VoterSeeder::class,
        // ]);
    }
}
