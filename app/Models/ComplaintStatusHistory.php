<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintStatusHistory extends Model
{
    protected $fillable = [
        'comp_id', 
        'comp_hist_status', 
        'comp_hist_notes'
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
