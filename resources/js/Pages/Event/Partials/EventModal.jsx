import Modal from "@/Components/Modal";
import { formatDate } from "@/src/utils/date";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
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
    const { errors, flash } = usePage().props;
    const { post } = useForm();

    // Format event dates for display
    event.start_date = formatDate(event.start_date);
    event.end_date = formatDate(event.end_date);

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
                
                // Handle different error scenarios
                if (errors?.already_joined) return toast.error(errors.already_joined);
                if (errors?.not_available) return toast.error(errors.not_available);
                if (errors?.overlaps_with_other_events) return toast.error(errors.overlaps_with_other_events);
                
                if (errors?.no_capacity) {
                    toast.error(errors.no_capacity);
                    toast.loading("Joining waitlist...", { id: "wait-list" });
                    
                    // Attempt to join the waitlist if the event is full
                    post(route('events.join-wait-list', event.id), {
                        onSuccess: () => {
                            toast.success("You've been added to the waitlist!", { id: "wait-list" });
                        },
                        onError: (errors) => {
                            toast.dismiss({ id: "wait-list" });
                            if (errors?.overlaps_with_other_events) return toast.error(errors.overlaps_with_other_events, { id: "wait-list" });
                            if (errors?.already_joined) return toast.error(errors.already_joined, { id: "wait-list" });
                            if (errors?.not_available) return toast.error(errors.not_available, { id: "wait-list" });
                            if (errors?.no_wait_list_capacity) return toast.error(errors.no_wait_list_capacity, { id: "wait-list" });
                        }
                    });
                }
            }
        });
    };

    /**
     * Handles canceling an event action.
     * Currently, it resets the joined state.
     */
    const handleCancel = () => {
        setJoined(false);
        console.log("Cancelled event:", event.name);
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
                    <MapContainer 
                        center={[event.location.coordinates[1], event.location.coordinates[0]]} 
                        zoom={13} 
                        scrollWheelZoom={false}
                        style={{ height: "300px", width: "100%", marginTop: "1rem", borderRadius: "10px" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[event.location.coordinates[1], event.location.coordinates[0]]}>
                            <Popup>{event.title}</Popup>
                        </Marker>
                    </MapContainer>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                    {!joined ? (
                        <button 
                            onClick={handleJoin} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Join Event
                        </button>
                    ) : (
                        <button 
                            onClick={handleCancel} 
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Leave Event
                        </button>
                    )}
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
