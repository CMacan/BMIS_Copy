<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class HouseholdMember extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'hmemb_relation',
        'hmemb_is_primary_contact',
        'hmemb_working_status',
        'hmemb_is_dependent',
        'hmemb_is_guardian',
        'house_id',
        'prof_id',
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
        return (int)($datePart . $randomPart); // Concatenate and convert to bigint
    }


    private static function generateCustomId($model)
    {
        $prefix = 'HM'; // Custom prefix
        $relation = strtoupper(substr($model->house_relation, 0, 1)); // First letter of relation
        $timestamp = now()->format('YmdHis'); // Current timestamp
        $randomString = Str::random(5); // Random string of 5 characters

        return $prefix . $relation . $timestamp . $randomString;
    }

    public function households()
    {
        return $this->belongsToMany(User::class);
    }

    
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }
}
