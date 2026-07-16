import React, { useState } from 'react';
import { Bell, Key, DollarSign, Sparkles, Wrench, Trash2, Check, CheckCheck, Search, SlidersHorizontal } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New booking received from Amit Sharma (Room 101)', time: '10:30 AM', category: 'bookings', icon: Bell, color: 'text-blue-600 bg-blue-50', read: false },
    { id: 2, title: 'Guest Priya Patel checked-in (Room 202)', time: '09:45 AM', category: 'checkins', icon: Key, color: 'text-emerald-600 bg-emerald-50', read: false },
    { id: 3, title: 'Payment of ₹3,500 received from Room 202', time: '09:15 AM', category: 'payments', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', read: true },
    { id: 4, title: 'Housekeeping completed in Room 305', time: '08:30 AM', category: 'housekeeping', icon: Sparkles, color: 'text-blue-600 bg-blue-50', read: true },
    { id: 5, title: 'Maintenance request for Room 104', time: '08:15 AM', category: 'maintenance', icon: Wrench, color: 'text-orange-600 bg-orange-50', read: false }
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    return activeTab === 'all' || n.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'all', label: 'All Notifications', icon: null },
    { id: 'bookings', label: 'Bookings', icon: Bell },
    { id: 'checkins', label: 'Check-ins', icon: Key },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-855">
      
      {/* Filters and Search Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const count = tab.id === 'all' 
              ? notifications.length 
              : notifications.filter(n => n.category === tab.id).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-extrabold' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {TabIcon && <TabIcon className="h-3.5 w-3.5" />}
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end ml-auto">
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              unreadCount > 0 
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md' 
                : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Showing {filteredNotifications.length} logs
          </span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-extrabold text-slate-700 text-sm">No notifications found</h3>
            <p className="text-slate-400 text-xs mt-1">Try clearing your filters or changing your search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={`flex justify-between items-center p-5 hover:bg-slate-50/70 transition-all gap-4 ${
                  !n.read ? 'bg-blue-50/25' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Status Indicator */}
                  <div className="w-2 h-2 flex-shrink-0 rounded-full bg-blue-600" style={{ visibility: n.read ? 'hidden' : 'visible' }} />

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${n.color}`}>
                    <n.icon className="h-5 w-5" />
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs ${!n.read ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-650'}`}>
                      {n.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      {n.category.charAt(0).toUpperCase() + n.category.slice(1)} • Stay Operational Feed Alert
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{n.time}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        n.read 
                          ? 'border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50' 
                          : 'border-blue-105 bg-blue-50/30 text-blue-600 hover:bg-blue-50'
                      }`}
                      title={n.read ? "Mark as unread" : "Mark as read"}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all"
                      title="Delete log"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
