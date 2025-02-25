<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class eventHasCapacity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $event = $request->route('event');
        if ($event->capacity === 0 && $event->wait_list_capacity > 0) {
            return to_route('event.join-wait-list', $event);
        }
        return $next($request);
    }
}
