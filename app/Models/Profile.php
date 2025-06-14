<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Profile extends Model
{
    protected $fillable = [
        'prof_picture', 
        'prof_fname',
        'prof_lname',
        'prof_mname',
        'prof_gender', 
        'prof_birthdate',
        'prof_suffix',
        'prof_religion', 
        'prof_cstatus', 
        'prof_educattain', 
        'prof_occupation', 
        'prof_age', 
        'prof_restype', 
        'prof_start_date', 
        'prof_res_type', 
        'prof_is_verified',
        'prof_is_demog_verified',
        'prof_is_house_head',
        'house_id', 
        'voters_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = self::generateUniqueDateBasedBigInt();
            }
            $model->prof_age = self::calculateAge($model->prof_birthdate);
        });

        static::updating(function ($model) {
            $model->prof_age = self::calculateAge($model->prof_birthdate);
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
        $prefix = 'PF'; // Custom prefix
        $fnameInitial = strtoupper(substr($model->prof_fname, 0, 1)); // First letter of first name
        $lnameInitial = strtoupper(substr($model->prof_lname, 0, 1)); // First letter of last name
        $timestamp = now()->format('YmdHis'); // Current timestamp
        $randomString = Str::random(5); // Random string of 5 characters

        return $prefix . $fnameInitial . $lnameInitial . $timestamp . $randomString;
    }

    private static function calculateAge($birthdate)
    {
        return Carbon::parse($birthdate)->age;
    }

    public function user()
    {
        return $this->hasOne(User::class, 'prof_id');
    }

    public function household()
    {
        return $this->belongsTo(Household::class, 'house_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'prof_id');
    }

    public function emergencyContacts()
    {
        return $this->hasMany(EmergencyContact::class,'prof_id');
    }

    public function familyMembers()
    {
        return $this->hasMany(FamilyMember::class);
    }
    public function voter()
    {
        return $this->belongsTo(Voter::class, 'voters_id');
    }


    // Relationships to child tables
    public function lgbt() {
        return $this->hasOne(LGBT::class, 'prof_id');
    }

    public function pwd() {
        return $this->hasOne(PWD::class, 'prof_id');
    }

    public function senior() {
        return $this->hasOne(Senior::class, 'prof_id');
    }

    public function woman() {
        return $this->hasOne(Women::class, 'prof_id');
    }

    public function child() {
        return $this->hasOne(Children::class, 'prof_id');
    }

    public function erpa() {
        return $this->hasOne(ERPA::class, 'prof_id');
    }

    public function soloParent() {
        return $this->hasOne(SoloParent::class, 'prof_id');
    }

}
