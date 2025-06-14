<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'comp_id', 
        'attach_path', 
        'attach_name',
        'attach_type',
        'attach_src',
        'prof_id',
        'sign_up_id',
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

}
