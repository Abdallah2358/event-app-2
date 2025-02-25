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
        $user = auth()->user(); // Get the authenticated user
        $events = Event::where('status', 'live')
            // ->with(['users' => function ($query) use ($user) {
            //     $query->where('user_id', $user->id); // Get only the current user’s pivot data
            // }])
            ->get();
        // Get the events that the user has joined
        $userEvents = $user ? $user->events : collect();
        // Get the IDs of the events that the user has joined
        $userEventsIds = $userEvents->pluck('id')->toArray();
        // Map over the events and add the title, joined, and on_wait_list properties
        /**
         * Some context this is done to optimize the performance of the query and reduce the number of queries to the database.
         * This is done by eager loading the user events and then filtering the events based on the user events.
         * This way we can avoid querying the database for each event to check if the user has joined the event.
         * since if we load all the events' users this will be massive data and will be a performance issue.
         * since in most cases number of events joined by single user will be less than or equal the total number of events.
         * 
         */
        $events = $events
            ->map(function ($event) use ($userEventsIds, $userEvents) {
                $event['title'] = $event->name;
                $userEvent =  $userEvents->where('id', $event->id)->first();
                if ($userEvent) {
                    $event['joined'] = true;
                    $event['on_wait_list'] = $userEvent->pivot->is_on_wait_list ? true : false;
                } else {
                    $event['joined'] = false;
                    $event['on_wait_list'] = false;
                }
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
    }
    public function join_wait_list(JoinEventRequest $request, Event $event)
    {
        $user = $request->user();
        $event->users()->attach($user, [
            'is_on_wait_list' => true
        ]);
        $event->wait_list_capacity -= 1;
        $event->save();
        return to_route('events.index')->with('success', 'You have joined the event wait list.');
    }

    /**
     * User Leave Event
     */
    public function leave(Request $request, Event $event)
    {
        dd($event);
    }
}
