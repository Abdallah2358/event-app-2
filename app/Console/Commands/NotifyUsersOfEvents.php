<?php

namespace App\Console\Commands;

use App\Mail\JoinEventConfirmation;
use App\Mail\SameDayEventReminder;
use App\Models\Event;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Laravel\Nova\Notifications\NovaNotification;
use Laravel\Nova\URL;

class NotifyUsersOfEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-users-of-events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This Command is used to notify the users of events starting today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $eventsToday = Event::whereDate('start_date', Carbon::now('UTC')->format('Y-m-d'))
            ->where('status', 'live')
            ->get();
        foreach ($eventsToday as $event) {
            $users = $event->users;
            
            foreach ($users as $user) {
                Mail::to($user)->send(new SameDayEventReminder(event: $event, user: $user));
            }
        }
        // echo $eventsToday;
    }
}
