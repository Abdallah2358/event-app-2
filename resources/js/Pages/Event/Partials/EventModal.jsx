import EventMap from "@/Components/EventMap";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { formatDate } from "@/src/utils/date";
import { useForm, usePage } from "@inertiajs/react";
import { useMemo, useCallback } from "react";
import { toast } from 'react-hot-toast';
import { handleJoinErrors } from "../utils/errorUtils";

/**
 * EventModal Component - Displays event details in a modal, allowing users to join or leave an event.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.event - Event details including title, dates, status, and location.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {Function} props.onClose - Callback function to close the modal.
 */
export default function EventModal({ event, isOpen, onClose }) {
    const { flash } = usePage().props; // Extract flash messages from Inertia.js props
    const { post } = useForm(); // Initialize Inertia.js form handler

    /**
     * Formats event dates to a user-friendly format.
     * Memoized to avoid unnecessary recalculations.
     */
    const formattedEvent = useMemo(() => ({
        ...event,
        start_date: formatDate(event.start_date),
        end_date: formatDate(event.end_date),
    }), [event]);

    /**
     * Handles joining an event by sending a request to the backend.
     * Displays success or error messages accordingly.
     * Memoized using useCallback to avoid unnecessary re-creations.
     */
    const handleJoin = useCallback(() => {
        post(route('events.join', event.id), {
            onSuccess: () => {
                onClose(); // Close modal on successful join
                if (flash?.success) toast.success(flash.success);
            },
            onError: (errors) => {
                onClose(); // Close modal if there's an error

                // Handle all errors other than capacity
                if (handleJoinErrors(errors)) return;

                // If event is full, attempt to join the waitlist
                if (errors?.no_capacity) {
                    toast.error(errors.no_capacity);
                    toast.loading("Joining waitlist...", { id: "wait-list" });

                    post(route('events.join-wait-list', event.id), {
                        onSuccess: () => toast.success("You've been added to the waitlist!", { id: "wait-list" }),
                        onError: (errors) => {
                            toast.dismiss("wait-list");
                            handleJoinErrors(errors); // Handle waitlist errors
                        },
                    });
                }
            }
        });
    }, [event, onClose, flash, post]);

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                {/* Event Title & Date */}
                <h2 className="text-2xl font-bold">{formattedEvent.title}</h2>
                <p className="text-gray-600">{formattedEvent.start_date} - {formattedEvent.end_date}</p>
                <p className="text-gray-600">{event.start_time} - {event.end_time}</p>

                {/* Event Details */}
                <p className="text-gray-700">Days: {event.days}</p>
                <p className="text-gray-700">Capacity: {event.capacity}</p>
                <p className="text-gray-700">Waitlist: {event.wait_list_capacity}</p>
                <p className={`mt-2 text-sm font-semibold ${event.status === "live" ? "text-green-600" : "text-gray-500"}`}>
                    Status: {event.status}
                </p>

                {/* Display event location if available */}
                {event?.location?.coordinates && <EventMap coordinates={event.location.coordinates} title={event.title} />}

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                    <PrimaryButton onClick={handleJoin}>Join Event</PrimaryButton>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
