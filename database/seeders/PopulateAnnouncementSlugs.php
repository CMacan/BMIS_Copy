<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PopulateAnnouncementSlugs extends Seeder
{
    public function run()
    {
        Announcement::whereNull('slug')->each(function ($announcement) {
            $announcement->slug = Str::slug($announcement->title);
            $announcement->save();
        });
    }
}
