import React, { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';

const ComplaintsSupport = () => {
  const [activeTab, setActiveTab] = useState('All (5)');
  const [statusFilter, setStatusFilter] = useState('All States');

  const tabs = ['All (5)', 'Open (2)', 'In Progress (2)', 'Resolved (1)'];

  const complaintsData = [
    { id: 'CMP1001', guest: 'Amit Sharma', room: '101', issue: 'AC Not Working', status: 'Open', style: 'bg-red-50 text-red-700 border-red-100' },
    { id: 'CMP1002', guest: 'Priya Patel', room: '202', issue: 'TV Not Working', status: 'Open', style: 'bg-red-50 text-red-700 border-red-100' },
    { id: 'CMP1003', guest: 'Rahul Verma', room: '305', issue: 'Wi-Fi Issue', status: 'Resolved', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { id: 'CMP1004', guest: 'Sneha Iyer', room: '104', issue: 'Water Leakage', status: 'Open', style: 'bg-red-50 text-red-700 border-red-100' },
    { id: 'CMP1005', guest: 'Vikram Singh', room: '402', issue: 'Light Not Working', status: 'In Progress', style: 'bg-blue-50 text-blue-700 border-blue-105' }
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
            <option value="All States">All States</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-505 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3">Complaint ID</th>
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Room No</th>
                <th className="pb-3">Issue</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {complaintsData.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 font-bold text-slate-805">{c.id}</td>
                  <td className="py-3.5 font-extrabold text-slate-850">{c.guest}</td>
                  <td className="py-3.5 text-slate-500 font-bold">Room #{c.room}</td>
                  <td className="py-3.5 text-slate-700 font-semibold">{c.issue}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${c.style}`}>{c.status}</span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={() => {}}
                      className="text-slate-400 hover:text-blue-600 transition-all inline-flex items-center"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
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
              <option>5</option>
              <option>10</option>
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

export default ComplaintsSupport;
