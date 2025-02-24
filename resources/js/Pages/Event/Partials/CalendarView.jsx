import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Calendar,
    Views,
    momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';

// Set up Moment.js as the localizer
const localizer = momentLocalizer(moment);

// Function to combine date and time into a JavaScript Date object
const combineDateTime = (dateStr, timeStr) => {
    return moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').toDate();
};

export default function CalendarView({ events }) {
    // Memoized values for performance optimization
    const { views } = useMemo(() => ({
        views: ['month', 'week', 'day'], // Ensure Month view is included
    }), []);
    const [currentView, setCurrentView] = useState(Views.MONTH); // Default view is Month
    const formatEvent = (event, options = 'single') => {
        event['allDay'] = false;
        event['start'] = combineDateTime(event.start_date, event.start_time);
        event['end'] = combineDateTime(event.end_date, event.end_time);
        return event;
    }
    // Convert Laravel events into the correct format
    // Function to properly format multi-day events
    const formatEvents = (events) => {
        return events.flatMap(event => {
            const startTime = event.start_time;
            const endTime = event.end_time;
            const startDate = moment(`${event.start_date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss');
            const endDate = moment(`${event.end_date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss');
            if (startDate.isSame(endDate, 'day')) {
                // Single-day event
                return [formatEvent(event)];
            } else {
                // Multi-day event → Break it into separate day-long entries
                let currentDate = startDate.clone();
                let multiDayEvents = [];
                if (currentView == 'month') {
                    multiDayEvents.push(formatEvent(event))
                } else {
                    while (currentDate.isSameOrBefore(endDate, 'day')) {
                        const eventDay = { ...formatEvent(event) };
                        eventDay['start'] = combineDateTime(currentDate.format('YYYY-MM-DD'), startTime);
                        eventDay['end'] = combineDateTime(currentDate.format('YYYY-MM-DD'), endTime);
                        multiDayEvents.push(eventDay);
                        currentDate.add(1, 'day');
                    }
                }
                return multiDayEvents;
            }
        });
    };
    const formattedEvents = formatEvents(events);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    function handleEventSelect(event) {
        setSelectedEvent({ ...event });
        setIsOpen(true);
    }
    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <Calendar
                events={formattedEvents}
                localizer={localizer}
                views={views} // Ensure Month View is enabled
                step={60} // 1-hour slots
                showMultiDayTimes
                onView={(view) => setCurrentView(view)} // Update view when changed
                popup={true}
                onSelectEvent={handleEventSelect}
                style={{ height: '70vh' }}
            />
            {selectedEvent && (
                <EventModal event={selectedEvent} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
}

// Define prop types
CalendarView.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            start_date: PropTypes.string.isRequired,
            start_time: PropTypes.string.isRequired,
            end_date: PropTypes.string.isRequired,
            end_time: PropTypes.string.isRequired,
        })
    ),
};
