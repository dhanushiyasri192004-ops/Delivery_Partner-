import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Bell, 
  Shield, 
  MapPin, 
  Volume2, 
  ChevronRight, 
  Smartphone,
  Check
} from 'lucide-react';
import { updateOnlineStatus } from '../../redux/slices/deliverySlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const deliveryState = useSelector((state) => state.delivery || {});
  const isOnline = deliveryState.partnerStatus === 'online';

  // Toggle Preferences States
  const [pushNotif, setPushNotif] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [gpsInterval, setGpsInterval] = useState('High Accuracy (15s)');
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('Preferences');
  const [savedMessage, setSavedMessage] = useState('');

  const handleToggleOnline = () => {
    const nextStatus = isOnline ? 'offline' : 'online';
    dispatch(updateOnlineStatus(nextStatus));
    triggerSaveToast('Duty status updated!');
  };

  const triggerSaveToast = (msg) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-slate-805 animate-fade-in">
      
      {/* Save Toast notification */}
      {savedMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl">
          <Check className="h-4.5 w-4.5 flex-shrink-0" />
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Navigation Links */}
        <div className="md:col-span-4 bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm h-fit space-y-1.5 font-bold text-xs text-slate-600">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">Category</span>
          {[
            { id: 'Preferences', label: 'App Preferences', icon: Smartphone },
            { id: 'Duty', label: 'Duty Settings', icon: MapPin },
            { id: 'Notifications', label: 'Alert Preferences', icon: Bell },
            { id: 'Security', label: 'Security & Pin', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-100 text-blue-700 font-black shadow-sm' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                </span>
                <ChevronRight className={`h-4 w-4 ${isActive ? 'text-blue-550' : 'text-slate-350'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Options Panel Details */}
        <div className="md:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm min-h-[300px]">
          
          {activeTab === 'Preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-805 text-sm">App Preferences</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Customize daily operations and UI behaviors</p>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {/* Auto Accept */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800">Auto-Accept Orders</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Automatically accept incoming delivery requests matching your location</p>
                  </div>
                  <button 
                    onClick={() => { setAutoAccept(!autoAccept); triggerSaveToast('Auto-accept setting updated'); }}
                    className={`w-11 h-6.5 rounded-full p-1 transition-all ${autoAccept ? 'bg-blue-600 flex justify-end' : 'bg-slate-200 flex justify-start'}`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"></span>
                  </button>
                </div>

                {/* Dark Mode switcher placeholder */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800">Dark Mode</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Switch to dark interface to conserve battery life during night deliveries</p>
                  </div>
                  <button 
                    onClick={() => triggerSaveToast('Dark mode is controlled automatically by your system configuration.')}
                    className="w-11 h-6.5 rounded-full p-1 bg-slate-200 flex justify-start transition-all"
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"></span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Duty' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-805 text-sm">Duty Settings</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Configure tracking telemetry and working status</p>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {/* Duty toggle status */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800">Duty Status</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Mark yourself offline when taking breaks or finishing shifts</p>
                  </div>
                  <button 
                    onClick={handleToggleOnline}
                    className={`w-11 h-6.5 rounded-full p-1 transition-all ${isOnline ? 'bg-green-600 flex justify-end' : 'bg-slate-200 flex justify-start'}`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"></span>
                  </button>
                </div>

                {/* GPS update frequency */}
                <div className="flex justify-between items-center pt-4 text-xs font-semibold">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800">GPS Ping Interval</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Higher accuracy consumes more battery power</p>
                  </div>
                  <select 
                    value={gpsInterval}
                    onChange={(e) => { setGpsInterval(e.target.value); triggerSaveToast('GPS Interval updated!'); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-705 focus:outline-none"
                  >
                    <option>High Accuracy (15s)</option>
                    <option>Standard (30s)</option>
                    <option>Eco Mode (60s)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-805 text-sm">Alert Preferences</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Configure system sounds, push alerts and SMS alerts</p>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800">Push Notifications</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Receive instant banners when new orders are assigned</p>
                  </div>
                  <button 
                    onClick={() => { setPushNotif(!pushNotif); triggerSaveToast('Banners preference updated'); }}
                    className={`w-11 h-6.5 rounded-full p-1 transition-all ${pushNotif ? 'bg-blue-600 flex justify-end' : 'bg-slate-200 flex justify-start'}`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"></span>
                  </button>
                </div>

                {/* Sound Alerts */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Volume2 className="h-4 w-4 text-blue-500" /> Ringtone Sound Alerts
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold">Play a loud ringtone sound when a new order is waiting</p>
                  </div>
                  <button 
                    onClick={() => { setSoundAlerts(!soundAlerts); triggerSaveToast('Sound preferences updated'); }}
                    className={`w-11 h-6.5 rounded-full p-1 transition-all ${soundAlerts ? 'bg-blue-600 flex justify-end' : 'bg-slate-200 flex justify-start'}`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"></span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6 text-xs font-semibold">
              <div>
                <h3 className="font-extrabold text-slate-805 text-sm">Security &amp; PIN</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Verify and update secure portal password credentials</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 8 characters" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => triggerSaveToast('Password updated successfully!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl transition-all shadow-sm shadow-blue-100 active:scale-95 text-xs uppercase tracking-wider"
                >
                  Update Credentials
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
