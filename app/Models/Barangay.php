<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $fillable = [
        'bar_logo',
        'bar_name', 
        'bar_muni_or_city', 
        'bar_prov', 
        'bar_location',
        'bar_gmaplink',
        'bar_contact',
        'bar_email', 
        'bar_fbname',  
        'bar_fb_link', 
        'bar_stday',
        'bar_endday', 
        'bar_sthour', 
        'bar_endhour',
        'bar_motto',
        'bar_systname',
        'bar_vision',
        'bar_mission',
        'bar_value'
    ];

    public function officials()
    {
        return $this->hasMany(BarangayOfficial::class);
    }
  
    
}
