<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckEventAvailability;
use App\Http\Middleware\EventHasCapacity;
use App\Http\Middleware\EventHasWaitListCapacity;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Web Routes
 *
 * This file defines the application's web routes, including authentication,
 * event management, and user profile handling. Middleware ensures security
 * and business logic constraints.
 */

// Home Route
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard Route (Protected)
Route::get('/dashboard', fn() => Inertia::render('Dashboard', [
    'events' => auth()->user()->events ?? []
]))->middleware(['auth', 'verified'])->name('dashboard');

// Authenticated User Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // User Profile Routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Event Management Routes
    Route::resource('/events', EventController::class);

    //  Event Joining & Waitlist Routes (with Middleware)
    Route::prefix('/events/{event}')
        ->middleware([CheckEventAvailability::class])
        ->group(function () {
            Route::post('/join', [EventController::class, 'join'])
                ->middleware(EventHasCapacity::class)
                ->name('events.join');
            Route::post('/join-wait-list', [EventController::class, 'join_wait_list'])
                ->middleware(EventHasWaitListCapacity::class)
                ->name('events.join-wait-list');
        });
});

// Authentication Routes
require __DIR__ . '/auth.php';
