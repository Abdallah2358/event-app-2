import { toast } from 'react-hot-toast';

/**
 * Handles error messages related to joining an event.
 * 
 * This function checks for specific error conditions and displays appropriate toast notifications 
 * to inform the user about why they couldn't join the event.
 *
 * @param {Object} errors - The error object returned from the server.
 * @param {string} [errors.already_joined] - Message when the user has already joined the event.
 * @param {string} [errors.not_available] - Message when the event is unavailable for registration.
 * @param {string} [errors.overlaps_with_other_events] - Message when the event conflicts with another registered event.
 * @returns {null} - Returns null after displaying the toast notification.
 */
export const handleJoinErrors = (errors) => {
    // Check if the user has already joined the event
    if (errors?.already_joined) {
        toast.error(errors.already_joined);
        return null;
    }

    // Check if the event is unavailable for registration in Draft status
    if (errors?.not_available) {
        toast.error(errors.not_available);
        return null;
    }

    // Check if the event overlaps with another registered event
    if (errors?.overlaps_with_other_events) {
        toast.error(errors.overlaps_with_other_events);
        return null;
    }

    return null; // Default return when no specific errors match
};
