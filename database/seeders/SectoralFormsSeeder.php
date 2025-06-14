<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SectoralFormsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sectoral_forms')->insert([
            [
                'name' => 'ERPA FORM',
                'description' => 'Empowerment and Reaffirmation of Paternal Abilities Training',
                'category' => 'Community',
                'addtl_detail' => 'This form helps assess your household\'s emergency preparedness level and identifies specific needs during disasters or emergencies.',
                'image' => 'sectoral/erpat.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'LGBT Intake Form',
                'description' => 'LGBT Community Support and Services Form',
                'category' => 'Community',
                'addtl_detail' => 'This form helps us understand your specific needs and connect you with appropriate support services and community resources.',
                'image' => 'sectoral/lgbt.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'CHILDREN INTAKE FORM',
                'description' => 'Child Support and Services Assessment',
                'category' => 'Youth',
                'addtl_detail' => 'This form helps us assess the needs of children and connect them with appropriate support services and programs.',
                'image' => 'sectoral/childrens.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'PWD INTAKE FORM',
                'description' => 'Persons with Disabilities Support Services Form',
                'category' => 'Healthcare',
                'addtl_detail' => 'This form helps us understand your specific needs and ensure appropriate accommodations and support services are provided.',
                'image' => 'sectoral/pwd.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'SOLO PARENT FORM',
                'description' => 'Solo Parent Support Services Assessment',
                'category' => 'Family',
                'addtl_detail' => 'This form helps us assess your needs as a solo parent and connect you with appropriate support services and programs.',
                'image' => 'sectoral/Soloparent.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'WOMEN INTAKE FORM',
                'description' => 'Women\'s Support Services Assessment',
                'category' => 'Community',
                'addtl_detail' => 'This form helps us understand your specific needs and connect you with women-focused support services and programs.',
                'image' => 'sectoral/women.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'SENIOR CITIZEN INTAKE FORM',
                'description' => 'Senior Citizen Services Assessment',
                'category' => 'Healthcare',
                'addtl_detail' => 'This form helps us assess your needs as a senior citizen and connect you with appropriate support services and programs.',
                'image' => 'sectoral/SeniorCitezen.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
