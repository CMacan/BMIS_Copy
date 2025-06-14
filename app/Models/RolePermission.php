<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RolePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id', 
        'permission_id',
    ];

    /**
     * Get the role that owns the RolePermission.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the permission that owns the RolePermission.
     */
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
