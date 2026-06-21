import { useState, useEffect } from 'react';
import { getMyComplaints, submitComplaint, getDepartments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// FIX marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationSelector({ setLocation, fetchAddress }) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setLocation({ lat, lng });
      fetchAddress(lat, lng); // 🔥 address fetch
    },
  });
  return null;
}

export default function CitizenDashboard() {
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    departmentId: ''
  });

  const [photo, setPhoto] = useState(null);

  const [location, setLocation] = useState({ lat: null, lng: null });

  // 🔥 NEW: address state
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadComplaints();
    getDepartments().then(r => setDepartments(r.data));
  }, []);

  const loadComplaints = async () => {
    const res = await getMyComplaints();
    setComplaints(res.data);
  };

  // 🔥 FETCH ADDRESS
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name);
    } catch {
      console.log("Address fetch failed");
    }
  };

  // 🔥 CURRENT LOCATION
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });
        fetchAddress(lat, lng); // 🔥 address also
        toast.success("Location captured!");
      },
      () => toast.error("Location denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    if (location.lat && location.lng) {
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
    }

    // 🔥 SEND ADDRESS
    if (address) {
      formData.append('address', address);
    }

    if (photo) formData.append('photo', photo);

    try {
      await submitComplaint(formData);
      toast.success('Complaint submitted!');

      setShowForm(false);
      setForm({ title: '', description: '', category: '', departmentId: '' });
      setLocation({ lat: null, lng: null });
      setAddress(""); // reset

      loadComplaints();
    } catch {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-green-700 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Citizen Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="p-6">

        <button onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 mb-4">
          New Complaint
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3">

            <input placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="border p-2 w-full" required />

            <textarea placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border p-2 w-full" required />

            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="border p-2 w-full" required>
              <option value="">Category</option>
              <option>Garbage</option>
              <option>Pothole</option>
              <option>Street Light</option>
            </select>

            {/* 🔥 MAP */}
            <div className="h-64">
              <MapContainer center={[18.52, 73.85]} zoom={13} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <LocationSelector setLocation={setLocation} fetchAddress={fetchAddress} />

                {location.lat && (
                  <Marker position={[location.lat, location.lng]} />
                )}
              </MapContainer>
            </div>

            {/* 🔥 SHOW LOCATION */}
            {location.lat && (
              <p>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
            )}

            {/* 🔥 SHOW ADDRESS */}
            {address && (
              <p className="text-blue-600 text-sm">📍 {address}</p>
            )}

            <button type="button" onClick={getLocation}
              className="bg-blue-500 text-white px-3 py-2">
              Use Current Location
            </button>

            <button type="submit"
              className="bg-green-600 text-white px-3 py-2">
              Submit
            </button>

          </form>
        )}

      </div>
    </div>
  );
}