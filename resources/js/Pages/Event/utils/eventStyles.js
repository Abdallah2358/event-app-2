/**
 * Determines the styling for calendar events based on their status.
 *
 * @param {Object} event - The event object.
 * @param {boolean} [event.on_wait_list=false] - Whether the user is on the waitlist.
 * @param {boolean} [event.joined=false] - Whether the user has joined the event.
 * @returns {Object} - Object containing the CSS style properties for the event.
 */
export const eventPropGetter = (event) => {
    let backgroundColor = ''; // Default color (no specific status)

    if (event.on_wait_list) {
        backgroundColor = 'orange'; // Waitlisted events → Orange
    } else if (event.joined) {
        backgroundColor = 'darkgreen'; // Joined events → Green
    }

    return {
        style: {
            backgroundColor,
            borderRadius: '5px', // Rounded corners for a softer look
            padding: '5px', // Adds spacing inside the event block
        },
    };
};
