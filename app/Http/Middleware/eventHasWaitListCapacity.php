<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EventHasWaitListCapacity
{
    /**
     * Handle an incoming request to check event and waitlist capacity.
     *
     * This middleware ensures that an event is not fully booked, including both regular capacity and waitlist slots.
     * If the event has no available spots left (both main capacity and waitlist are full),
     * it redirects users back to the event list with an error message.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $event = $request->route('event'); // Retrieve the event from the route parameters

        // Check if both the event's main capacity and waitlist capacity are full
        if ($event->capacity === 0 && $event->wait_list_capacity === 0) {
            return to_route('events.index')
                ->withErrors(['no_wait_list_capacity' => 'Event is completely full.']);
        }

        return $next($request); // Proceed if there is available space in either the main event or waitlist
    }
}
