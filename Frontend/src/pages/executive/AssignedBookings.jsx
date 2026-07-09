import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExecutiveDashboard, acceptTrip } from '../../redux/slices/executiveSlice';
import { MapPin, Check, X, Navigation } from 'lucide-react';

const AssignedBookings = () => {
  const dispatch = useDispatch();
  const { assignedTrip } = useSelector((state) => state.executive);

  useEffect(() => {
    dispatch(fetchExecutiveDashboard());
  }, [dispatch]);

  const handleAccept = (tripId) => {
    dispatch(acceptTrip(tripId));
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Assigned Trips</h2>
        <p className="text-xs text-slate-400">Incoming trip dispatches awaiting acceptance</p>
      </div>

      {assignedTrip ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-xs font-bold bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full uppercase">
              New Assignment
            </span>
            <span className="text-xs font-semibold text-slate-400">#TRP{assignedTrip._id.substring(18)}</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{assignedTrip.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{assignedTrip.description || 'Client meeting dispatch'}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleAccept(assignedTrip._id)}
              className="flex-1 bg-brand hover:bg-brand-dark text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow"
            >
              <Check className="h-4 w-4" /> Accept Assignment
            </button>
            <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all">
              <X className="h-4 w-4" /> Decline
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Navigation className="h-8 w-8" />
          </div>
          <h4 className="font-bold text-slate-700">No Assigned Trips</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You do not have any new travel assignments currently assigned.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedBookings;
