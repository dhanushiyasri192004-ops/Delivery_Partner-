import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('Booking Report');

  const reportOptions = [
    'Booking Report',
    'Revenue Report',
    'Bus Utilization',
    'Route Performance',
    'Cancellation Report',
    'Passenger Report'
  ];

  const reportData = {
    'Booking Report': {
      title: 'Booking Report',
      stats: [
        { label: 'Total Bookings', value: '1,248' },
        { label: 'Confirmed Bookings', value: '1,020' },
        { label: 'Pending Bookings', value: '142' },
        { label: 'Cancelled Bookings', value: '86' }
      ],
      chartTitle: 'Daily Bookings Trend',
      chartData: [
        { label: '7 Jul', value: 80 },
        { label: '8 Jul', value: 95 },
        { label: '9 Jul', value: 110 },
        { label: '10 Jul', value: 125 },
        { label: '11 Jul', value: 140 },
        { label: '12 Jul', value: 160 },
        { label: '13 Jul', value: 120 }
      ],
      maxVal: 180
    },
    'Revenue Report': {
      title: 'Revenue Report',
      stats: [
        { label: 'Total Revenue', value: '₹12,45,800' },
        { label: 'Online Payments', value: '₹9,80,500' },
        { label: 'Cash Collection', value: '₹2,65,300' },
        { label: 'Avg Ticket Value', value: '₹998' }
      ],
      chartTitle: 'Revenue Earnings (₹ Thousands)',
      chartData: [
        { label: '7 Jul', value: 90 },
        { label: '8 Jul', value: 120 },
        { label: '9 Jul', value: 105 },
        { label: '10 Jul', value: 135 },
        { label: '11 Jul', value: 150 },
        { label: '12 Jul', value: 175 },
        { label: '13 Jul', value: 130 }
      ],
      maxVal: 200
    },
    'Bus Utilization': {
      title: 'Bus Utilization Report',
      stats: [
        { label: 'Active Buses', value: '42' },
        { label: 'Total Trips Run', value: '310' },
        { label: 'Avg Occupancy', value: '78%' },
        { label: 'Fuel Efficiency', value: '4.8 km/l' }
      ],
      chartTitle: 'Average Occupancy Rate (%)',
      chartData: [
        { label: '7 Jul', value: 72 },
        { label: '8 Jul', value: 75 },
        { label: '9 Jul', value: 81 },
        { label: '10 Jul', value: 85 },
        { label: '11 Jul', value: 78 },
        { label: '12 Jul', value: 88 },
        { label: '13 Jul', value: 80 }
      ],
      maxVal: 100
    },
    'Route Performance': {
      title: 'Route Performance Report',
      stats: [
        { label: 'Most Active Route', value: 'Chennai - Coimbatore' },
        { label: 'Least Active Route', value: 'Trichy - Salem' },
        { label: 'On-Time Departure', value: '94%' },
        { label: 'Avg Delay Rate', value: '6%' }
      ],
      chartTitle: 'Trips Dispatched Per Day',
      chartData: [
        { label: '7 Jul', value: 12 },
        { label: '8 Jul', value: 15 },
        { label: '9 Jul', value: 14 },
        { label: '10 Jul', value: 18 },
        { label: '11 Jul', value: 19 },
        { label: '12 Jul', value: 22 },
        { label: '13 Jul', value: 16 }
      ],
      maxVal: 25
    },
    'Cancellation Report': {
      title: 'Cancellation Report',
      stats: [
        { label: 'Total Cancelled', value: '86' },
        { label: 'Cancellation Rate', value: '6.8%' },
        { label: 'Refunds Processed', value: '₹84,500' },
        { label: 'Avg Refund Time', value: '4 hrs' }
      ],
      chartTitle: 'Cancellations Count Trend',
      chartData: [
        { label: '7 Jul', value: 5 },
        { label: '8 Jul', value: 8 },
        { label: '9 Jul', value: 4 },
        { label: '10 Jul', value: 9 },
        { label: '11 Jul', value: 7 },
        { label: '12 Jul', value: 12 },
        { label: '13 Jul', value: 6 }
      ],
      maxVal: 15
    },
    'Passenger Report': {
      title: 'Passenger Report',
      stats: [
        { label: 'Unique Passengers', value: '2,890' },
        { label: 'New Registrations', value: '412' },
        { label: 'Repeated Travelers', value: '62%' },
        { label: 'Satisfaction Rate', value: '4.7/5' }
      ],
      chartTitle: 'New Passenger Signups Trend',
      chartData: [
        { label: '7 Jul', value: 30 },
        { label: '8 Jul', value: 45 },
        { label: '9 Jul', value: 35 },
        { label: '10 Jul', value: 50 },
        { label: '11 Jul', value: 55 },
        { label: '12 Jul', value: 65 },
        { label: '13 Jul', value: 40 }
      ],
      maxVal: 80
    }
  };

  const currentReport = reportData[reportType] || reportData['Booking Report'];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Date Filter & Export Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>01 Jul 2026 - 31 Jul 2026</span>
        </div>
        
        <button 
          onClick={() => {}}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-705 font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs"
        >
          <Download className="h-4 w-4 text-slate-400" /> Export
        </button>
      </div>
      
      {/* Main Report Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Report Categories list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm space-y-1.5 h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">Report Type</span>
          {reportOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setReportType(opt)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                reportType === opt 
                  ? 'bg-blue-50 text-blue-650 font-extrabold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        
        {/* Right Side: Metrics and Charts container */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-805 border-b border-slate-50 pb-3">{currentReport.title}</h3>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentReport.stats.map((s, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{s.label}</span>
                  <span className="text-lg font-bold text-slate-850 block">{s.value}</span>
                </div>
              ))}
            </div>
            
            {/* Bar Chart Mockup */}
            <div className="space-y-3 pt-4">
              <span className="text-xs font-bold text-slate-700 block">{currentReport.chartTitle}</span>
              <div className="h-44 flex items-end justify-between gap-4 pt-6 border-b border-slate-100 px-4">
                {currentReport.chartData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div 
                      style={{ height: `${(data.value / currentReport.maxVal) * 100}%` }} 
                      className="w-full max-w-[32px] bg-blue-600 rounded-t-lg group-hover:bg-blue-700 transition-all shadow-sm"
                    ></div>
                    <span className="text-[9px] text-slate-450 font-bold">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;
