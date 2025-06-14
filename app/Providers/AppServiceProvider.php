<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureUserIsStaff;
use Inertia\Inertia;
use App\Models\Barangay;
use Illuminate\Support\Facades\Schema;
use Dotenv\Dotenv;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Route::aliasMiddleware('staff', EnsureUserIsStaff::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (Schema::hasTable('barangays')) {
                Inertia::share([
                    'barangay' => Barangay::first(),
                ]);
            }
        } catch (\Exception $e) {
            // Silently handle database connection errors during boot
        }
    }
}
