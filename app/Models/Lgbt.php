<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lgbt extends Model
{
    use HasFactory;

    protected $primaryKey = 'sec_mem_id'; // Set prof_id as primary key
    public $incrementing = false; // Disable auto-incrementing
    protected $keyType = 'integer'; // Set the key type
    protected $fillable = ['sec_mem_id', 'lgbt_gender_identity', 'lgbt_sexual_orient'];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
