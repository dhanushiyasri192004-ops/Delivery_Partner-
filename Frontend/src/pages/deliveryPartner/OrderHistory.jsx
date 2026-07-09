import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderHistory } from '../../redux/slices/deliverySlice';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  TrendingUp, 
  Flame, 
  MapPin, 
  Clock, 
  Timer, 
  Compass, 
  Star, 
  Award,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.delivery);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      


      {/* 1. Top row (4 Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Deliveries</span>
            <p className="text-2xl font-black text-slate-800">128</p>
            <span className="text-[9px] text-slate-400 font-semibold">Accumulated runs</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Deliveries</span>
            <p className="text-2xl font-black text-slate-800">124</p>
            <span className="text-[9px] text-green-600 font-bold">96.8% Success rate</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Cancelled Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cancelled Deliveries</span>
            <p className="text-2xl font-black text-slate-805">3</p>
            <span className="text-[9px] text-slate-400 font-semibold">Rider drop rate</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-650 flex items-center justify-center border border-orange-100">
            <XCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Returned Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Returned Deliveries</span>
            <p className="text-2xl font-black text-slate-805">1</p>
            <span className="text-[9px] text-slate-400 font-semibold">Vendor returns count</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <RotateCw className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Row 2: Performance Score (Left, Width ~35%) & Performance Metrics (Right, Width ~65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. Performance Score */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Performance Score</h4>
          </div>
          
          <div className="space-y-3.5 my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-green-600">92</span>
              <span className="text-sm text-slate-400 font-bold">/ 100</span>
            </div>
            <p className="text-xs font-black text-green-600">Excellent Performer</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Keep maintaining high ratings to unlock priority peak shifts!</p>
        </div>

        {/* 3. Performance Metrics */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div>
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Performance Metrics</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            
            {/* Acceptance Rate */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Acceptance Rate</span>
              <p className="text-2xl font-black text-slate-800">96%</p>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            {/* On-Time Delivery */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On-Time Delivery</span>
              <p className="text-2xl font-black text-slate-800">98%</p>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completion Rate</span>
              <p className="text-2xl font-black text-slate-805">97%</p>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '97%' }}></div>
              </div>
            </div>

            {/* Customer Rating */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer Rating</span>
              <p className="text-2xl font-black text-slate-805 flex items-center justify-center sm:justify-start gap-1">
                4.9 <Star className="h-5 w-5 fill-amber-450 stroke-amber-450 text-amber-500" />
              </p>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '98%' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: 4. Performance Trend (This Week) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[300px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h4 className="font-bold text-slate-800 text-sm">Performance Trend <span className="text-xs text-slate-400 font-semibold">(This Week)</span></h4>
          <span className="text-[10px] text-slate-400 font-bold">Refreshed just now</span>
        </div>

        {/* Vector SVG Line Chart representation */}
        <div className="relative flex-1 min-h-[180px] flex items-end">
          
          {/* Y Axis labels */}
          <div className="absolute left-0 inset-y-0 w-10 flex flex-col justify-between text-[10px] text-slate-400 font-semibold pr-2 pb-6 pt-2">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          <div className="ml-10 flex-1 h-full relative">
            
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pr-2 pb-6 pt-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-slate-100 border-dashed"></div>
              ))}
            </div>

            {/* Line graph */}
            <svg className="w-full h-[80%] absolute bottom-6 left-0 overflow-visible animate-fade-in" preserveAspectRatio="none">
              <defs>
                <linearGradient id="performGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Fill Gradient Path */}
              <path 
                d="M 20,60 L 100,40 L 180,30 L 260,34 L 340,26 L 420,20 L 500,26 L 500,120 L 20,120 Z"
                fill="url(#performGrad)"
              />

              {/* Line path */}
              <path 
                d="M 20,60 L 100,40 L 180,30 L 260,34 L 340,26 L 420,20 L 500,26"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Dots with numeric labels above them */}
              <g>
                {/* Mon - 75 */}
                <circle cx="20" cy="60" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="20" y="50" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">75</text>
                
                {/* Tue - 85 */}
                <circle cx="100" cy="40" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="100" y="30" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">85</text>

                {/* Wed - 90 */}
                <circle cx="180" cy="30" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="180" y="20" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">90</text>

                {/* Thu - 88 */}
                <circle cx="260" cy="34" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="260" y="24" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">88</text>

                {/* Fri - 92 */}
                <circle cx="340" cy="26" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="340" y="16" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">92</text>

                {/* Sat - 95 */}
                <circle cx="420" cy="20" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="420" y="10" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">95</text>

                {/* Sun - 92 */}
                <circle cx="500" cy="26" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="500" y="16" textAnchor="middle" className="text-[10px] font-black fill-slate-700 font-sans">92</text>
              </g>
            </svg>

            {/* X Axis */}
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

      {/* Row 4: Monthly Goal (Left) & Delivery Streak (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 5. Monthly Goal */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-805 text-sm">Monthly Goal</h4>
            <span className="text-xs font-black text-green-600">68% completed</span>
          </div>

          <div className="space-y-3.5 my-2 text-xs font-semibold">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-800">150 Deliveries</span>
              <span className="text-[10px] text-slate-400">Target Target</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1">
              <span>Completed: 102</span>
              <span>Remaining: 48</span>
            </div>
          </div>
        </div>

        {/* 6. Delivery Streak */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-805 text-sm">Delivery Streak</h4>
          </div>

          <div className="flex items-center gap-6 flex-1 py-2">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl animate-pulse">
              🔥
            </div>
            <div className="grid grid-cols-2 gap-x-8 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Streak</span>
                <span className="text-xl font-black text-slate-800">12 Days</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Best Streak</span>
                <span className="text-xl font-black text-slate-800">15 Days</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold border-t border-slate-50 pt-2">Complete 1 delivery run daily to keep your streak multiplier active.</p>
        </div>

      </div>

      {/* Row 5: 7. Delivery Statistics (Inline list block) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h4 className="font-bold text-slate-805 text-sm">Delivery Statistics</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          
          {/* Total Distance */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 block font-bold uppercase tracking-wider">Total Distance</span>
              <span className="text-lg font-black text-slate-800">532 km</span>
            </div>
          </div>

          {/* Total Working Hours */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100 font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 block font-bold uppercase tracking-wider">Working Hours</span>
              <span className="text-lg font-black text-slate-800">86.5 hrs</span>
            </div>
          </div>

          {/* Avg Delivery Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-650 flex items-center justify-center border border-orange-100 font-bold">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-455 block font-bold uppercase tracking-wider">Avg Delivery Time</span>
              <span className="text-lg font-black text-slate-800">32 min</span>
            </div>
          </div>

          {/* Avg Distance / Order */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-650 flex items-center justify-center border border-purple-100 font-bold">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 block font-bold uppercase tracking-wider">Avg Distance / Order</span>
              <span className="text-lg font-black text-slate-800">4.2 km</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default OrderHistory;
