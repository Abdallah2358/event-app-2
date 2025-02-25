import moment from 'moment';

/**
 * Combines a date string and time string into a JavaScript Date object.
 *
 * @param {string} dateStr - The date in 'YYYY-MM-DD' format.
 * @param {string} timeStr - The time in 'HH:mm:ss' format.
 * @returns {Date} - JavaScript Date object.
 */
export const combineDateTime = (dateStr, timeStr) => 
    moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').toDate();

/**
 * Formats a single event by adding `start`, `end`, and `allDay` properties.
 *
 * @param {Object} event - The event object.
 * @param {string} event.start_date - Event start date (YYYY-MM-DD).
 * @param {string} event.start_time - Event start time (HH:mm:ss).
 * @param {string} event.end_date - Event end date (YYYY-MM-DD).
 * @param {string} event.end_time - Event end time (HH:mm:ss).
 * @returns {Object} - Formatted event object.
 */
export const formatEvent = (event) => ({
    ...event,
    allDay: false, // Ensures events are not treated as full-day events
    start: combineDateTime(event.start_date, event.start_time),
    end: combineDateTime(event.end_date, event.end_time),
});

/**
 * Formats multiple events, handling multi-day events appropriately.
 *
 * @param {Array<Object>} events - List of event objects.
 * @param {string} currentView - The current calendar view ('month', 'week', 'day').
 * @returns {Array<Object>} - Formatted events, split if necessary for multi-day events.
 */
export const formatEvents = (events, currentView) => {
    return events.flatMap(event => {
        const startDate = moment(`${event.start_date} ${event.start_time}`, 'YYYY-MM-DD HH:mm:ss');
        const endDate = moment(`${event.end_date} ${event.end_time}`, 'YYYY-MM-DD HH:mm:ss');

        // If the event starts and ends on the same day, or we're in month view, return as is
        if (startDate.isSame(endDate, 'day') || currentView === 'month') {
            return formatEvent(event);
        }

        // Handle multi-day events by breaking them into individual day-long segments for DAY view
        let currentDate = startDate.clone();
        let multiDayEvents = [];

        while (currentDate.isSameOrBefore(endDate, 'day')) {
            multiDayEvents.push({
                ...formatEvent(event),
                start: combineDateTime(currentDate.format('YYYY-MM-DD'), event.start_time),
                end: combineDateTime(currentDate.format('YYYY-MM-DD'), event.end_time),
            });
            currentDate.add(1, 'day'); // Move to the next day
        }
        return multiDayEvents;
    });
};
