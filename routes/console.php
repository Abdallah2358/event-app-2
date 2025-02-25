<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Schedules the 'app:notify-users-of-events' command to run daily at 05:00 AM.
 * 
 * This command is responsible for notifying users about upcoming events.
 * It ensures timely reminders and notifications are sent to users.
 *
 * To verify scheduled commands, use:
 * ```sh
 * php artisan schedule:list
 * ```
 */
Schedule::command('app:notify-users-of-events')->dailyAt('05:00');
