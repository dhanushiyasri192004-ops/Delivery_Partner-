import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { markAllRead } from '../../../redux/slices/notificationSlice';
import { Bell, CreditCard, AlertTriangle, Clock, XCircle, CheckCircle } from 'lucide-react';

const iconMap = {
  CheckCircle: CheckCircle,
  CreditCard: CreditCard,
  AlertTriangle: AlertTriangle,
  Clock: Clock,
  XCircle: XCircle,
  Bell: Bell
};

const Notifications = () => {
  const dispatch = useDispatch();

  const initialNotifications = [
    { id: 1, title: 'New booking PNR12387 received for Chennai → Coimbatore', time: '3 min ago', iconType: 'CheckCircle', style: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 2, title: 'Payment received for PNR12345', time: '15 min ago', iconType: 'CreditCard', style: 'bg-green-50 text-green-600 border-green-100' },
    { id: 3, title: 'Bus TH01 AB 1234 is delayed by 30 minutes', time: '1 hour ago', iconType: 'AlertTriangle', style: 'bg-yellow-50 text-yellow-750 border-yellow-100' },
    { id: 4, title: 'Schedule SCH002 has been updated', time: '2 hours ago', iconType: 'Clock', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { id: 5, title: 'Booking PNR12349 has been cancelled', time: '3 hours ago', iconType: 'XCircle', style: 'bg-red-50 text-red-700 border-red-100' }
  ];

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('travel_notifications');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_notifications', JSON.stringify(initialNotifications));
    return initialNotifications;
  });

  const handleClear = () => {
    localStorage.setItem('travel_notifications', JSON.stringify([]));
    setNotifications([]);
    dispatch(markAllRead());
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">

      {notifications.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleClear}
            className="text-xs text-blue-600 hover:underline font-bold"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const Icon = iconMap[n.iconType] || Bell;
              return (
                <div key={n.id} className="flex gap-4 py-4.5 first:pt-1 last:pb-1 items-start">
                  <div className={`p-2.5 rounded-xl border ${n.style} shrink-0`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <span className="text-[10px] text-slate-400 font-bold block">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs font-bold space-y-3">
            <Bell className="h-10 w-10 mx-auto text-slate-300" />
            <p>All notifications read. No new alerts!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
