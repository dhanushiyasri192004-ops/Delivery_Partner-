import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('All (20)');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const tabs = ['All (20)', 'Paid (15)', 'Pending (5)'];

  const paymentsData = [
    { id: 'PAY1001', guest: 'Amit Sharma', room: '101', amount: 5600, status: 'Paid', date: '15 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1002', guest: 'Priya Patel', room: '202', amount: 8500, status: 'Paid', date: '18 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1003', guest: 'Rahul Verma', room: '305', amount: 7500, status: 'Pending', date: '16 Jul', statusStyle: 'bg-amber-50 text-amber-700' },
    { id: 'PAY1004', guest: 'Sneha Iyer', room: '104', amount: 6000, status: 'Paid', date: '17 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1005', guest: 'Vikram Singh', room: '402', amount: 7800, status: 'Paid', date: '18 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-slate-805">
      
      {/* Filter Options */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                activeTab === tab 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-505 pointer-events-none" />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3">Payment ID</th>
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Room No</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paymentsData.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 font-bold text-slate-805">{p.id}</td>
                  <td className="py-3.5 font-extrabold text-slate-850">{p.guest}</td>
                  <td className="py-3.5 text-slate-500 font-bold">Room #{p.room}</td>
                  <td className="py-3.5 font-black text-slate-800">₹ {p.amount.toLocaleString()}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${p.statusStyle}`}>{p.status}</span>
                  </td>
                  <td className="py-3.5 text-right text-slate-500 font-bold">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none">
              <option>12</option>
              <option>24</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-300 pointer-events-none">&lt;</button>
            <button className="text-blue-600 font-black">1</button>
            <button className="hover:text-slate-600">2</button>
            <button className="hover:text-slate-600">3</button>
            <span>...</span>
            <button className="hover:text-slate-600">&gt;</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Payments;
