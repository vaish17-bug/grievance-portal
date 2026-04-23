import { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import { Link } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

export default function PublicDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => { getStats().then(r => setStats(r.data)); }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="bg-green-700 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">🏙️ City Grievance Portal</h1>
        <p className="mt-2 text-green-100">Transparency Dashboard — Live Statistics</p>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Complaints', value: stats.total, emoji: '📋' },
            { label: 'Pending', value: stats.pending, emoji: '⏳' },
            { label: 'In Progress', value: stats.inProgress, emoji: '🔧' },
            { label: 'Resolved', value: stats.resolved, emoji: '✅' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-4xl mb-2">{s.emoji}</p>
              <p className="text-3xl font-bold text-green-700">{s.value ?? 0}</p>
              <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/login" className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 inline-block">
            Login to Submit a Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}