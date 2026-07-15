import React from 'react';
import { useSelector } from 'react-redux';
import { User as UserIcon, Shield, FileText } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* 1. Header Profile Banner Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row gap-6 items-center">
        
        {/* Avatar Circle */}
        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-amber-400 flex items-center justify-center text-slate-500 font-black text-3xl uppercase shadow-inner flex-shrink-0">
          {user?.name?.charAt(0) || 'D'}
        </div>

        {/* Profile info details */}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{user?.name || 'Dhanu'}</h3>
          <p className="text-xs text-slate-400 font-semibold capitalize">{user?.role?.replace('_', ' ') || 'Delivery Partner'} Partner</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1.5">
            <span className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Approved
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Registered since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '7/9/2026'}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Credentials and details grid split cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Personal Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <UserIcon className="h-4.5 w-4.5 text-blue-600" />
            <h4 className="font-bold text-slate-805 text-xs uppercase tracking-wider">Personal Credentials</h4>
          </div>
          
          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-450 font-semibold">Email Address</span>
              <span className="font-black text-slate-700">{user?.email || 'dhanushiya@gmail.com'}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-450 font-semibold">Mobile Number</span>
              <span className="font-black text-slate-700">{user?.mobileNumber || '+91 98765 43210'}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-450 font-semibold">Aadhaar Number</span>
              <span className="font-black text-slate-750">•••• •••• {profile?.aadhaarNumber ? profile.aadhaarNumber.slice(-4) : '5656'}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-450 font-semibold">PAN Number</span>
              <span className="font-black text-slate-750 uppercase">{profile?.panNumber || 'PAN54337'}</span>
            </div>
          </div>
        </div>

        {/* Right Card: Vehicle & Registration */}
        {user?.role === 'delivery_partner' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Shield className="h-4.5 w-4.5 text-blue-650" />
              <h4 className="font-bold text-slate-805 text-xs uppercase tracking-wider">Vehicle &amp; Registration</h4>
            </div>
            
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-450 font-semibold">Vehicle Name</span>
                <span className="font-black text-slate-700 capitalize">{profile?.vehicle?.name || 'bike'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-450 font-semibold">License Plate</span>
                <span className="font-black text-slate-755 uppercase">{profile?.vehicle?.number || 'KA-12-AB-2342'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-450 font-semibold">License Number</span>
                <span className="font-black text-slate-755 uppercase">{profile?.vehicle?.licenseNumber || '345765756867'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-450 font-semibold">RC Book Proof</span>
                <a 
                  href={profile?.vehicle?.rcBookUrl || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-600 hover:underline font-black"
                >
                  View Document
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Right Card: Technician Specifics */}
        {user?.role === 'technician' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <FileText className="h-4.5 w-4.5 text-blue-650" />
              <h4 className="font-bold text-slate-805 text-xs uppercase tracking-wider">Service Classification</h4>
            </div>
            
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-455 font-semibold">Specialty Category</span>
                <span className="font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase">
                  {profile?.technicianType || 'Appliances'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-455 font-semibold">Verification Status</span>
                <span className="text-green-600 font-black">Active &amp; Approved</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
