<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'slug',
        'publish_at',
        'is_published',
         'picture'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
