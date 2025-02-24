<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use MatanYadaev\EloquentSpatial\Objects\Point;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'name' => 'Carlos Howell',
                'start_date' => '2025-02-19',
                'end_date' => '2025-02-28',
                'days' => 10,
                'start_time' => '13:00:00',
                'end_time' => '15:30:00',
                'location' => new Point(40.7128, -74.0060), // New York
            ],
            [
                'name' => 'Allegra Wilkins',
                'start_date' => '2025-02-19',
                'end_date' => '2025-02-28',
                'days' => 10,
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'location' => new Point(37.7749, -122.4194), // San Francisco
            ],
            [
                'name' => 'Test Event',
                'start_date' => '2025-01-28',
                'end_date' => '2025-01-29',
                'days' => 2,
                'start_time' => '11:10:00',
                'end_time' => '14:10:00',
                'location' => new Point(34.0522, -118.2437), // Los Angeles
            ],
            [
                'name' => 'Start before and ends inside',
                'start_date' => '2025-02-10',
                'end_date' => '2025-02-21',
                'days' => 12,
                'start_time' => '09:00:00',
                'end_time' => '23:26:00',
                'location' => new Point(51.5074, -0.1278), // London
            ],
            [
                'name' => 'Start inside and ends inside',
                'start_date' => '2025-02-21',
                'end_date' => '2025-02-24',
                'days' => 4,
                'start_time' => '08:00:00',
                'end_time' => '20:03:00',
                'location' => new Point(48.8566, 2.3522), // Paris
            ],
            [
                'name' => 'Start inside and ends after',
                'start_date' => '2025-02-21',
                'end_date' => '2025-03-02',
                'days' => 10,
                'start_time' => '08:00:00',
                'end_time' => '20:03:00',
                'location' => new Point(41.9028, 12.4964), // Rome
            ],
            [
                'name' => 'Start before and ends after',
                'start_date' => '2025-02-15',
                'end_date' => '2025-03-02',
                'days' => 16,
                'start_time' => '08:00:00',
                'end_time' => '20:03:00',
                'location' => new Point(35.6895, 139.6917), // Tokyo
            ],
            [
                'name' => 'Start before and ends before',
                'start_date' => '2025-02-12',
                'end_date' => '2025-02-18',
                'days' => 7,
                'start_time' => '08:00:00',
                'end_time' => '20:03:00',
                'location' => new Point(-33.8688, 151.2093), // Sydney
            ],
            [
                'name' => 'Start after and ends after',
                'start_date' => '2025-03-08',
                'end_date' => '2025-03-26',
                'days' => 19,
                'start_time' => '08:00:00',
                'end_time' => '20:03:00',
                'location' => new Point(55.7558, 37.6173), // Moscow
            ],
            [
                'name' => 'Sage Herrera',
                'start_date' => '2019-06-07',
                'end_date' => '2025-02-19',
                'days' => 2085,
                'start_time' => '22:28:00',
                'end_time' => '09:17:00',
                'location' => new Point(52.5200, 13.4050), // Berlin
            ],
        ];

        foreach ($events as $event) {
            Event::create(array_merge($event, [
                'capacity' => 100,
                'wait_list_capacity' => 50,
                'status' => 'live',
            ]));
        }
    }
}
