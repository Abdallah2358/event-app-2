<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Event;

class JoinEventRequest extends FormRequest
{

    public function withValidator(Validator $validator)
    {
        // dd($this);
        $event = $this->route('event');
        // dd($event);
        $user = $this->user();

        // Custom validation rules
        $validator->after(function ($validator) use ($event, $user) {
            if ($event->users()->where('user_id', $user->id)->exists()) {
                $validator->errors()->add('already_joined', 'You have already joined this event.');
            }
        });
    }
}
