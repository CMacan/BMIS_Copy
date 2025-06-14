<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pwd extends Model
{
    use HasFactory;

    protected $primaryKey = 'sec_mem_id';
    public $incrementing = false; // Because it's not an auto-increment column
    protected $keyType = 'int';
    protected $fillable = ['sec_mem_id', 'pwd_disability', 'pwd_fb_acc'];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
