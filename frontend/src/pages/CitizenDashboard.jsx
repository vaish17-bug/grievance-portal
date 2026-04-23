import { useState, useEffect } from 'react';
import { getMyComplaints, submitComplaint, getDepartments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', departmentId: '' });
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

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
    if (photo) formData.append('photo', photo);

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
              <select className="w-full border rounded-lg p-3"
                value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
                className="w-full border rounded-lg p-3" />
              <button type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                Submit Complaint
              </button>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.length === 0 && (
            <p className="text-center text-gray-500 py-8">No complaints yet. Click + New Complaint to get started.</p>
          )}
          {complaints.map(c => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}