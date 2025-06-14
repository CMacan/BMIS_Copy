<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Notification;
use App\Notifications\DocumentRequestNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log; 

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'birthdate',
        'age',
        'block',
        'civil_status',
        'copies',
        'purpose',
        'status',
        'document_type',
        'staff_id',
        'requester_name',
        'requester_email',
        'requester_contact',
        'decline_reason',
        'amount_paid'
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = self::generateUniqueDateBasedBigInt();
            }
        });
    }

    private static function generateUniqueDateBasedBigInt()
    {
        do {
            $id = self::generateDateBasedBigInt();
        } while (self::where('id', $id)->exists());

        return $id;
    }

    private static function generateDateBasedBigInt()
    {
        $datePart = now()->format('md'); // Current date in Ymd format
        $randomPart = str_pad(random_int(100, 999), 3, '0', STR_PAD_LEFT); // Generate a random 6-digit number with leading zeros
        return (int) ($datePart . $randomPart); // Concatenate and convert to bigint
    }

    private static function generateCustomId($model)
    {
        $prefix = 'DR'; // Custom prefix
        $name = strtoupper(substr($model->name, 0, 1)); // First letter of name
        $timestamp = now()->format('YmdHis'); // Current timestamp
        $randomString = Str::random(5); // Random string of 5 characters

        return $prefix . $name . $timestamp . $randomString;
    }


    public function resident()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sendNotification($message)
    {
        Log::debug('Sending notification...');
        $user = $this->resident;
        Notification::send($user, new DocumentRequestNotification($message));
        Log::debug('Notification sent successfully');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }


}
