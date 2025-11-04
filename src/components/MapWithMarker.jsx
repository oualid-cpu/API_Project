import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position == null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
}

export default function MapWithMarker({
  position,
  setPosition,
  height = "100%",
}) {
  const defaultPos = [51.505, -0.09];

  return (
    <MapContainer
      center={position || defaultPos}
      zoom={position ? 13 : 2}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
