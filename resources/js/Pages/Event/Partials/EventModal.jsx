import EventMap from "@/Components/EventMap";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { formatDate } from "@/src/utils/date";
import { useForm, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { toast } from 'react-hot-toast';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

/**
 * EventModal Component - Displays event details in a modal, allowing users to join or leave an event.
 *
 * @param {Object} props - Component props
 * @param {Object} props.event - Event details
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 */
export default function EventModal({ event, isOpen, onClose }) {
    const [joined, setJoined] = useState(false);

    // Extract errors and flash messages from Inertia.js
    const { flash } = usePage().props;
    const { post } = useForm();
    event = useMemo(() => ({
        ...event,
        start_date: formatDate(event.start_date),
        end_date: formatDate(event.end_date),
    }), [event]);

    const handleJoinErrors = (errors) => {
        if (errors?.already_joined) return toast.error(errors.already_joined);
        if (errors?.not_available) return toast.error(errors.not_available);
        if (errors?.overlaps_with_other_events) return toast.error(errors.overlaps_with_other_events);
        return null;
    };
    /**
     * Handles joining an event.
     * Posts a request to join and provides user feedback via toast notifications.
     */
    const handleJoin = () => {
        post(route('events.join', event.id), {
            onSuccess: (data) => {
                onClose(); // Close modal on success
                console.log('data', data);
                console.log('flash', flash);
                if (flash?.success) {
                    toast.success(flash.success);
                }
            },
            onError: (errors) => {
                onClose();
                if (handleJoinErrors(errors)) return;
                if (errors?.no_capacity) {
                    toast.error(errors.no_capacity);
                    toast.loading("Joining waitlist...", { id: "wait-list" });

                    // Attempt to join the waitlist if the event is full
                    // Attempt to join the waitlist
                    post(route('events.join-wait-list', event.id), {
                        onSuccess: () => toast.success("You've been added to the waitlist!", { id: "wait-list" }),
                        onError: (errors) => { toast.dismiss({ id: "wait-list" }); handleJoinErrors(errors); }, // Reuse the same function
                    });
                }
            }
        });
    };


    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                {/* Event Title & Date */}
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <p className="text-gray-600">{event.start_date} - {event.end_date}</p>
                <p className="text-gray-600">{event.start_time} - {event.end_time}</p>

                {/* Event Details */}
                <p className="text-gray-700">Days: {event.days}</p>
                <p className="text-gray-700">Capacity: {event.capacity}</p>
                <p className="text-gray-700">Waitlist: {event.wait_list_capacity}</p>
                <p className={`mt-2 text-sm font-semibold ${event.status === "live" ? "text-green-600" : "text-gray-500"}`}>
                    Status: {event.status}
                </p>

                {/* Display event location if available */}
                {event?.location?.coordinates && (
                    <EventMap coordinates={event.location.coordinates} title={event.title} />
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                    <PrimaryButton
                        onClick={handleJoin}
                        className=""
                    >
                        Join Event
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={onClose}
                        className=""
                    >
                        Close
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
