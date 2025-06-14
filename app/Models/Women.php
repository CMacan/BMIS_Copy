<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Women extends Model
{
    use HasFactory;

    protected $fillable = ['sec_mem_id', 'women_is_breadwinner'];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
