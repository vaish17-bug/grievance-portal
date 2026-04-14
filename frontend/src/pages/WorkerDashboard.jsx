import { useState, useEffect } from 'react';
import { getWorkerTasks, updateComplaintStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const res = await getWorkerTasks();
    setTasks(res.data);
  };

  const handleStatus = async (complaintId, status) => {
    try {
      await updateComplaintStatus(complaintId, status, `Marked as ${status} by worker`);
      toast.success('Status updated!');
      loadTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">👷 Worker Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span>Hello, {user?.name}</span>
          <button onClick={logout} className="bg-white text-blue-700 px-3 py-1 rounded font-semibold">Logout</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Assigned Tasks ({tasks.length})</h2>
        <div className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-gray-500 py-8">No tasks assigned yet.</p>}
          {tasks.map(t => (
            <div key={t.id} className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold text-lg">{t.complaint.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{t.complaint.description}</p>
              <p className="text-gray-400 text-xs mt-2">Category: {t.complaint.category}</p>
              <p className="text-gray-400 text-xs">
                SLA Deadline: {new Date(t.slaDeadline).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2 font-medium">
                Status: <span className="text-orange-600">{t.complaint.status}</span>
              </p>
              {t.complaint.status !== 'RESOLVED' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleStatus(t.complaint.id, 'IN_PROGRESS')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                    Mark In Progress
                  </button>
                  <button onClick={() => handleStatus(t.complaint.id, 'RESOLVED')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                    Mark Resolved ✓
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