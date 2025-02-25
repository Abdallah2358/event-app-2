import moment from 'moment';

// Convert date & time to JavaScript Date object
export const combineDateTime = (dateStr, timeStr) => 
    moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').toDate();

// Format a single event
export const formatEvent = (event) => ({
    ...event,
    allDay: false,
    start: combineDateTime(event.start_date, event.start_time),
    end: combineDateTime(event.end_date, event.end_time),
});

// Format multiple events, handling multi-day events
export const formatEvents = (events, currentView) => {
    return events.flatMap(event => {
        const startDate = moment(`${event.start_date} ${event.start_time}`, 'YYYY-MM-DD HH:mm:ss');
        const endDate = moment(`${event.end_date} ${event.end_time}`, 'YYYY-MM-DD HH:mm:ss');

        if (startDate.isSame(endDate, 'day') || currentView === 'month') {
            return formatEvent(event);
        }

        // Handle multi-day event
        let currentDate = startDate.clone();
        let multiDayEvents = [];

        while (currentDate.isSameOrBefore(endDate, 'day')) {
            multiDayEvents.push({
                ...formatEvent(event),
                start: combineDateTime(currentDate.format('YYYY-MM-DD'), event.start_time),
                end: combineDateTime(currentDate.format('YYYY-MM-DD'), event.end_time),
            });
            currentDate.add(1, 'day');
        }

        return multiDayEvents;
    });
};
