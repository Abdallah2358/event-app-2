import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function EventMap({ coordinates, title }) {
    if (!coordinates) return null;

    return (
        <MapContainer
            center={[coordinates[1], coordinates[0]]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%", marginTop: "1rem", borderRadius: "10px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates[1], coordinates[0]]}>
                <Popup>{title}</Popup>
            </Marker>
        </MapContainer>
    );
}
