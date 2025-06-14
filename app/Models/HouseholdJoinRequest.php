<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseholdJoinRequest extends Model
{
    protected $fillable = [
        'user_id',
        'house_id',
        'house_j_status', // pending, approved, rejected
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}
