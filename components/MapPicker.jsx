import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Inner component that handles click events
function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }) {
  const [showMap, setShowMap] = useState(false);
  const [selected, setSelected] = useState(
    initialLat ? { lat: initialLat, lng: initialLng } : null
  );

  // Try to get user's current location
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelected({ lat: latitude, lng: longitude });
        onLocationSelect(latitude, longitude);
      },
      () => alert('Location access denied. Please click on map instead.')
    );
  };

  const handleSelect = (lat, lng) => {
    setSelected({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-1 bg-blue-50 border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100"
        >
          📍 {showMap ? 'Hide Map' : 'Pin Location on Map'}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          className="flex items-center gap-1 bg-green-50 border border-green-300 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-100"
        >
          🎯 Use My Location
        </button>
      </div>

      {selected && (
        <p className="text-xs text-green-600 mb-2">
          ✓ Location set: {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
        </p>
      )}

      {showMap && (
        <div className="rounded-xl overflow-hidden border border-gray-300 mb-3" style={{ height: '280px' }}>
          <MapContainer
            center={selected ? [selected.lat, selected.lng] : [18.5204, 73.8567]} // Default: Pune
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onSelect={handleSelect} />
            {selected && <Marker position={[selected.lat, selected.lng]} />}
          </MapContainer>
          <p className="text-xs text-gray-500 text-center py-1 bg-gray-50">
            Click anywhere on the map to pin the complaint location
          </p>
        </div>
      )}
    </div>
  );
}