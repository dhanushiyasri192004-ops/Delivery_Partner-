import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchExecutiveDashboard, 
  acceptTrip, 
  startTravel, 
  closeTrip 
} from '../../redux/slices/executiveSlice';
import { MapPin, Navigation, Camera, CheckSquare, Compass, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, activeTrip, assignedTrip, executiveStatus, error } = useSelector((state) => state.executive);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchExecutiveDashboard());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(acceptTrip(id));
  };

  const handleStartTravel = (id) => {
    dispatch(startTravel(id));
  };

  const handleCloseTripUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    dispatch(closeTrip({ tripId: id, formData }));
  };

  return (
    <div className="space-y-6">
      {/* Top banner summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Executive Dashboard</h2>
          <p className="text-xs text-slate-400">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 border p-3 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Trips Completed</span>
            <span className="font-extrabold text-slate-800 text-lg">{metrics.completedCount}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Trip Panel */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 text-sm flex items-center gap-2">
            <Navigation className="h-4 w-4 text-brand" /> Active Executive Trip
          </h3>

          {activeTrip ? (
            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {activeTrip.status}
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-3">{activeTrip.title}</h4>
                <p className="text-xs text-slate-500">{activeTrip.description || 'Corporate client site inspection visit'}</p>
              </div>

              {/* Status triggers */}
              <div className="pt-2">
                {activeTrip.status === 'accepted' && (
                  <button
                    onClick={() => handleStartTravel(activeTrip._id)}
                    className="w-full bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm transition-all"
                  >
                    Start Travel Transit
                  </button>
                )}

                {activeTrip.status === 'transit' && (
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Upload Closure Verification Photo
                    </span>
                    <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 text-slate-400">
                      <Camera className="h-6 w-6 text-brand" />
                      <span className="text-xs font-bold text-slate-600">Take site completion photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleCloseTripUpload(e, activeTrip._id)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : assignedTrip ? (
            /* Assigned trip alert */
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl space-y-4">
              <div className="flex gap-3">
                <Compass className="h-6 w-6 text-brand animate-spin" />
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">New Trip Assigned</h5>
                  <p className="text-xs text-slate-505">{assignedTrip.title}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(assignedTrip._id)}
                  className="flex-1 bg-brand text-slate-950 font-bold py-2 rounded-lg text-xs"
                >
                  Accept
                </button>
                <button className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-2 rounded-lg text-xs">
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs py-8 text-center">No trips currently assigned.</p>
          )}
        </div>

        {/* Dummy Map Telemetry Tracker */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
            Trip Route GPS Map
          </div>
          <div className="h-64 bg-slate-100 relative flex items-center justify-center">
            {/* SVG custom maps graphic */}
            <svg viewBox="0 0 400 200" className="w-full h-full opacity-60">
              <path d="M 100,50 L 300,150" fill="none" stroke="#b45309" strokeWidth="4" strokeDasharray="6 4" />
              <circle cx="100" cy="50" r="8" fill="#3b82f6" />
              <circle cx="300" cy="150" r="8" fill="#ef4444" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Location status</span>
              <span className="font-bold text-slate-800">Telemetry Active</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-semibold">GPS Pins</span>
              <span className="font-bold text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
