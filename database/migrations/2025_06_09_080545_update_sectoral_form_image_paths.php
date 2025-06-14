<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    DB::table('sectoral_forms')->update([
        'image' => DB::raw("REPLACE(image, 'sectoral/', 'images/')")
    ]);
}

public function down()
{
    DB::table('sectoral_forms')->update([
        'image' => DB::raw("REPLACE(image, 'images/', 'sectoral/')")
    ]);
}
};
