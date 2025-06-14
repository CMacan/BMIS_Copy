<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'vote_fname',
        'vote_lname',
        'precinct_id',
        'bar_id',
        
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'bar_id');
    }
    public function precinct()
    {
        return $this->belongsTo(PrecinctNumber::class, 'precinct_id');
    }
    public function profile()
    {
        return $this->hasOne(Profile::class, 'voters_id');
    }
}
