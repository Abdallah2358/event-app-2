import Modal from "@/Components/Modal";
import { formatDate } from "@/src/utils/date";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function EventModal({ event, isOpen, onClose }) {
    const [joined, setJoined] = useState(false);
    const { post } = useForm();
    event.start_date = formatDate(event.start_date);
    event.end_date = formatDate(event.end_date);
    const handleJoin = () => {
        post(route('event.join', event.id), {

        })
        setJoined(true);
        console.log("Joined event:", event.name);
    };

    const handleCancel = () => {
        setJoined(false);
        console.log("Cancelled event:", event.name);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <p className="text-gray-600">{event.start_date} - {event.end_date}</p>
                <p className="text-gray-600">{event.start_time} - {event.end_time}</p>
                <p className="text-gray-700">Days: {event.days}</p>
                <p className="text-gray-700">Capacity: {event.capacity}</p>
                <p className="text-gray-700">Waitlist: {event.wait_list_capacity}</p>
                <p className={`mt-2 text-sm font-semibold ${event.status === "live" ? "text-green-600" : "text-gray-500"}`}>
                    Status: {event.status}
                </p>

                <div className="mt-4 flex gap-3">
                    {!joined ? (
                        <button onClick={handleJoin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Join Event
                        </button>
                    ) : (
                        <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            Leave Event
                        </button>
                    )}
                    <button onClick={() => isOpen = false} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
