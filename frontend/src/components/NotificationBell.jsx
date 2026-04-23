import { useState, useEffect } from 'react';
import { getNotifications, getUnreadCount, markNotificationsRead } from '../services/api';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const res = await getUnreadCount();
      setCount(res.data.count);
    } catch {}
  };

  const togglePanel = async () => {
    if (!open) {
      const res = await getNotifications();
      setNotifications(res.data);
      if (count > 0) {
        await markNotificationsRead();
        setCount(0);
      }
    }
    setOpen(!open);
  };

  const TYPE_ICONS = {
    NEW_COMPLAINT: '📋',
    ASSIGNED: '👷',
    STATUS_UPDATE: '🔄',
    RESOLVED: '✅',
  };

  return (
    <div className="relative">
      <button onClick={togglePanel} className="relative p-2 rounded-full hover:bg-white/20">
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold text-gray-700 flex justify-between">
            <span>Notifications</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-400 text-sm">No notifications yet</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-3 border-b hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
                <p className="text-sm text-gray-700">
                  {TYPE_ICONS[n.type] || '📢'} {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}