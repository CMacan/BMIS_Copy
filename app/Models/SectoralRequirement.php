<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectoralRequirement extends Model {
    use HasFactory;

    // Explicitly define the table name
    protected $table = 'sectoral_requirements';

    // Define fillable columns
    protected $fillable = ['form_id', 'requirement'];

    // Relationship: Each requirement belongs to a sectoral form
    public function sectoralForm() {
        return $this->belongsTo(SectoralForm::class, 'form_id', 'id');
    }
}
