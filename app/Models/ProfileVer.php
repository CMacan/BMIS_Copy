<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileVer extends Model
{
    use HasFactory;

    protected $table = 'profile_vers';

    // Fields that can be mass assigned
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'suffix',
        'birthdate',
        'gender',
        'email',
        'contact_number',
        'religion',
        'civil_status',
        'education',
        'occupation',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_number',
        'residency_type',
        'block_lot',
        'street',
        'house_no',
        'years_in_sawang',
        'ticket_id',
        'signature_path',
        'id_image_path',
        'status',
        'submitted_at'
    ];

    // Type casting for proper data handling
    protected $casts = [
        'birthdate' => 'date',
        'submitted_at' => 'datetime',
    ];
}
