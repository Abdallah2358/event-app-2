<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EventHasCapacity
{
    /**
     * Handle an incoming request to check event capacity.
     *
     * Ensures that users can only join an event if there is available capacity.
     * If the event is at full capacity, it prevents users from joining and
     * provides appropriate error messages.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $event = $request->route('event'); // Retrieve the event from the route parameters

        // If both event capacity and waitlist capacity are full, prevent joining
        if ($event->capacity === 0 && $event->wait_list_capacity === 0) {
            return back()->withErrors(['no_wait_list_capacity' => 'Event is completely full.']);
        }

        // If the main capacity is full but waitlist spots are available, prevent direct joining
        if ($event->capacity === 0 && $event->wait_list_capacity > 0) {
            return back()->withErrors(['no_capacity' => 'Event is at full capacity.']);
        }

        return $next($request); // Allow access if capacity is available
    }
}
