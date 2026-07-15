import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryDashboard, acceptOrder } from '../../redux/slices/deliverySlice';
import { ShoppingBag, Clock, MapPin, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssignedOrders = () => {
  const dispatch = useDispatch();
  const { assignedOrder, loading } = useSelector((state) => state.delivery);

  useEffect(() => {
    dispatch(fetchDeliveryDashboard());
  }, [dispatch]);

  const handleAccept = (orderId) => {
    dispatch(acceptOrder(orderId));
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {assignedOrder ? (
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-amber-500/10 px-6 py-4 flex justify-between items-center border-b border-slate-100">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> New Assignment Active
            </span>
            <span className="text-xs font-semibold text-slate-500">#ORD{assignedOrder._id?.substring(18)}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative border-l-2 border-slate-200 pl-6 space-y-6">
              <div>
                <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow"></span>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">PICKUP</span>
                <h5 className="font-bold text-slate-800 text-sm mt-0.5">Fresh Bites Restaurant</h5>
                <p className="text-xs text-slate-500">24, MG Road, Indiranagar, Bengaluru 560038</p>
              </div>

              <div>
                <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow"></span>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">DROP</span>
                <h5 className="font-bold text-slate-800 text-sm mt-0.5">Arun Kumar</h5>
                <p className="text-xs text-slate-500">45, 5th Cross, Koramangala, Bengaluru 560034</p>
              </div>
            </div>

            <div className="grid grid-cols-2 pt-4 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Payout</span>
                <span className="font-extrabold text-slate-850 text-base">₹{(assignedOrder.earnings?.tripPay || 150).toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Payment Method</span>
                <span className="text-green-600 font-semibold text-xs">Prepaid</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleAccept(assignedOrder._id)}
                className="flex-1 bg-brand hover:bg-brand-dark text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Check className="h-4 w-4" /> Accept Assignment
              </button>
              <button
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-200 transition-all"
              >
                <X className="h-4 w-4" /> Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h4 className="font-bold text-slate-700">No Orders Assigned</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no new incoming order dispatches. Keep your availability switch set to Online to capture assignments.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
