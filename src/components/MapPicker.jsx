import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./MapPicker.css";

// ✅ Fix icône Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) { onSelect(e.latlng); },
  });
  return null;
}

export default function MapPicker({ onLocationSelect, defaultPosition }) {
  const tunisieCenter        = [33.8869, 9.5375];
  const [position, setPos]   = useState(defaultPosition || null);
  const [address, setAddress]= useState("");

  const handleSelect = async (latlng) => {
    setPos(latlng);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await res.json();
      const addr = data.display_name || "";
      setAddress(addr);
      onLocationSelect?.({
        lat:     latlng.lat,
        lng:     latlng.lng,
        address: addr,
        city:    data.address?.city || data.address?.town || data.address?.village || "",
        region:  data.address?.state || "",
      });
    } catch {
      onLocationSelect?.({ lat: latlng.lat, lng: latlng.lng, address: "", city: "", region: "" });
    }
  };

  return (
    <div className="map-picker-wrapper">
      <div className="map-hint">
        📍 Cliquez sur la carte pour sélectionner votre terrain
      </div>

      <MapContainer
        center={tunisieCenter}
        zoom={7}
        className="map-container"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={handleSelect} />
        {position && (
          <Marker position={position}>
            <Popup>
              <strong>📍 Terrain sélectionné</strong><br />
              <small>{address}</small>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {position && (
        <div className="map-result">
          <span>✅</span>
          <div>
            <p><strong>Lat :</strong> {position.lat.toFixed(5)} | <strong>Lng :</strong> {position.lng.toFixed(5)}</p>
            {address && <p className="map-addr">{address}</p>}
          </div>
        </div>
      )}
    </div>
  );
}