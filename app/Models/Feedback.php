<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        'feed_title', 
        'feed_message', 
        'feed_submit_date', 
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
