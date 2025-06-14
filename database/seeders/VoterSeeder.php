<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Voter;

class VoterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Voter::factory()->count(50)->create(); // Create 50 voters
        // Voter::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     // Set other fixed attributes as necessary
        // ]);
    }
}
