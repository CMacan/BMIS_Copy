<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Log the login activity
        ActivityLog::create([
            'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' Logged In',
            'log_table' => 'users',
            'log_table_id' => Auth::id(),
            // 'log_controller' => 'AuthenticatedSessionController',
            // 'log_con_funct' => 'store',
            'user_id' => Auth::id(),
        ]);

        // Check if the user has a superadmin role
        if ($user->role()->where('role_name', 'superadmin')->exists()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        // Default redirect to user dashboard
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        // Log the logout activity
        ActivityLog::create([
            'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' Logged Out',
            'log_table' => 'users',
            'log_table_id' => Auth::id(),
            // 'log_controller' => 'AuthenticatedSessionController',
            // 'log_con_funct' => 'destroy',
            'user_id' => Auth::id(),
        ]);

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
