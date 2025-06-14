<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    protected $fillable = [
        'fam_name', 
        'fam_income', 
        'house_id'
    ];

    public function household()
    {
        return $this->belongsTo(Household::class);
    }

    public function members()
    {
        return $this->hasMany(FamilyMember::class);
    }
}
