import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletDetails } from '../../redux/slices/walletSlice';
import { 
  Calendar, 
  TrendingUp, 
  Wallet as WalletIcon, 
  Award, 
  ChevronDown,
  Info,
  Wrench
} from 'lucide-react';

const Wallet = () => {
  const dispatch = useDispatch();
  const { balance, transactions = [], withdrawals = [] } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchWalletDetails());
  }, [dispatch]);

  // Compute stats
  const todayEarnings = transactions
    .filter(t => {
      const d = new Date(t.timestamp || t.createdAt);
      const today = new Date();
      return t.type === 'credit' &&
             d.getDate() === today.getDate() &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const thisWeekEarnings = transactions
    .filter(t => {
      const d = new Date(t.timestamp || t.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return t.type === 'credit' && diffDays <= 7;
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const thisMonthEarnings = transactions
    .filter(t => {
      const d = new Date(t.timestamp || t.createdAt);
      const today = new Date();
      return t.type === 'credit' &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const allTimeEarnings = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-fade-in">

      {/* Row 1: KPI Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-wider block">Today's Payouts</span>
            <p className="text-2xl font-black text-slate-800">₹{todayEarnings.toFixed(2)}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ Live <span className="text-slate-550 font-bold">updated today</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Weekly Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-wider block">Weekly Payouts</span>
            <p className="text-2xl font-black text-slate-800">₹{thisWeekEarnings.toFixed(2)}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ active <span className="text-slate-550 font-bold">this week</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-wider block">Monthly Payouts</span>
            <p className="text-2xl font-black text-slate-800">₹{thisMonthEarnings.toFixed(2)}</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ active <span className="text-slate-550 font-bold">this month</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <WalletIcon className="h-5 w-5" />
          </div>
        </div>

        {/* All-Time Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-wider block">All-Time Payout</span>
            <p className="text-2xl font-black text-slate-800">₹{allTimeEarnings.toFixed(2)}</p>
            <span className="text-[10px] text-slate-600 font-bold block">Total technician payouts</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
            <Award className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Row 2: Balance Widget & Transaction details list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left balance panel */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-amber-550/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Available Balance</span>
            <h3 className="text-4.5xl font-black text-amber-400">₹{balance.toFixed(2)}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-slate-300 font-bold">Account Status</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-black uppercase text-[9px]">Verified</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Service Payout Type</span>
              <span className="text-white font-extrabold">Instant Release</span>
            </div>
          </div>
        </div>

        {/* Right transactional history details list */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h4 className="font-extrabold text-slate-800 text-sm">Recent Ledger Entries</h4>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Wrench className="h-8 w-8 mx-auto text-slate-300" />
                <p className="font-bold">No transactions found</p>
                <p>Completed jobs payouts ledger is empty.</p>
              </div>
            ) : (
              transactions.map((tx, idx) => (
                <div key={idx} className="py-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{tx.description}</p>
                    <p className="text-[10px] text-slate-450 font-semibold">{new Date(tx.timestamp || tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
