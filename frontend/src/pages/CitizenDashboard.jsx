import { useState, useEffect } from 'react';
import { getMyComplaints, submitComplaint, getDepartments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import RatingModal from '../components/RatingModal';
import NotificationBell from '../components/NotificationBell';
import MapPicker from '../components/MapPicker';
import MapView from '../components/MapView';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function CitizenDashboard() {
  const [search, setSearch] = useState('');
const [filterStatus, setFilterStatus] = useState('ALL');
  const [ratingComplaint, setRatingComplaint] = useState(null);
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  //const [form, setForm] = useState({ title: '', description: '', category: '', departmentId: '' });
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

const [form, setForm] = useState({
  title: '', description: '', category: '', departmentId: '',
  latitude: null, longitude: null  // ← Add these
});

// Handler for multiple photos
const handlePhotoChange = (e) => {
  const files = Array.from(e.target.files);
  setPhotos(files);
  const previews = files.map(f => URL.createObjectURL(f));
  setPhotoPreviews(previews);
};
 const filtered = complaints.filter(c => {
  const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                      c.description.toLowerCase().includes(search.toLowerCase());
  const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
  return matchSearch && matchStatus;
});
  useEffect(() => {
    loadComplaints();
    getDepartments().then(r => setDepartments(r.data));
  }, []);

  const loadComplaints = async () => {
    const res = await getMyComplaints();
    setComplaints(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (photo) photos.forEach(p => formData.append('photos', p));

    try {
      await submitComplaint(formData);
      toast.success('Complaint submitted!');
      setShowForm(false);
      setForm({ title: '', description: '', category: '', departmentId: '' });
      loadComplaints();
    } catch {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏛️ Citizen Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span>Hello, {user?.name}</span>
          <button onClick={logout} className="bg-white text-green-700 px-3 py-1 rounded font-semibold">Logout</button>
          <NotificationBell />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Complaints ({complaints.length})</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + New Complaint
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="w-full border rounded-lg p-3" placeholder="Title"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea className="w-full border rounded-lg p-3" placeholder="Description" rows={3}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <select className="w-full border rounded-lg p-3"
                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select Category</option>
                {['Garbage', 'Pothole', 'Street Light', 'Water Supply', 'Drainage', 'Other'].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
              <MapPicker
         onLocationSelect={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
         />
         <MapView lat={c.latitude} lng={c.longitude} title={c.title} />
              <select className="w-full border rounded-lg p-3"
                value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Attach Photos (up to 5)
  </label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handlePhotoChange}
    className="w-full border rounded-lg p-3"
  />
  {/* Preview thumbnails */}
  {photoPreviews.length > 0 && (
    <div className="flex gap-2 mt-2 flex-wrap">
      {photoPreviews.map((src, i) => (
        <div key={i} className="relative">
          <img src={src} alt={`preview-${i}`}
            className="w-20 h-20 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={() => {
              setPhotos(prev => prev.filter((_, idx) => idx !== i));
              setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
            }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >✕</button>
        </div>
      ))}
    </div>
  )}
</div>
              <button type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                Submit Complaint
              </button>
            </form>
          </div>
        )}
        <div className="flex gap-3 mb-4 flex-wrap">
  <input
    placeholder="🔍 Search complaints..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="border rounded-lg px-4 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  <select
    value={filterStatus}
    onChange={e => setFilterStatus(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="ALL">All Status</option>
    {['PENDING','ASSIGNED','IN_PROGRESS','RESOLVED','REJECTED'].map(s =>
      <option key={s} value={s}>{s}</option>
    )}
  </select>
</div>
        {/* Complaints List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8">No complaints yet. Click + New Complaint to get started.</p>
          )}
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                  <p className="text-gray-400 text-xs mt-2">Category: {c.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                  {c.status}
                </span>
              </div>
              {c.photoUrl && (
                <img src={`http://localhost:8080${c.photoUrl}`} alt="complaint"
                  className="mt-3 rounded-lg max-h-40 object-cover" />
              )}
              {/* Rating button — only shows for RESOLVED complaints */}
{c.status === 'RESOLVED' && (
  <button
    onClick={() => setRatingComplaint(c)}
    style={{
      marginTop: '10px', padding: '6px 14px',
      background: '#fef3c7', color: '#92400e',
      border: '1px solid #fcd34d', borderRadius: '8px',
      fontSize: '13px', cursor: 'pointer'
    }}
  >
    ⭐ Rate this resolution
  </button>
)}
             {ratingComplaint && (
  <RatingModal
    complaint={ratingComplaint}
    onClose={() => setRatingComplaint(null)}
    onRated={loadComplaints}
  />
)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}