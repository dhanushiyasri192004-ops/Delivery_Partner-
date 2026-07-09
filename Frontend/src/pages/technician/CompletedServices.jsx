import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceHistory } from '../../redux/slices/technicianSlice';
import { Wrench, Calendar, CheckCircle } from 'lucide-react';

const CompletedServices = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.technician);

  useEffect(() => {
    dispatch(fetchServiceHistory());
  }, [dispatch]);

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Service History</h2>
          <p className="text-xs text-slate-400">Review your past completed service checkouts</p>
        </div>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Wrench className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-slate-700">No Services Completed Yet</h4>
            <p className="text-xs text-slate-400">Your completed home services list will be displayed here.</p>
          </div>
        ) : (
          history.map((booking) => (
            <div key={booking._id} className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-sm">Service Booking #SRV{booking._id.substring(18)}</h5>
                  <div className="flex gap-2 text-xs text-slate-400 items-center">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(booking.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-green-600 font-semibold">Completed</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-slate-800 text-base">₹{(booking.earnings || 0).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedServices;
