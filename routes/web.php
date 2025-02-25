<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckEventAvailability;
use App\Http\Middleware\eventHasCapacity;
use App\Http\Middleware\eventHasWaitListCapacity;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'events' => auth()->user()->events
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('/events', EventController::class);
    Route::post('/events/{event}/join', [EventController::class, 'join'])
        ->name('events.join')
        ->middleware(CheckEventAvailability::class)
        ->middleware(eventHasCapacity::class);
    Route::post('/events/{event}/join-wait-list', [EventController::class, 'join_wait_list'])
        ->name('events.join-wait-list')
        ->middleware(CheckEventAvailability::class)
        ->middleware(eventHasWaitListCapacity::class);
});

require __DIR__ . '/auth.php';
