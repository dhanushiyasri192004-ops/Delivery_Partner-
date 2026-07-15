import React, { useState } from 'react';
import { Calendar, Download, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState('01 Jul 2026 - 31 Jul 2026');

  const stats = [
    { label: 'Occupancy Rate', value: '78%' },
    { label: 'Total Bookings', value: '156' },
    { label: 'Total Revenue', value: '₹ 2,45,000' },
    { label: 'Total Check-ins', value: '120' },
    { label: 'Total Check-outs', value: '110' },
    { label: 'Average Daily Rate', value: '₹ 5,200' }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Date Picker Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{dateRange}</span>
        </div>
        
        <button 
          onClick={() => {}}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-705 font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs"
        >
          <Download className="h-4 w-4 text-slate-400" /> Download
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{s.label}</span>
            <span className="text-xl font-black text-slate-805 block">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-805 text-sm flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-blue-600" /> Occupancy Overview
        </h3>
        
        {/* SVG Line Graph */}
        <div className="w-full h-64 bg-slate-50/50 rounded-2xl border border-slate-150 relative p-4 flex flex-col justify-between">
          <div className="w-full h-44 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
            </div>
            
            {/* SVG Line Chart Path */}
            <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Area path */}
              <path 
                d="M 50 130 Q 150 90 250 110 T 450 60 T 650 80 L 650 176 L 50 176 Z" 
                fill="url(#chartGradient)"
                className="transition-all duration-500"
              />
              {/* Stroke line */}
              <path 
                d="M 50 130 Q 150 90 250 110 T 450 60 T 650 80" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Dots */}
              <circle cx="50" cy="130" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="210" cy="98" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="370" cy="85" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="530" cy="68" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="650" cy="80" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          
          {/* X Axis Labels */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-4 border-t border-slate-100 pt-2.5">
            <span>01 Jul</span>
            <span>08 Jul</span>
            <span>15 Jul</span>
            <span>22 Jul</span>
            <span>31 Jul</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;
