<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsNovaAdmin
{
    /**
     * Handle an incoming request to check if the user is an admin.
     *
     * This middleware restricts access to certain routes, ensuring only 
     * authenticated users with admin privileges can proceed.
     * If the user is not an admin, they will be redirected to the homepage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure the user is authenticated and has admin privileges
        if (!auth()->check() || !auth()->user()->is_admin) {
            return redirect('/')->withErrors(['error' => 'Unauthorized access.']);
        }

        return $next($request);
    }
}
