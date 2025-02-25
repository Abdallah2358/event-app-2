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
     * Display a listing of live events.
     * 
     * Fetches all events with a 'live' status and determines whether the authenticated user
     * has joined each event. This is optimized to avoid unnecessary queries by preloading
     * the user's joined events and filtering accordingly.
     * 
     * @return Response
     */
    public function index()
    {
        $user = auth()->user(); // Get the authenticated user
        $events = Event::where('status', 'live')->get(); // Fetch all live events
        // Get the events that the user has joined
        $userEvents = $user ? $user->events : collect();
        /** GPT Comment:
         * Optimize performance by filtering joined events in-memory rather than querying the DB repeatedly.
         * Since a user typically joins fewer events than the total number available, it's efficient to check
         * against the already retrieved list rather than performing a query per event.
         */
        /** My Comment:
         * Some context this is done to optimize the performance of the query and reduce the number of queries to the database.
         * This is done by eager loading the user events and then filtering the events based on the user events.
         * This way we can avoid querying the database for each event to check if the user has joined the event.
         * since if we load all the events' users this will be massive data and will be a performance issue.
         * since in most cases number of events joined by single user will be less than or equal the total number of events.
         * 
         */
        $events = $events
            ->map(function ($event) use ($userEvents) {
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
     * Allows a user to join an event.
     * 
     * When a user joins an event, they are attached to the event's user list,
     * the event's capacity is reduced, and a confirmation email is sent.
     * 
     * @param JoinEventRequest $request
     * @param Event $event
     * @return \Illuminate\Http\RedirectResponse
     */
    public function join(JoinEventRequest $request, Event $event)
    {
        $user = $request->user();

        // Attach user to event
        $event->users()->attach($user);

        // Reduce event capacity
        $event->capacity -= 1;
        $event->save();

        // Send confirmation email
        Mail::to($user->email)
            ->send(new JoinEventConfirmation(event: $event, user: $user));

        return redirect()->back()->with('success', 'You have successfully joined the event.');
    }

    /**
     * Allows a user to join an event's waitlist if the event is full.
     * 
     * @param JoinEventRequest $request
     * @param Event $event
     * @return \Illuminate\Http\RedirectResponse
     */
    public function join_wait_list(JoinEventRequest $request, Event $event)
    {
        $user = $request->user();

        // Attach user to event with waitlist flag
        $event->users()->attach($user, ['is_on_wait_list' => true]);

        // Reduce waitlist capacity
        $event->wait_list_capacity -= 1;
        $event->save();

        return to_route('events.index')->with('success', 'You have joined the event wait list.');
    }
}
