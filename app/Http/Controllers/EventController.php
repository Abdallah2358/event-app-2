<?php

namespace App\Http\Controllers;

use App\Http\Requests\JoinEventRequest;
use App\Mail\JoinEventConfirmation;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::where('status', 'live')->get()->map(function ($event) {
            $event['title'] = $event->name;
            return $event;
        });

        return Inertia::render('Event/Index', [
            'events' => $events
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }

    /**
     * User Join Event
     */
    public function join(JoinEventRequest $request, Event $event)
    {

        $user = $request->user();
        $event->users()->attach($user);
        $event->capacity -= 1;
        $event->save();
        Mail::to($user->email)
            ->send(new JoinEventConfirmation(event: $event, user: $user));


        return redirect()->back()->with('success', 'You have successfully joined the event.');
        // return Inertia:: ['Event' => 'joined'];
        // dd($event);
        // if ($event->status == 'live') {
        //     $user = request()->user();
        //     $event_exists  = $event_exists = $user->events()->find($event->id) !== null;

        //     if ($event_exists) { // user already joined this event
        //         $user->notify(
        //             NovaNotification::make()->message('You already joined ' . $event->name . '.')
        //                 ->type('warning')
        //                 ->icon('information-circle')
        //         );
        //         return ActionResponse::danger('You already joined ' . $event->name . '.');
        //     }

        //     if (!$this->overlapsWithOtherEvents($user, $event)) {
        //         if ($event->capacity) {

        //             $event->users()->attach($user);
        //             $event->capacity -= 1;
        //             $event->save();
        //             $user->notify(
        //                 NovaNotification::make()->message('Event ' . $event->name . ' Joined Successfully.')
        //                     ->type('success')
        //                     ->icon('check')
        //             );
        //             Mail::to($user->email)->send(new JoinEventConfirmation(event: $event, user: $user));
        //             return ActionResponse::message('Event ' . $event->name . ' Joined Successfully.');
        //         } else if ($event->wait_list_capacity) { // event at full capacity but wait list has capacity

        //             $event->users()->attach($user, ['is_on_wait_list' => true]);
        //             $event->wait_list_capacity -= 1;
        //             $event->save();
        //             $user->notify(
        //                 NovaNotification::make()->message('You have been added to wait list for event ' . $event->name . ' because it is at full capacity.')
        //                     ->type('warning')
        //                     ->icon('clock')
        //             );
        //             return ActionResponse::message('Event ' . $event->name . 'is full you were added to wait list Successfully.');

        //             # Todo : add Wait list Email
        //             // Mail::to($user->email)->send(new JoinEventConfirmation(event: $event, user: $user));

        //         } else { // event at full capacity and at full wait list capacity

        //             NovaNotification::make()->message('Sorry event ' . $event->name . ' is at full capacity.')
        //                 ->type('error')
        //                 ->icon('ban');
        //             return ActionResponse::danger('Sorry event ' . $event->name . ' is at full capacity.');
        //         }
        //     } else { // event overlaps with other events user joined

        //         NovaNotification::make()->message('Sorry the event ' . $event->name . ' overlaps with other events you joined.')
        //             ->type('error')
        //             ->icon('ban');
        //         return ActionResponse::danger('Sorry the event ' . $event->name . ' overlaps with other events you joined.');
        //     }
        // }
        // return ActionResponse::danger('Can only join Live Events');
    }

    /**
     * User Leave Event
     */
    public function leave(Request $request, Event $event)
    {
        dd($event);
    }
}
