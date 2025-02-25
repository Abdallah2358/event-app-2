import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';
import { formatEvents } from '../utils/calendarUtils';
import { eventPropGetter } from '../utils/eventStyles';

// Set up Moment.js as the localizer for the calendar
const localizer = momentLocalizer(moment);

/**
 * CalendarView Component - Displays events in a calendar view.
 *
 * @param {Object} props - Component props
 * @param {Array} props.events - List of events to display in the calendar
 */
export default function CalendarView({ events }) {
    // Define available calendar views (Month, Week, Day)
    const views = useMemo(() => ['month', 'week', 'day'], []);

    // State: Tracks the currently selected calendar view
    const [currentView, setCurrentView] = useState(Views.MONTH);

    // State: Tracks the selected event for the modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    /**
     * Memoized event formatting to prevent unnecessary recalculations.
     * Converts raw Laravel events into a format compatible with react-big-calendar.
     */
    const formattedEvents = useMemo(() => formatEvents(events, currentView), [events, currentView]);

    /**
     * Handles event selection, opening the modal with event details.
     * Uses useCallback to prevent unnecessary re-renders.
     *
     * @param {Object} event - The selected event object
     */
    const handleEventSelect = useCallback((event) => {
        setSelectedEvent({ ...event });
        setIsOpen(true);
    }, []);

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            {/* Main Calendar Component */}
            <Calendar
                events={formattedEvents} // Processed event list
                localizer={localizer} // Moment.js localization
                views={views} // Available views
                step={60} // Time slot interval in minutes
                showMultiDayTimes // Allow multi-day events to be displayed properly
                onView={setCurrentView} // Update current view when changed
                popup={true} // Enable event details popup
                onSelectEvent={handleEventSelect} // Handle event selection
                style={{ height: '70vh' }} // Set calendar height
                eventPropGetter={eventPropGetter} // Apply custom event styles
            />

            {/* Event Details Modal */}
            {selectedEvent && (
                <EventModal event={selectedEvent} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
}

// Define prop types to ensure correct data structure
CalendarView.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired, // Unique event ID
            title: PropTypes.string.isRequired, // Event title
            start_date: PropTypes.string.isRequired, // Start date (YYYY-MM-DD)
            start_time: PropTypes.string.isRequired, // Start time (HH:mm:ss)
            end_date: PropTypes.string.isRequired, // End date (YYYY-MM-DD)
            end_time: PropTypes.string.isRequired, // End time (HH:mm:ss)
        })
    ),
};
