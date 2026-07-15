import React from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const settingsOptions = [
    'General Settings',
    'Change Password',
    'Notification Settings',
    'Privacy Settings',
    'Language Settings'
  ];

  const displayName = user?.name || 'Rajesh Kumar';
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in text-slate-800">

      {/* Profile card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 border-4 border-white shadow text-emerald-700 font-black text-3xl rounded-full flex items-center justify-center">
          {initials}
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-800">{displayName}</h3>
          <span className="text-xs font-bold text-slate-400 block mt-1 uppercase tracking-wider">Stay Executive</span>
        </div>

        <div className="w-full text-xs font-semibold text-slate-700 space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
            <span className="text-slate-400">Email</span>
            <span className="font-extrabold text-slate-800">{user?.email || 'rajesh.kumar@stayconnect.com'}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
            <span className="text-slate-400">Phone</span>
            <span className="font-extrabold text-slate-800">+91 98765 43210</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
            <span className="text-slate-400">Department</span>
            <span className="font-extrabold text-slate-800">Front Office</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Joined On</span>
            <span className="font-extrabold text-slate-800">01 Jan 2026</span>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow active:scale-95 text-xs uppercase tracking-wider"
        >
          Edit Profile
        </button>
      </div>

      {/* Settings list */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 font-semibold text-xs text-slate-700">
        <h3 className="font-extrabold text-sm text-slate-800 pb-1">Settings</h3>
        <div className="divide-y divide-slate-100">
          {settingsOptions.map((opt) => (
            <div
              key={opt}
              onClick={() => {}}
              className="flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 transition-all px-2.5 rounded-xl border border-transparent hover:border-slate-100"
            >
              <span className="font-extrabold text-slate-800">{opt}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          ))}

          <div
            onClick={handleLogoutClick}
            className="flex justify-between items-center py-4 cursor-pointer hover:bg-red-50/50 text-red-600 transition-all px-2.5 rounded-xl border border-transparent"
          >
            <span className="font-extrabold text-red-600">Logout</span>
            <LogOut className="h-4 w-4 text-red-400" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
