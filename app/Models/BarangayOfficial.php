<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayOfficial extends Model
{
    protected $fillable = [
        'bar_off_position', 
        'bar_off_term_st', 
        'bar_off_term_end',
        'bar_off_status',
        'prof_id',
        'bar_id'
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'bar_id', 'id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'prof_id', 'id');
    }
    
}
