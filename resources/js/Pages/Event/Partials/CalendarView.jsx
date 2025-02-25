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
import { formatEvents } from '../utils/calendarUtils';
import { eventPropGetter } from '../utils/eventStyles';

// Set up Moment.js as the localizer
const localizer = momentLocalizer(moment);



export default function CalendarView({ events }) {
    // Memoized values for performance optimization
    const { views } = useMemo(() => ({
        views: ['month', 'week', 'day'], // Ensure Month view is included
    }), []);
    const [currentView, setCurrentView] = useState(Views.MONTH); // Default view is Month
    const formattedEvents = useMemo(() => formatEvents(events, currentView), [events, currentView]);
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
                eventPropGetter={eventPropGetter} // Apply event colors
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
