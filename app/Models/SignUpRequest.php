<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SignUpRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'sign_up_fname',
        'sign_up_lname',
        'sign_up_birthdate',
        'sign_up_gender',
        'sign_up_cstatus',
        'sign_up_is_voter',
        // 'sign_up_contact',
        'sign_up_email',
        'sign_up_password',
        'sign_up_city',
        'sign_up_barangay',
        'sign_up_region',
        'sign_up_block',
        'sign_up_sitio',
        'sign_up_street',
        'sign_up_houseno',
        'sign_up_province',
    ];

    protected $hidden = [
        'sign_up_password',
    ];

    public function attachment()
    {
        return $this->hasMany(Attachment::class, 'sign_up_id');
    }
}
