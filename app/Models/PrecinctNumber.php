<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrecinctNumber extends Model
{
    use HasFactory;

    protected $fillable = ['precinct_number'];
    
    public function voters()
    {
        return $this->hasMany(Voter::class, 'precinct_id');
    }
}
