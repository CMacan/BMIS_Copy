<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    protected $fillable = [
        'emerg_fname', 
        'emerg_lname', 
        'emerg_relation', 
        'emerg_contact',
        'emerg_cstatus',
        'emerg_educattain',
        'emerg_occupation',
        'emerg_restype',
        'prof_id', 
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
