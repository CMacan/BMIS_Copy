<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Support\Str;

class Household extends Model
{

    use HasFactory;
    
    protected $fillable = [
        'house_name', 
        'house_util_access',
        'house_type',
        'house_ownership',
        'house_year',
        'household_id',
        'name',
        'age',
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
        $prefix = 'HS'; // Custom prefix
        $name = strtoupper(substr($model->house_name, 0, 1)); // First letter of name
        //$owner = strtoupper(substr($model->house_name, 0, 1)); // First letter of name
        $timestamp = now()->format('YmdHis'); // Current timestamp
        $randomString = Str::random(5); // Random string of 5 characters

        return $prefix . $name . $timestamp . $randomString;
    }

    /**
     * Get the address associated with the household.
     */
    public function address()
    {
        return $this->hasOne(Address::class, 'house_id');
    }

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'house_id');
    }
}
