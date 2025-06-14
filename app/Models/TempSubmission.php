<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Profile;
use App\Models\SectoralForm;
use App\Models\User;

class TempSubmission extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'data',
        'signature',
        'form_type', 'status','form_id', 'approved_by', 'approved_at','declined_by','decline_reason','declined_at'
    ];
    protected $dates = [
        'approved_at',
        'declined_at',
        'created_at',
        'updated_at'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
    public function sectoralForm()
{
    return $this->belongsTo(SectoralForm::class, 'form_id');
}
public function approvedBy()
{
    return $this->belongsTo(User::class, 'approved_by');
}

public function declinedBy()
{
    return $this->belongsTo(User::class, 'declined_by');
}

}
