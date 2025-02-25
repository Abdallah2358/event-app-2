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
    }
    public function join_wait_list(JoinEventRequest $request, Event $event)
    {
        $user = $request->user();
        $event->users()->attach($user, [
            'is_on_wait_list' => true
        ]);
        $event->wait_list_capacity -= 1;
        $event->save();
        return to_route('event.index')->with('success', 'You have joined the event wait list.');
    }

    /**
     * User Leave Event
     */
    public function leave(Request $request, Event $event)
    {
        dd($event);
    }
}
