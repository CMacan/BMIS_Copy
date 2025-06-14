<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectoralForm extends Model {
    use HasFactory;

    // Explicitly define the table name
    protected $table = 'sectoral_forms';

    // Define fillable columns
    protected $fillable = ['name', 'description','image', 'category', 'addtl_detail'];

    // Relationship: One form has many requirements
    public function requirements() {
        return $this->hasMany(SectoralRequirement::class, 'form_id', 'id');
    }
}
