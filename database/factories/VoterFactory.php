<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voter>
 */
class VoterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vote_fname' => $this->faker->firstName,
            'vote_lname' => $this->faker->lastName,
            'vote_birthdate' => $this->faker->date,
            'vote_res_date' => $this->faker->date,
            'bar_id' => \App\Models\Barangay::factory(), // Assuming Barangay factory exists
        ];
    }
}
