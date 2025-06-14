<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('barangays')->insert([
            'bar_name' => 'Sawang Calero',
            // 'bar_city' => 'Cebu',
            // 'bar_municipal' => 'Cebu',
            'bar_gmaplink' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.635624065526!2d123.88927855000001!3d10.29091445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99bf9d00c9eb9%3A0x69f99e8eb21b2ebd!2sSawang%20Calero%20(Pob.)%2C%20Cebu%20City%2C%206000%20Cebu!5e0!3m2!1sen!2sph!4v1749308387429!5m2!1sen!2sph',
            'municipal_or_city' => 'Cebu City',
            'bar_prov' => 'Cebu',
            'bar_contact' => '09123456789',
            'bar_email' => 'sawangcalero@gmail.com',
            'bar_fb_link' => 'Sawangcalero',
            'bar_stday' => 'Monday',
            'bar_endday' => 'Friday',
            'bar_sthour' => '08:00:00',
            'bar_endhour' => '17:00:00',
            'bar_logo' => null,
            'bar_motto' => 'Serbisyong Walay pili ug tinud anay',
            'bar_systname' => 'SawangGov',
            'bar_vision' => 'To be the prime agency in providing Calerohanons the sustainable and efficient programs towards gender equality and the empowerment of all women, girls, and other sectors.',
            'bar_mission' => 'To promote a participatory, equitable, and supportive environment where Calerohanons are more responsive in the achievement of gender equality.',
            'bar_value' => 'Passion to serve, Excellence, Integrity, Commitment, Collaboration',
        ]);
    }
}
