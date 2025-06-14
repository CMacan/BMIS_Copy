<?php

namespace App\Models;


use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class User extends Authenticatable
{
    use Notifiable, AuthorizesRequests;

    protected $fillable = [
        'user_uname',
        // 'user_fname',
        // 'user_lname',
        'user_birthdate',
        // 'user_gender',
        'user_contact',
        'user_status',
        'email', //stay lang as email since maguba ang login if iilis(using built in login of laravel)
        'password', //stay lang as password since maguba ang login if iilis(using built in login of laravel)
        'prof_id',
        'role_id'
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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
        $prefix = 'SGU'; // Custom prefix
        $timestamp = now()->format('YmdHis'); // Current timestamp
        $randomString = Str::random(5); // Random string of 5 characters

        return $prefix . $timestamp . $randomString;
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_users');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id'); // One-to-one relationship
    }

    /**
     * Check if the user has a specific role.
     *
     * @param  string  $role
     * @return bool
     */
    public function hasRole($role)
    {
        return $this->role && $this->role->role_name === $role;
    }

    /**
     * Check if the user has a specific permission.
     *
     * @param  string  $permission
     * @return bool
     */
    public function hasPermission($permission)
    {
        return $this->role()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('perm_name', $permission);
        })->exists();
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class ,'prof_id');
    }

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class);
    }


    public function address()
    {
        return $this->hasOne(Address::class);
    }



    public function householdMembers()
    {
        return $this->hasMany(HouseholdMember::class, 'household_id', 'household_id');
    }

    
    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable_id')->orderBy('created_at', 'desc');
    }
}


