import { useState, useEffect } from 'react';
import { getAllComplaints, getWorkers, assignComplaint, getStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedWorker, setSelectedWorker] = useState({});

  useEffect(() => {
    getAllComplaints().then(r => setComplaints(r.data));
    getWorkers().then(r => setWorkers(r.data));
    getStats().then(r => setStats(r.data));
  }, []);

  const handleAssign = async (complaintId) => {
    const workerId = selectedWorker[complaintId];
    if (!workerId) return toast.error('Please select a worker');
    try {
      await assignComplaint(complaintId, workerId);
      toast.success('Assigned successfully!');
      getAllComplaints().then(r => setComplaints(r.data));
    } catch {
      toast.error('Assignment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏛️ Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span>Hello, {user?.name}</span>
          <button onClick={logout} className="bg-white text-purple-700 px-3 py-1 rounded font-semibold">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-orange-500' },
            { label: 'Resolved', value: stats.resolved, color: 'bg-green-500' },
          ].map(s => (
            <div key={s.label} className={`${s.color} text-white rounded-2xl p-5 text-center`}>
              <p className="text-3xl font-bold">{s.value ?? 0}</p>
              <p className="text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Complaints Table */}
        <h2 className="text-xl font-semibold mb-4">All Complaints</h2>
        <div className="space-y-4">
          {complaints.map(c => (
            <div key={c.id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    By: {c.citizen?.name} | Category: {c.category}
                  </p>
                </div>
                <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                  {c.status}
                </span>
              </div>

              {/* Assign Worker (only for PENDING complaints) */}
              {c.status === 'PENDING' && (
                <div className="flex gap-2 mt-3">
                  <select className="border rounded-lg px-3 py-2 text-sm flex-1"
                    value={selectedWorker[c.id] || ''}
                    onChange={e => setSelectedWorker({ ...selectedWorker, [c.id]: e.target.value })}>
                    <option value="">Select Worker</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  <button onClick={() => handleAssign(c.id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                    Assign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}