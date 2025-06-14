<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'user_id', 
        'member_role'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function committees()
    {
        return $this->hasMany(CommitteeMember::class, 'member_id', 'id');
    }   
}
