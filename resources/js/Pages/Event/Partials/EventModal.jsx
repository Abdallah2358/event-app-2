import Modal from "@/Components/Modal";
import { formatDate } from "@/src/utils/date";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
export default function EventModal({ event, isOpen, onClose }) {
    const [joined, setJoined] = useState(false);
    // const { flash } = usePage().props; // Get flash messages
    const { errors, flash } = usePage().props; // Get errors and flash messages
    const { post } = useForm();
    event.start_date = formatDate(event.start_date);
    event.end_date = formatDate(event.end_date);
    const handleJoin = () => {
        post(route('events.join', event.id), {
            onSuccess: (data) => {
                onClose();
                console.log('data', data);
                console.log('flash', flash);
                if (flash?.success) {
                    toast.success(flash.success);
                }
            },
            onError: (errors) => {
                onClose();
                if (errors?.already_joined) {
                    return toast.error(errors.already_joined);
                }
                if (errors?.not_available) {
                    return toast.error(errors.not_available);
                }
                if (errors?.overlaps_with_other_events) {
                    return toast.error(errors.overlaps_with_other_events);
                }
                if (errors?.no_capacity) {
                    toast.error(errors.no_capacity);
                    toast.loading("Joining wait list...", { id: "wait-list" });
                    post(route('events.join-wait-list', event.id), {
                        onSuccess: () => {
                            toast.success("You've been added to the wait list!", { id: "wait-list" });
                        },
                        onError: (errors) => {
                            if (errors?.overlaps_with_other_events) {
                                return toast.error(errors.overlaps_with_other_events, { id: "wait-list" });
                            }
                            if (errors?.already_joined) {
                                return toast.error(errors.already_joined, { id: "wait-list" });
                            }
                            if (errors?.not_available) {
                                toast.error(errors.not_available, { id: "wait-list" });
                            }
                            if (errors?.no_wait_list_capacity) {
                                toast.error(errors.no_wait_list_capacity, { id: "wait-list" });
                            }
                        }
                    });
                }
            },
            // errorBag: 'joinEvent',
        })

    };

    const handleCancel = () => {
        setJoined(false);
        console.log("Cancelled event:", event.name);
    };
    // const position = [51.505, -0.09]
    // const map = L.map('map').setView([51.505, -0.09], 13);
    console.log((event.location.coordinates));

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
                {/* <Map
                    mapboxAccessToken="<Mapbox access token>"
                    initialViewState={{
                        longitude: -122.4,
                        latitude: 37.8,
                        zoom: 14
                    }}
                    style={{ width: 600, height: 400 }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                /> */}

                {event?.location?.coordinates && (
                    <MapContainer center={[event.location.coordinates[1], event.location.coordinates[0]]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[event.location.coordinates[1], event.location.coordinates[0]]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}


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
                    <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
