<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'addr_city',
        'addr_barangay',
        'addr_region',
        'addr_block',
        'addr_sitio',
        'addr_street',
        'addr_houseno',
        'addr_province',
        'addr_type',
        'prof_id',
        'emerg_id',
        'house_id'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'prof_id');
    }

    public function emergencyContact()
    {
        return $this->belongsTo(EmergencyContact::class);
    }

    public function household()
    {
        return $this->belongsTo(Household::class, 'house_id');
    }

    public function documentRequest()
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
