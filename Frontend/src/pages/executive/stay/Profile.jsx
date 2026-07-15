import React from 'react';

const Profile = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in text-slate-800">
      
      {/* Main card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center space-y-6">
        {/* Big initial avatar circle */}
        <div className="w-20 h-20 bg-emerald-100 border-4 border-white shadow text-emerald-700 font-black text-3xl rounded-full flex items-center justify-center">
          R
        </div>
        
        <div>
          <h3 className="text-lg font-black text-slate-800">Rajesh Kumar</h3>
          <span className="text-xs font-bold text-slate-405 block mt-1 uppercase tracking-wider">Stay Executive</span>
        </div>

        {/* Detailed List */}
        <div className="w-full text-xs font-semibold text-slate-700 space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
            <span className="text-slate-400">Email</span>
            <span className="font-extrabold text-slate-800">rajesh.kumar@stayconnect.com</span>
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
          className="w-full bg-blue-650 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow shadow-blue-105 active:scale-95 text-xs uppercase tracking-wider"
        >
          Edit Profile
        </button>

      </div>

    </div>
  );
};

export default Profile;
