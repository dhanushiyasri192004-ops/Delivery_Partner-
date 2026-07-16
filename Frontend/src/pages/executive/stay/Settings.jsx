import React, { useState } from 'react';
import { ChevronRight, LogOut, User, Lock, Bell, Shield, Globe, Save, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Stay Executive');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'stay_exec@test.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileDept, setProfileDept] = useState('Front Office');

  // Active Tab State for Settings
  const [activeTab, setActiveTab] = useState('general');

  // General Settings State
  const [hotelName, setHotelName] = useState('Stay Executive Connected');
  const [timezone, setTimezone] = useState('(GMT+05:30) Chennai, Kolkata, Mumbai');
  const [currency, setCurrency] = useState('INR (₹)');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Privacy State
  const [profilePublic, setProfilePublic] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Language State
  const [lang, setLang] = useState('English');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const menuItems = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  const initials = profileName.substring(0, 1).toUpperCase();

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-855">
      
      {/* Horizontal Tabs Row */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                  activeTab === item.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-extrabold' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-red-150 bg-red-50/50 hover:bg-red-50 text-red-650 transition-all sm:ml-auto"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Profile Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-5">
            <div className="w-20 h-20 bg-emerald-100 border-4 border-white shadow text-emerald-700 font-black text-3xl rounded-full flex items-center justify-center">
              {initials}
            </div>

            {isEditingProfile ? (
              <div className="w-full space-y-3 text-left">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Department</label>
                  <input
                    type="text"
                    value={profileDept}
                    onChange={(e) => setProfileDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-xl"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 border border-slate-200 text-slate-500 text-xs font-bold py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">{profileName}</h3>
                  <span className="text-[10px] font-extrabold text-slate-400 block mt-1 uppercase tracking-wider">Stay Executive</span>
                </div>

                <div className="w-full text-xs font-semibold text-slate-700 space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                    <span className="text-slate-400">Email</span>
                    <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{profileEmail}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                    <span className="text-slate-400">Phone</span>
                    <span className="font-extrabold text-slate-800">{profilePhone}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                    <span className="text-slate-400">Department</span>
                    <span className="font-extrabold text-slate-800">{profileDept}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Joined On</span>
                    <span className="font-extrabold text-slate-800">01 Jan 2026</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

        </div>

        {/* Right Column: Settings Card Container */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[480px] flex flex-col justify-between">
            
            {/* Tab Form Content */}
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {activeTab === 'general' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-700">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-805">General Settings</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure property metadata and regional variables.</p>
                  </div>
                  
                  <div className="space-y-3.5 pt-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Hotel / Property Name</label>
                      <input
                        type="text"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">System Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="(GMT+05:30) Chennai, Kolkata, Mumbai">(GMT+05:30) Chennai, Kolkata, Mumbai</option>
                        <option value="(GMT+00:00) UTC / London">(GMT+00:00) UTC / London</option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Currency Symbol</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-700">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-805">Change Password</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Keep your portal access credentials secure.</p>
                  </div>
                  
                  <div className="space-y-3.5 pt-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-700">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-805">Notification Settings</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure your operational notification channels.</p>
                  </div>
                  
                  <div className="space-y-4 pt-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Email Notifications</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">Receive booking logs and invoice summaries.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Push Web Notifications</h4>
                        <p className="text-[10px] text-slate-455 mt-0.5">Alerts for cleaning duties and technical complaints.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={pushAlerts}
                        onChange={(e) => setPushAlerts(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">SMS Messages</h4>
                        <p className="text-[10px] text-slate-455 mt-0.5">Get urgent updates regarding checkout schedules.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-700">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-805">Privacy & Security</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Manage portal access credentials and security settings.</p>
                  </div>
                  
                  <div className="space-y-4 pt-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Two-Factor Authentication</h4>
                        <p className="text-[10px] text-slate-455 mt-0.5">Verify your login attempt with a secure code sent to your phone.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Make Profile Visible</h4>
                        <p className="text-[10px] text-slate-455 mt-0.5">Let team technicians and room cleaners search your contact.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profilePublic}
                        onChange={(e) => setProfilePublic(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button Row */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {saveSuccess ? (
                  <span className="text-emerald-600 font-extrabold text-[11px] flex items-center gap-1">
                    <Check className="h-4 w-4" /> Settings updated successfully!
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Changes will apply immediately</span>
                )}
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5"
                >
                  Save Settings
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
