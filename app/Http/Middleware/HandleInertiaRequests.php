<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * This defines the main Blade template that wraps all Inertia pages.
     * Typically, this is set to 'app', which includes the Inertia setup.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared globally with all Inertia responses.
     *
     * This method allows data to be available across all Inertia views,
     * such as authentication details and flash messages.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request), // Include default shared data from Inertia
            'auth' => [
                'user' => $request->user(), // Pass the authenticated user (or null if not logged in)
            ],
            'flash' => [
                'success' => session('success'), // Flash success messages from the session
                'error' => session('error'), // Flash error messages from the session
            ],
        ];
    }
}
