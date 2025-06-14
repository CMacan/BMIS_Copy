<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStaff
{
    public function handle(Request $request, Closure $next): Response
    {          
        if (auth()->check() && auth()->user()->hasRole('staff')) {
            return $next($request);
        }

        return redirect('/')->with('error', 'You do not have access to this page.');
    }
}
