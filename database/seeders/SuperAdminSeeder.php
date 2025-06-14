<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the superadmin role if it doesn't exist
        $superAdminRole = Role::firstOrCreate([
            'role_name' => 'superadmin',
        ], [
            'role_descr' => 'Has full access to all system features.',
        ]);

        // Define the superadmin users
        $superAdmins = [
            [
                'email' => 'breannaancheta03@gmail.com',
                'password' => bcrypt('brebre123'),
                'user_contact' => '09278331300',
                'profile' => [
                    'prof_fname' => 'Breanna',
                    'prof_lname' => 'Ancheta',
                    'prof_birthdate' => Carbon::parse('1990-01-01')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'cedrickmieragtong@gmail.com',
                'password' => bcrypt('cedrick123'),
                'user_contact' => '09234567890',
                'profile' => [
                    'prof_fname' => 'Cedrick',
                    'prof_lname' => 'Agtong',
                    'prof_birthdate' => Carbon::parse('1992-02-02')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'khentsamsonapduhan@gmail.com',
                'password' => bcrypt('khenty123'),
                'user_contact' => '09345678901',
                'profile' => [
                    'prof_fname' => 'Khent Samson',
                    'prof_lname' => 'Apduhan',
                    'prof_birthdate' => Carbon::parse('1993-03-03')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'jieyalingao13@gmail.com',
                'password' => bcrypt('jieya123'),
                'user_contact' => '09345678801',
                'profile' => [
                    'prof_fname' => 'Jieya',
                    'prof_lname' => 'Lingaolingao',
                    'prof_birthdate' => Carbon::parse('1993-03-03')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'espedillonmelchor@gmail.com',
                'password' => bcrypt('melchor123'),
                'user_contact' => '09345348901',
                'profile' => [
                    'prof_fname' => 'Melchor',
                    'prof_lname' => 'Espedillon',
                    'prof_birthdate' => Carbon::parse('1993-03-03')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'macancharles0@gmail.com',
                'password' => bcrypt('macan123'),
                'user_contact' => '09354678901',
                'profile' => [
                    'prof_fname' => 'Charles',
                    'prof_lname' => 'Macan',
                    'prof_birthdate' => Carbon::parse('1993-03-03')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
            [
                'email' => 'julieannabendan18@gmail.com',
                'password' => bcrypt('julie123'),
                'user_contact' => '09345564901',
                'profile' => [
                    'prof_fname' => 'Julie Ann',
                    'prof_lname' => 'Abendan',
                    'prof_birthdate' => Carbon::parse('1993-03-03')->toDateString(),
                    'prof_is_verified' => true,
                ],
            ],
        ];

        // Create each superadmin user
        foreach ($superAdmins as $adminData) {
            // Create the profile
            $profile = Profile::create($adminData['profile']);

            // Create the user and assign the superadmin role
            User::create([
                'email' => $adminData['email'],
                'password' => $adminData['password'],
                'user_contact' => $adminData['user_contact'],
                'prof_id' => $profile->id,
                'role_id' => $superAdminRole->id, // Assign the role directly
            ]);
        }
    }
}

// undo:
// DELETE FROM users WHERE email IN (
//     'breannaancheta03@gmail.com',
//     'cedrickmieragtong@gmail.com',
//     'khentsamsonapduhan@gmail.com',
//     'jieyalingao13@gmail.com',
//     'espedillonmelchor@gmail.com',
//     'macancharles0@gmail.com',
//     'julieannabendan18@gmail.com'
// );
// DELETE FROM roles WHERE role_name = 'superadmin';
