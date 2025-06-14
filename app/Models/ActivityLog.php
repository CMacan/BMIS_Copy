<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'log_action', 
        'log_table', 
        'log_table_id',
        // 'log_controller', 
        // 'log_con_funct',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
