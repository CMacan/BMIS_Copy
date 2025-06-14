<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SoloParent extends Model
{
    use HasFactory;

    protected $fillable = [
        'sec_mem_id', 'solo_mon_income', 'solo_tot_mon_inc', 'solo_classi',
        'solo_prob', 'solo_resource', 'solo_parent_circumstance',
        'solo_parent_needs', 'solo_parent_fam_rscrs'
    ];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
