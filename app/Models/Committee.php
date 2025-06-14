<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Committee extends Model
{
    protected $fillable = [
        'com_name', 
        'com_description'
    ];

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function members()
    {
        return $this->hasMany(CommitteeMember::class, 'com_id', 'id');
    }
}
