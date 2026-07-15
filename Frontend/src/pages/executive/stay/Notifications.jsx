import React from 'react';
import { Bell, Key, DollarSign, Sparkles, Wrench } from 'lucide-react';

const Notifications = () => {
  const notificationsData = [
    { title: 'New booking received from Amit Sharma (Room 101)', time: '10:30 AM', icon: Bell, color: 'text-blue-600 bg-blue-50' },
    { title: 'Guest Priya Patel checked-in (Room 202)', time: '09:45 AM', icon: Key, color: 'text-green-600 bg-green-50' },
    { title: 'Payment of ₹3,500 received from Room 202', time: '09:15 AM', icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { title: 'Housekeeping completed in Room 305', time: '08:30 AM', icon: Sparkles, color: 'text-blue-600 bg-blue-50' },
    { title: 'Maintenance request for Room 104', time: '08:15 AM', icon: Wrench, color: 'text-orange-600 bg-orange-50' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-805">
      
      {/* Notifications List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feed Logs</span>
          <button 
            onClick={() => {}}
            className="text-xs text-blue-600 font-extrabold hover:underline"
          >
            Mark all as read
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {notificationsData.map((n, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0 hover:bg-slate-50/40 transition-all px-2.5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${n.color}`}>
                  <n.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{n.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Stay Operational Feed Alert</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold block">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Notifications;
