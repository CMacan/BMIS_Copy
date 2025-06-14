<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'staff_id',
        'document_request_id',
        'notif_message',
        'notif_status',
        'notif_title',
        'notif_date_read',
        'notif_category',
        'link', // Added link field
    ];

    protected $casts = [
        'notif_date_read' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function documentRequest()
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->whereNull('notif_date_read');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('notif_date_read');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
