<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $isSuperadmin = false;
        if ($user && method_exists($user, 'role')) {
            $isSuperadmin = $user->role()->where('role_name', 'superadmin')->exists();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->only('id','email') : null,
                'isSuperadmin' => $isSuperadmin,
                'profile' => $user?->profile?->only('prof_fname', 'prof_lname', 'prof_mname', 'prof_suffix', 'prof_sex', 'prof_religion', 'prof_cstatus', 'prof_educattain', 'prof_occupation', 'prof_picture'),
                'bar_logo' => $user?->profile?->barangay?->only('brgy_logo'),
            ],
        ];
    }
}
