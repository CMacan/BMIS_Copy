<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyMember extends Model
{
    protected $fillable = [
        'fam_id', 
        'prof_id', 
        'fmemb_relation', 
        'fmemb_is_primary_contact', 
        'fmemb_working_status'
    ];

    public function family()
    {
        return $this->belongsTo(Family::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
