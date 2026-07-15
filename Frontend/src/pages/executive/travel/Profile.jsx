import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, Shield, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">

      {/* Profile Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-blue-50 border-4 border-white shadow-md text-blue-600 font-black text-4xl rounded-full flex items-center justify-center">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'TE'}
        </div>
        
        <div>
          <h3 className="text-lg font-black text-slate-800">{user?.name || 'Arun Kumar'}</h3>
          <span className="text-xs font-bold text-blue-600 block mt-1.5 uppercase tracking-wider">Travel Executive</span>
        </div>

        <div className="w-full border-t border-slate-100 pt-6 space-y-4 text-xs font-semibold text-slate-600 text-left">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
            <Mail className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Email Address</span>
              <span className="text-slate-800">{user?.email || 'arun.kumar@example.com'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
            <Phone className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Mobile Number</span>
              <span className="text-slate-800">9876543210</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
            <Briefcase className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Designation</span>
              <span className="text-slate-800">Travel Executive</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Role Permission</span>
              <span className="text-slate-800 capitalize">{user?.role || 'Executive'}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
