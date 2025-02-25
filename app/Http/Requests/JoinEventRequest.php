<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Event;
use App\Models\User;

class JoinEventRequest extends FormRequest
{

    public function withValidator(Validator $validator)
    {
        $event = $this->route('event');
        $user = $this->user();

        // Custom validation rules
        $validator->after(function ($validator) use ($event, $user) {
            if ($event->users()->where('user_id', $user->id)->exists()) {
                $validator->errors()->add('already_joined', 'You have already joined this event.');
            }
            if ($this->overlapsWithOtherEvents($user, $event)) {
                $validator->errors()->add('overlaps_with_other_events', 'This Event Over Laps with other Events.');
            }
        });
    }

    protected function overlapsWithOtherEvents(User $user, Event $event): bool
    {
        return $user->events()
        ->where(function ($query) use ($event) {
            $query->whereDate('start_date', '<=', $event->end_date)
                  ->whereDate('end_date', '>=', $event->start_date)
                  ->whereTime('end_time', '>', $event->start_time);
        })
        ->exists(); // If any event overlaps with the given event
        $events_overlapping_before = $user->events()
            ->whereDate('end_date', '>=', $event->start_date)
            ->whereDate('start_date', '<=', $event->start_date)
            ->where('end_time', '>', $event->start_time)
            ->get();

        $events_overlapping_after = $user->events()
            ->whereDate('start_date', '<=', $event->end_date)
            ->whereDate('end_date', '>=', $event->end_date)
            ->where('end_time', '>', $event->start_time)
            ->get();
        $events_overlapping_I_surround = $user->events()
            ->whereDate('start_date', '>=', $event->start_date)
            ->whereDate('end_date', '<=', $event->end_date)
            ->where('end_time', '>=', $event->start_time)
            ->get();
        $events_overlapping_surrounded = $user->events()
            ->whereDate('start_date', '>=', $event->start_date)
            ->whereDate('end_date', '<', $event->start_date)
            ->where('end_time', '>', $event->start_time)
            ->get();
        $events_overlapping_surround_me = $user->events()
            ->whereDate('start_date', '<=', $event->start_date)
            ->whereDate('end_date', '>=', $event->end_date)
            ->where('end_time', '>=', $event->start_time)
            ->get();


        return (count($events_overlapping_before) > 0
            || count($events_overlapping_after) > 0
            || count($events_overlapping_I_surround) > 0
            || count($events_overlapping_surround_me) > 0
        );
    }
}
