<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Erpa extends Model
{
    use HasFactory;

    protected $fillable = [
        'sec_mem_id', 'erpa_tal', 'erpa_hobb', 'erpa_other_skill',
        'erpa_school', 'erpa_civic', 'erpa_community',
        'erpa_workplace', 'erpa_seminar_title', 'erpa_seminar_date',
        'erpa_seminar_organizer'
    ];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
