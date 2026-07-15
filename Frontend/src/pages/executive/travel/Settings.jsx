import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Profile Settings');

  // Form states
  const [name, setName] = useState(user?.name || 'Arun Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState(user?.email || 'arun.kumar@example.com');
  const [designation, setDesignation] = useState('Travel Executive');

  const menuOptions = [
    'Profile Settings',
    'Company Settings',
    'System Settings',
    'Email Templates',
    'SMS Templates',
    'Change Password'
  ];

  const [saved, setSaved] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">

      {/* Save Toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl">
          ✓ Settings updated successfully!
        </div>
      )}

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Navigation Links */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm space-y-1.5 h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">Options</span>
          {menuOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveTab(opt)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === opt 
                  ? 'bg-blue-50 text-blue-650 font-extrabold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-slate-805 border-b border-slate-50 pb-3">{activeTab}</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 block">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 block">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 block">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 block">Designation</label>
                  <input 
                    type="text" 
                    value={designation}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2.5"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
