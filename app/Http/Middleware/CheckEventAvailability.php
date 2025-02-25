<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEventAvailability
{
    /**
     * Handle an incoming request to ensure the event is available.
     *
     * This middleware checks if the event being accessed is in 'draft' status.
     * If the event is a draft, the user is redirected back to the event listing
     * with an error message. Otherwise, the request proceeds as normal.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $event = $request->route('event'); // Retrieve the event from the route parameters

        // Check if the event is in draft status
        if ($event->status === 'draft') {
            return to_route('events.index')
                ->withErrors(['not_available' => 'Event is not available.']);
        }

        return $next($request); // Proceed with the request if the event is available
    }
}
