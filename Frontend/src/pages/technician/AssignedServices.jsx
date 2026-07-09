import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTechnicianDashboard, acceptService } from '../../redux/slices/technicianSlice';
import { Wrench, MapPin, Check, X } from 'lucide-react';

const AssignedServices = () => {
  const dispatch = useDispatch();
  const { assignedService, loading } = useSelector((state) => state.technician);

  useEffect(() => {
    dispatch(fetchTechnicianDashboard());
  }, [dispatch]);

  const handleAccept = (bookingId) => {
    dispatch(acceptService(bookingId));
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Assigned Services</h2>
        <p className="text-xs text-slate-400">Incoming service bookings assigned to you</p>
      </div>

      {assignedService ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-xs font-bold bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider">
              New Assignment
            </span>
            <span className="text-xs font-semibold text-slate-400">#SRV{assignedService._id.substring(18)}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Home AC Maintenance Service</h4>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              Plot 104, HSR Layout, Sector 2, Bengaluru 560102
            </p>
          </div>

          <div className="grid grid-cols-2 pt-4 border-t border-slate-100 text-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Estimated earnings</span>
              <span className="font-bold text-slate-800">₹{assignedService.earnings || '450.00'}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleAccept(assignedService._id)}
              className="flex-1 bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow transition-all"
            >
              <Check className="h-4 w-4" /> Accept Job
            </button>
            <button
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-200 transition-all"
            >
              <X className="h-4 w-4" /> Decline
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Wrench className="h-8 w-8" />
          </div>
          <h4 className="font-bold text-slate-700">No Service Jobs Assigned</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no new service jobs. Please ensure your online availability switch is active.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedServices;
