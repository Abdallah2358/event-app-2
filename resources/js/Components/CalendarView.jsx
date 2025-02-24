import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Calendar,
    Views,
    momentLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up Moment.js as the localizer
const localizer = momentLocalizer(moment);

// Function to combine date and time into a JavaScript Date object
const combineDateTime = (dateStr, timeStr) => {
    return moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').toDate();
};

export default function CalendarView({ events }) {
    // Memoized values for performance optimization
    const { components, defaultDate, views } = useMemo(() => ({
        components: {},
        defaultDate: new Date(), // Default to today
        views: ['month', 'week', 'day'], // Ensure Month view is included
    }), []);
    const [currentView, setCurrentView] = useState(Views.MONTH); // Default view is Month

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
                return [{
                    id: event.id,
                    title: event.title,
                    start: combineDateTime(event.start_date, startTime),
                    end: combineDateTime(event.end_date, endTime),

                }];
            } else {
                // Multi-day event → Break it into separate day-long entries
                let currentDate = startDate.clone();

                let multiDayEvents = [];
                if (currentView == 'month') {
                    multiDayEvents.push(
                        {
                            id: event.id,
                            title: event.title,
                            start: combineDateTime(event.start_date, startTime),
                            end: combineDateTime(event.end_date, endTime),
                        }
                    )
                } else {

                    while (currentDate.isSameOrBefore(endDate, 'day')) {
                        const eventDay = {
                            id: `${event.id}-${currentDate.format('YYYY-MM-DD')}`,
                            title: event.title,
                            start: combineDateTime(currentDate.format('YYYY-MM-DD'), startTime),
                            end: combineDateTime(currentDate.format('YYYY-MM-DD'), endTime),
                            allDay: false, // Force all-day event for visual clarity
                        };
                        multiDayEvents.push(eventDay);

                        currentDate.add(1, 'day');
                    }
                }

                return multiDayEvents;
            }
        });
    };
    const formattedEvents = formatEvents(events);
    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <Calendar
                components={components}
                defaultDate={defaultDate}
                events={formattedEvents}
                localizer={localizer}
                views={views} // Ensure Month View is enabled
                step={60} // 1-hour slots
                showMultiDayTimes
                onView={(view) => setCurrentView(view)} // Update view when changed
                popup={true}
                onSelectEvent={(e) => console.log(e)
                }
                style={{ height: '80vh' }}
            />
        </div>
    );
}

// // Define prop types
// CalendarView.propTypes = {
//     events: PropTypes.arrayOf(
//         PropTypes.shape({
//             id: PropTypes.number.isRequired,
//             title: PropTypes.string.isRequired,
//             start_date: PropTypes.string.isRequired,
//             start_time: PropTypes.string.isRequired,
//             end_date: PropTypes.string.isRequired,
//             end_time: PropTypes.string.isRequired,
//         })
//     ),
// };
