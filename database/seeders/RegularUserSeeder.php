<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RegularUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the regular user
        $regularUsers = [
            [
                'email' => 'rhaebanna@gmail.com',
                'password' => bcrypt('12345678'),
                'user_contact' => '09123456789',
                'profile' => [
                    'prof_fname' => 'Regular',
                    'prof_lname' => 'User',
                    'prof_birthdate' => Carbon::parse('1995-05-05')->toDateString(),
                ],
            ],
            // [
            //     'email' => 'regularuser2@gmail.com',
            //     'password' => bcrypt('regular123'),
            //     'user_contact' => '09123456788',
            //     'profile' => [
            //         'prof_fname' => 'Another',
            //         'prof_lname' => 'User',
            //         'prof_birthdate' => Carbon::parse('1996-06-06')->toDateString(),
            //     ],
            // ],
        ];

        // Create each regular user
        foreach ($regularUsers as $userData) {
            // Create the profile
            $profile = Profile::create($userData['profile']);

            // Create the user without assigning a role
            User::create([
                'email' => $userData['email'],
                'password' => $userData['password'],
                'user_contact' => $userData['user_contact'],
                'prof_id' => $profile->id,
                'role_id' => null, // No role assigned
            ]);
        }
    }
}
