<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentSectorMembership extends Model
{
    use HasFactory;

    protected $fillable = [
        'mem_is_pwd',
        'mem_is_lgbt',
        'mem_is_solo_parent',
        'mem_is_women',
        'mem_is_erpa',
        'mem_is_senior',
        'mem_is_children',
        'verified_at',
        'verified_by',
        'sec_app_id',
        'prof_id',
    ];

    protected $casts = [
        'mem_is_pwd' => 'boolean',
        'mem_is_lgbt' => 'boolean',
        'mem_is_solo_parent' => 'boolean',
        'mem_is_women' => 'boolean',
        'mem_is_erpa' => 'boolean',
        'mem_is_senior' => 'boolean',
        'mem_is_children' => 'boolean',
        'verified_at' => 'datetime',
    ];

    // Relationships
    public function tempSubmission()
    {
        return $this->belongsTo(TempSubmission::class, 'sec_app_id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'prof_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
    public function lgbt()
{
    return $this->hasOne(Lgbt::class, 'sec_mem_id');
}

    public function pwd()
    {
        return $this->hasOne(Pwd::class, 'sec_mem_id');
    }

    public function soloParent()
    {
        return $this->hasOne(SoloParent::class, 'sec_mem_id');
    }
    public function children()
    {
        return $this->hasOne(Children::class, 'sec_mem_id');
    }
    public function erpa()
    {
        return $this->hasOne(Erpa::class, 'sec_mem_id');
    }
    public function senior()
    {
        return $this->hasOne(Senior::class, 'sec_mem_id');
    }
    public function women()
    {
        return $this->hasOne(Women::class, 'sec_mem_id');
    }


}
