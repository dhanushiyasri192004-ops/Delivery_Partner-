import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletDetails } from '../../redux/slices/walletSlice';
import { 
  Calendar, 
  TrendingUp, 
  Wallet as WalletIcon, 
  Award, 
  Clock, 
  Navigation, 
  Percent, 
  ChevronDown,
  Info
} from 'lucide-react';

const Wallet = () => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

  // States
  const [chartTimeline, setChartTimeline] = useState('Daily'); // Daily, Weekly, Monthly
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState('1 Jul 2026 - 8 Jul 2026');

  useEffect(() => {
    dispatch(fetchWalletDetails());
  }, [dispatch]);

  // Order Payouts mock list matching the image exactly
  const recentOrders = [
    { id: '#567890', type: 'Food', distance: '3.2 km', base: '₹65.00', tip: '₹20.00', bonus: '₹10.00', total: '₹95.00', time: '8 Jul, 08:45 PM', icon: '🍔', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: '#567889', type: 'Product', distance: '5.1 km', base: '₹80.00', tip: '₹15.00', bonus: '₹0.00', total: '₹95.00', time: '8 Jul, 07:15 PM', icon: '📦', badgeColor: 'bg-green-50 text-green-700 border-green-200' },
    { id: '#567887', type: 'Food', distance: '4.3 km', base: '₹75.00', tip: '₹0.00', bonus: '₹10.00', total: '₹85.00', time: '8 Jul, 05:40 PM', icon: '🍔', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: '#567886', type: 'Product', distance: '3.6 km', base: '₹65.00', tip: '₹18.00', bonus: '₹5.00', total: '₹88.00', time: '8 Jul, 04:30 PM', icon: '📦', badgeColor: 'bg-green-50 text-green-700 border-green-200' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      


      {/* Row 1: KPI Stats row (4 cards matching layout exactly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Earnings</span>
            <p className="text-2xl font-black text-slate-800">₹270.00</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 18% <span className="text-slate-400 font-normal">vs yesterday</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">This Week</span>
            <p className="text-2xl font-black text-slate-800">₹1,890.00</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 12% <span className="text-slate-400 font-normal">vs last week</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">This Month</span>
            <p className="text-2xl font-black text-slate-800">₹6,480.00</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              ▲ 22% <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <WalletIcon className="h-5 w-5" />
          </div>
        </div>

        {/* All-Time Payout */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">All-Time Payout</span>
            <p className="text-2xl font-black text-slate-800">₹28,450.00</p>
            <span className="text-[10px] text-slate-400 font-semibold block">Total earnings till date</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
            <Award className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Row 2: Earnings Overview Line Chart (Left) & Earnings Breakdown Donut Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Earnings Overview Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Earnings Overview</h4>
            
            {/* Timeline selector tabs */}
            <div className="flex border border-slate-200 rounded-lg p-0.5 text-xs font-bold bg-slate-50">
              {['Daily', 'Weekly', 'Monthly'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setChartTimeline(tab)}
                  className={`px-3.5 py-1.5 rounded-md transition-all ${
                    chartTimeline === tab
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart Representation matching layout exactly */}
          <div className="relative flex-1 min-h-[200px] flex items-end">
            
            {/* Left Y Axis Labels */}
            <div className="absolute left-0 inset-y-0 w-12 flex flex-col justify-between text-[10px] text-slate-400 font-semibold pr-2 pb-6 pt-2">
              <span>₹2.5K</span>
              <span>₹2K</span>
              <span>₹1.5K</span>
              <span>₹1K</span>
              <span>₹500</span>
              <span>₹0</span>
            </div>

            {/* Line Path */}
            <div className="ml-12 flex-1 h-full relative">
              
              {/* Horizontal Background Grids */}
              <div className="absolute inset-0 flex flex-col justify-between pr-2 pb-6 pt-2.5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-full border-t border-dashed border-slate-100"></div>
                ))}
              </div>

              {/* Vector SVG Line Graphic */}
              <svg className="w-full h-[85%] absolute bottom-6 left-0 overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Under Fill Path */}
                <path
                  d="M 20,80 L 100,40 L 180,58 L 260,32 L 340,70 L 420,44 L 500,20 L 500,120 L 20,120 Z"
                  fill="url(#chartGradient)"
                  className="transition-all duration-500"
                />

                {/* Line Path */}
                <path
                  d="M 20,80 L 100,40 L 180,58 L 260,32 L 340,70 L 420,44 L 500,20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />

                {/* Nodes / Dots representing coordinates */}
                <circle cx="20" cy="80" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="100" cy="40" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="180" cy="58" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="260" cy="32" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="340" cy="70" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="420" cy="44" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="20" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              {/* X Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 font-semibold pr-2 select-none">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Earnings Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">Earnings Breakdown</h4>
            
            {/* SVG Donut Chart Vector */}
            <div className="flex items-center justify-center py-4 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {/* Base segment - 45% */}
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="314" strokeDashoffset="172.7" />
                {/* Tips segment - 20% */}
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="314" strokeDashoffset="251.2" transform="rotate(162 72 72)" />
                {/* Incentives segment - 15% */}
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="314" strokeDashoffset="266.9" transform="rotate(234 72 72)" />
                {/* Bonuses segment - 10% */}
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="314" strokeDashoffset="282.6" transform="rotate(288 72 72)" />
                {/* Other segment - 10% */}
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="314" strokeDashoffset="282.6" transform="rotate(324 72 72)" />
              </svg>
              
              {/* Inside Donut total label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center select-none pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                <span className="text-sm font-black text-slate-800">₹6,480.00</span>
              </div>
            </div>
          </div>

          {/* Color Legend with percentage and exact values */}
          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                <span className="text-slate-400 font-semibold">Base Earnings</span>
              </div>
              <span className="font-extrabold text-slate-700">45% <span className="text-slate-400 font-semibold ml-1.5">₹2,916.00</span></span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                <span className="text-slate-400 font-semibold">Customer Tips</span>
              </div>
              <span className="font-extrabold text-slate-700">20% <span className="text-slate-400 font-semibold ml-1.5">₹1,296.00</span></span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                <span className="text-slate-400 font-semibold">Incentives</span>
              </div>
              <span className="font-extrabold text-slate-700">15% <span className="text-slate-400 font-semibold ml-1.5">₹972.00</span></span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                <span className="text-slate-400 font-semibold">Bonuses</span>
              </div>
              <span className="font-extrabold text-slate-700">10% <span className="text-slate-400 font-semibold ml-1.5">₹648.00</span></span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></span>
                <span className="text-slate-400 font-semibold">Other</span>
              </div>
              <span className="font-extrabold text-slate-700">10% <span className="text-slate-400 font-semibold ml-1.5">₹648.00</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Recent Orders Earnings Table (Left) & Quick Summary Metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Orders Earnings */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-bold text-slate-800 text-sm">Recent Orders Earnings</h4>
              <span className="text-[10px] text-slate-400 font-semibold">Processed runs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-450 font-bold uppercase tracking-wider select-none">
                    <th className="py-2.5 px-2">Order ID</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Distance</th>
                    <th className="py-2.5 px-2">Base Earnings</th>
                    <th className="py-2.5 px-2">Tips</th>
                    <th className="py-2.5 px-2">Bonus</th>
                    <th className="py-2.5 px-2">Total</th>
                    <th className="py-2.5 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold text-slate-700">
                      <td className="py-3 px-2 font-mono text-[10px] text-slate-400">
                        {order.id}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase flex items-center gap-1 w-max ${order.badgeColor}`}>
                          <span>{order.icon}</span> {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{order.distance}</td>
                      <td className="py-3 px-2">{order.base}</td>
                      <td className="py-3 px-2 text-green-600">{order.tip}</td>
                      <td className="py-3 px-2 text-blue-600">{order.bonus}</td>
                      <td className="py-3 px-2 font-black text-slate-800">{order.total}</td>
                      <td className="py-3 px-2 text-slate-400 font-medium text-[10px]">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-slate-100">
            <button className="text-xs font-bold text-blue-600 hover:underline">
              View All Orders
            </button>
          </div>
        </div>

        {/* Right: Quick Summary Statistics */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-805 text-sm border-b border-slate-100 pb-3 mb-4">Quick Summary</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    📊
                  </div>
                  <span className="text-slate-450">Average per Order</span>
                </div>
                <span className="font-black text-slate-800">₹72.45</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold">
                    ✅
                  </div>
                  <span className="text-slate-450">Orders Completed</span>
                </div>
                <span className="font-black text-slate-800">95</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                    📍
                  </div>
                  <span className="text-slate-450">Distance Travelled</span>
                </div>
                <span className="font-black text-slate-800">286 km</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-50 text-amber-650 rounded-lg flex items-center justify-center font-bold">
                    ⏰
                  </div>
                  <span className="text-slate-450">Working Hours</span>
                </div>
                <span className="font-black text-slate-800">32.5 hrs</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center font-bold">
                    📈
                  </div>
                  <span className="text-slate-450">Acceptance Rate</span>
                </div>
                <span className="font-black text-green-650">96%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] text-slate-450 space-y-1 font-semibold">
            <p className="font-black text-slate-700">💡 Earnings Tip</p>
            <p className="leading-relaxed">Complete peak period morning runs (6:00 AM - 9:00 AM) to boost order distance multiplier bonuses!</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Wallet;
