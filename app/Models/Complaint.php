<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = [
        'comp_title', 
        'comp_description', 
        'comp_location',
        'comp_status', 
        'comp_priority_level', 
        'comp_resol_details',
        'comp_resolution_date', 
        'user_id', 
        'com_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function committee()
    {
        return $this->belongsTo(Committee::class);
    }

    public function profile()
    {
        return $this->hasOneThrough(Profile::class, User::class, 'id', 'id', 'user_id', 'prof_id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(ComplaintStatusHistory::class);
    }
}
