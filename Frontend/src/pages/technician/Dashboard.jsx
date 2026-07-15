import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Layers, 
  Users, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Star, 
  Folder, 
  Plus, 
  DollarSign, 
  FileText, 
  Bell, 
  Camera, 
  Phone, 
  Navigation,
  Check,
  ChevronRight,
  Shield,
  Activity,
  Award,
  BookOpen,
  User,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  // Read multi-business states passed from DashboardLayout context
  const { selectedBusiness, setSelectedBusiness, businesses, setBusinesses, activeMenu, setActiveMenu } = useOutletContext() || {
    selectedBusiness: 'OVERALL',
    setSelectedBusiness: () => {},
    businesses: ['Washing Machine'],
    setBusinesses: () => {},
    activeMenu: 'Dashboard',
    setActiveMenu: () => {}
  };

  // --- GENERAL SIMULATED BUSINESS DATA ---
  const businessData = {
    'OVERALL': {
      revenueToday: 1350,
      revenueMonthly: 24500,
      totalCustomers: 48,
      activeRequests: 4,
      pendingJobs: 2,
      completedJobs: 36,
      overallRating: 4.8,
      monthlyChart: [3200, 4800, 5100, 6200, 7500, 8900]
    },
    'Washing Machine': {
      revenue: 850,
      todayRepairs: 2,
      pendingRepairs: 1,
      completedRepairs: 18,
      customers: 22,
      spareParts: 14,
      assignedTechs: 3,
      rating: 4.9,
      monthlyChart: [1500, 2200, 2900, 3100, 3900, 4800]
    },
    'AC Repair': {
      revenue: 1200,
      gasFilling: 5,
      installation: 3,
      requests: 6,
      pending: 2,
      completed: 12,
      customers: 15,
      rating: 4.7,
      monthlyChart: [2100, 2900, 3800, 4500, 4900, 6100]
    },
    'Refrigerator': {
      revenue: 650,
      todayRepairs: 1,
      pendingRepairs: 0,
      completedRepairs: 8,
      customers: 10,
      rating: 4.6,
      monthlyChart: [800, 1200, 1600, 1900, 2200, 2600]
    },
    'TV': {
      revenue: 1400,
      todayRepairs: 3,
      pendingRepairs: 1,
      completedRepairs: 14,
      customers: 18,
      rating: 4.8,
      monthlyChart: [1800, 2500, 3200, 4100, 4500, 5800]
    }
  };

  // Active Job Stepper states for Washing Machine dashboard simulation (Matches reference 1st Image)
  const [workflowStep, setWorkflowStep] = useState(2);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const [previews, setPreviews] = useState({ before: '', after: '' });
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [starRating, setStarRating] = useState(5);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (workflowStep === 6) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [workflowStep]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic values helper
  const getVal = (biz, key, fallback = 0) => {
    const current = businessData[biz] || {
      revenue: 0, todayRepairs: 0, pendingRepairs: 0, completedRepairs: 0, customers: 0, rating: 4.5, monthlyChart: [100, 200, 300, 400]
    };
    return current[key] !== undefined ? current[key] : fallback;
  };

  // --- DYNAMIC DATA LISTS FOR SERVICE MENU VIEWS ---
  const allServiceRequests = [
    { id: 'SRV-908231', customer: 'Aravind Swamy', device: 'Samsung Ecobubble 8kg', issue: 'Heavy vibrations and drum noise during spin cycle.', est: 450, priority: 'High', category: 'Washing Machine' },
    { id: 'SRV-882741', customer: 'Shalini Nair', device: 'IFB Senator Aqua SX 7kg', issue: 'Water not draining. Filter clogged.', est: 350, priority: 'Medium', category: 'Washing Machine' },
    { id: 'SRV-102931', customer: 'Meena Sharma', device: 'Voltas Split AC 1.5 Ton', issue: 'AC cooling coil freezing up, compressor cutting off.', est: 1200, priority: 'High', category: 'AC Repair' },
    { id: 'SRV-104882', customer: 'Karan Malhotra', device: 'Daikin Inverter AC 1 Ton', issue: 'Gas leakage check and full cylinder refilling.', est: 1800, priority: 'Medium', category: 'AC Repair' },
    { id: 'SRV-339281', customer: 'Anjali Gupta', device: 'Sony Bravia 55" OLED TV', issue: 'Vertical colored lines appearing on the center of display.', est: 2500, priority: 'High', category: 'TV' },
    { id: 'SRV-331022', customer: 'Rohan Deshmukh', device: 'LG 43" Smart LED TV', issue: 'Backlight failed, sound works but display is pitch black.', est: 1400, priority: 'Medium', category: 'TV' },
    { id: 'SRV-448201', customer: 'Vikram Seth', device: 'LG Double Door Refrigerator', issue: 'Fridge cooling compartment not working, freezer is normal.', est: 750, priority: 'High', category: 'Refrigerator' }
  ];

  const allBookings = [
    { time: '09:00 AM', customer: 'Suresh Babu', service: 'Drum Repair', status: 'Completed', category: 'Washing Machine' },
    { time: '10:30 AM', customer: 'Meena Sharma', service: 'AC General Service', status: 'Completed', category: 'AC Repair' },
    { time: '12:00 PM', customer: 'Karan Malhotra', service: 'AC Gas Filling', status: 'Completed', category: 'AC Repair' },
    { time: '02:00 PM', customer: 'Ravi Teja', service: 'Descaling & Cleaning', status: 'In Progress', category: 'Washing Machine' },
    { time: '03:30 PM', customer: 'Anjali Gupta', service: 'OLED Panel Check', status: 'In Progress', category: 'TV' },
    { time: '05:00 PM', customer: 'Vikram Seth', service: 'Compressor Repair', status: 'Pending', category: 'Refrigerator' }
  ];

  const allCustomers = [
    { name: 'Suresh Babu', loc: 'Koramangala', device: 'IFB Washing Machine', category: 'Washing Machine' },
    { name: 'Shalini Nair', loc: 'Indiranagar', device: 'Samsung Washing Machine', category: 'Washing Machine' },
    { name: 'Meena Sharma', loc: 'HSR Layout', device: 'Samsung AC Unit', category: 'AC Repair' },
    { name: 'Karan Malhotra', loc: 'JP Nagar', device: 'Voltas Split AC', category: 'AC Repair' },
    { name: 'Anjali Gupta', loc: 'BTM Layout', device: 'Sony Bravia TV', category: 'TV' },
    { name: 'Rohan Deshmukh', loc: 'Whitefield', device: 'LG Smart TV', category: 'TV' },
    { name: 'Vikram Seth', loc: 'Jayanagar', device: 'LG Refrigerator', category: 'Refrigerator' }
  ];

  const allTechnicians = [
    { name: 'Karthik Rao', rating: 4.9, status: 'Online', category: 'Washing Machine' },
    { name: 'Ramesh Gowda', rating: 4.8, status: 'Online', category: 'Washing Machine' },
    { name: 'Deepak Kumar', rating: 4.7, status: 'Busy', category: 'AC Repair' },
    { name: 'Suresh Nair', rating: 4.6, status: 'Online', category: 'AC Repair' },
    { name: 'Amit Sharma', rating: 4.9, status: 'Online', category: 'TV' },
    { name: 'Rahul Verma', rating: 4.8, status: 'Busy', category: 'TV' },
    { name: 'Vikram Sen', rating: 4.7, status: 'Online', category: 'Refrigerator' }
  ];

  const allPayments = [
    { desc: 'Payout for IFB Drum Repair #SRV-773820', amount: '+ ₹350.00', date: '09-Jul-2026', type: 'credit', category: 'Washing Machine' },
    { desc: 'Payout for Voltas AC Service #SRV-102931', amount: '+ ₹1,200.00', date: '08-Jul-2026', type: 'credit', category: 'AC Repair' },
    { desc: 'Payout for Sony TV Panel Fix #SRV-339281', amount: '+ ₹2,500.00', date: '07-Jul-2026', type: 'credit', category: 'TV' },
    { desc: 'Payout for LG Refrigerator Check #SRV-448201', amount: '+ ₹750.00', date: '06-Jul-2026', type: 'credit', category: 'Refrigerator' }
  ];

  const allReviews = [
    { name: 'Suresh Babu', rating: 5, comment: 'Highly professional, resolved the drum vibrations in 30 minutes.', category: 'Washing Machine' },
    { name: 'Shalini Nair', rating: 5, comment: 'Quick cleanout of the drainage valve, works perfectly.', category: 'Washing Machine' },
    { name: 'Meena Sharma', rating: 5, comment: 'Neat AC installation. Explained the new settings clearly.', category: 'AC Repair' },
    { name: 'Anjali Gupta', rating: 5, comment: 'Excellent TV repair. Display lines disappeared.', category: 'TV' },
    { name: 'Vikram Seth', rating: 4, comment: 'Good cooling repair. Refrigerator is functioning well.', category: 'Refrigerator' }
  ];

  // Dynamic Filtering based on selectedBusiness
  const filteredRequests = selectedBusiness === 'OVERALL' 
    ? allServiceRequests 
    : allServiceRequests.filter(r => r.category.toLowerCase() === selectedBusiness.toLowerCase() || r.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  const filteredBookings = selectedBusiness === 'OVERALL' 
    ? allBookings 
    : allBookings.filter(b => b.category.toLowerCase() === selectedBusiness.toLowerCase() || b.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  const filteredCustomers = selectedBusiness === 'OVERALL' 
    ? allCustomers 
    : allCustomers.filter(c => c.category.toLowerCase() === selectedBusiness.toLowerCase() || c.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  const filteredTechnicians = selectedBusiness === 'OVERALL' 
    ? allTechnicians 
    : allTechnicians.filter(t => t.category.toLowerCase() === selectedBusiness.toLowerCase() || t.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  const filteredPayments = selectedBusiness === 'OVERALL' 
    ? allPayments 
    : allPayments.filter(p => p.category.toLowerCase() === selectedBusiness.toLowerCase() || p.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  const filteredReviews = selectedBusiness === 'OVERALL' 
    ? allReviews 
    : allReviews.filter(r => r.category.toLowerCase() === selectedBusiness.toLowerCase() || r.category.toLowerCase().includes(selectedBusiness.toLowerCase()));

  // Render Service Menu View content if active menu is NOT 'Dashboard'
  if (activeMenu !== 'Dashboard') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-fade-in text-base text-slate-800">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{activeMenu} Console</h2>
            <p className="text-sm text-slate-500 font-medium">Business Category: {selectedBusiness}</p>
          </div>
          <span className="text-sm bg-slate-105 text-slate-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {selectedBusiness}
          </span>
        </div>

        {activeMenu === 'Service Requests' && (
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div key={req.id} className="border border-slate-150 p-5 rounded-2xl space-y-3 bg-slate-50/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-black bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">{req.priority} Priority</span>
                      <h4 className="font-extrabold text-slate-850 text-base mt-2">{req.device}</h4>
                      <p className="text-sm text-slate-455 font-semibold">Service ID: #{req.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-450 font-bold block">EST. CHARGE</span>
                      <span className="text-lg font-black text-slate-800">₹{req.est}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-655 bg-white p-2.5 rounded-xl border border-slate-100">"{req.issue}"</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setActiveMenu('Dashboard'); setSelectedBusiness(req.category); }} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs">Accept Job</button>
                    <button className="bg-white border border-slate-200 text-red-500 font-bold px-3 py-2 rounded-xl text-xs">Decline</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No service requests found for {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Bookings' && (
          <div className="space-y-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50/50 border border-slate-150 rounded-xl">
                  <span className="text-xs font-black text-slate-500 w-16">{b.time}</span>
                  <div className="flex-grow">
                    <p className="font-extrabold text-slate-800 text-xs">{b.service}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{b.customer}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${b.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{b.status}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No bookings found for {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Customers' && (
          <div className="overflow-x-auto">
            {filteredCustomers.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase">
                    <th className="py-2.5">Customer Name</th>
                    <th className="py-2.5">Location</th>
                    <th className="py-2.5">Primary Device</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredCustomers.map((c, i) => (
                    <tr key={i}>
                      <td className="py-3 font-bold text-slate-800">{c.name}</td>
                      <td className="py-3 text-slate-500">{c.loc}</td>
                      <td className="py-3 font-bold text-slate-800">{c.device}</td>
                      <td className="py-3 text-right">
                        <button className="text-amber-600 font-bold hover:underline">View History</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No customers registered for {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Technicians' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechnicians.length > 0 ? (
              filteredTechnicians.map((t, i) => (
                <div key={i} className="border border-slate-150 p-4 rounded-xl flex justify-between items-center bg-slate-50/30">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs">{t.name}</h4>
                    <p className="text-[10px] text-slate-455 font-bold uppercase">{t.category} expert</p>
                    <span className="text-[10px] text-yellow-600 font-bold block mt-1">★ {t.rating} rating</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.status === 'Online' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{t.status}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center col-span-2">No active technicians assigned to {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Payments' && (
          <div className="space-y-3">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-slate-150 rounded-xl bg-slate-50/20">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{p.desc}</p>
                    <p className="text-[10px] text-slate-450 font-semibold">{p.date}</p>
                  </div>
                  <span className="font-black text-sm text-green-600">{p.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No transactions recorded for {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Reviews' && (
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r, i) => (
                <div key={i} className="p-4 border border-slate-150 rounded-xl space-y-2 bg-slate-50/30">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-800 text-xs">{r.name}</strong>
                    <span className="text-yellow-600 font-bold">★ {r.rating}</span>
                  </div>
                  <p className="text-xs text-slate-550 italic">"{r.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No reviews submitted yet for {selectedBusiness}.</p>
            )}
          </div>
        )}

        {activeMenu === 'Reports' && (
          <div className="space-y-4 text-center py-6">
            <Folder className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-slate-700 text-sm">{selectedBusiness} Performance Report</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Performance report calculations completed for {selectedBusiness}.</p>
            <button className="bg-slate-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs">Download Report</button>
          </div>
        )}

        {activeMenu === 'Notifications' && (
          <div className="space-y-3">
            {[
              { msg: `New assignment logged in ${selectedBusiness}`, time: 'Just now' },
              { msg: `Customer verified schedule update for ${selectedBusiness}`, time: '10 mins ago' }
            ].map((n, i) => (
              <div key={i} className="p-3 border border-slate-150 rounded-xl bg-slate-50/20 text-xs">
                <p className="font-bold text-slate-800">{n.msg}</p>
                <span className="text-[10px] text-slate-450 font-bold block mt-1">{n.time}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-fade-in text-base text-slate-800">
      
      {/* ========================================================= */}
      {/* 1. OVERALL COMBINED DASHBOARD VIEW                        */}
      {/* ========================================================= */}
      {selectedBusiness === 'OVERALL' && (
        <>
          {/* Overall Dashboard KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Total Businesses</span>
                <p className="text-2xl font-black text-slate-855">{businesses.length}</p>
                <span className="text-xs text-amber-600 font-bold">Active service hubs</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Layers className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Today's Revenue</span>
                <p className="text-2xl font-black text-slate-855">₹{(getVal('OVERALL', 'revenueToday') * businesses.length).toLocaleString()}</p>
                <span className="text-xs text-green-600 font-bold">▲ Combined daily total</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Total Customers</span>
                <p className="text-2xl font-black text-slate-855">{getVal('OVERALL', 'totalCustomers')}</p>
                <span className="text-xs text-amber-600 font-bold">Accumulated database</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Overall Rating</span>
                <p className="text-2xl font-black text-slate-855">{getVal('OVERALL', 'overallRating')}</p>
                <span className="text-xs text-yellow-600 font-bold">★ Top performance</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Star className="h-4.5 w-4.5 fill-amber-550" />
              </div>
            </div>

          </div>

          {/* Overall Dashboard Charts & Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Monthly Combined Revenue Graph (Custom Styled Vector SVG) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Monthly Revenue (Combined)</h3>
                <p className="text-xs text-slate-400 font-bold">Total earnings aggregated across all active service businesses</p>
              </div>

              {/* Vector line chart */}
              <div className="h-56 relative pt-4 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Chart Path */}
                  <path
                    d="M 50 180 Q 150 140, 250 120 T 450 60 T 550 30"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Gradient Area under curve */}
                  <path
                    d="M 50 180 Q 150 140, 250 120 T 450 60 T 550 30 L 550 200 L 50 200 Z"
                    fill="url(#chart-grad)"
                    opacity="0.15"
                  />

                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  {/* Interactive node dots */}
                  <circle cx="50" cy="180" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="250" cy="120" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="450" cy="60" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="550" cy="30" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* X-Axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* Business Performance Widget */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Business Performance</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Category Revenue Share</p>
              </div>

              <div className="space-y-4 pt-1">
                {businesses.map((biz) => {
                  const share = biz === 'Washing Machine' ? '55%' : biz === 'AC Repair' ? '35%' : '10%';
                  return (
                    <div key={biz} className="space-y-1.5">
                      <div className="flex justify-between font-bold text-xs text-slate-700">
                        <span>{biz} category</span>
                        <span>{share}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: share }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. WASHING MACHINE & TV DASHBOARD VIEWS                     */}
      {/* ========================================================= */}
      {(selectedBusiness === 'Washing Machine' || selectedBusiness === 'TV') && (
        <>
          {/* Business specific KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">{selectedBusiness} Revenue</span>
                <p className="text-2xl font-black text-slate-855">₹{getVal(selectedBusiness, 'revenue', selectedBusiness === 'TV' ? 1400 : 850).toFixed(2)}</p>
                <span className="text-xs text-green-600 font-bold flex items-center gap-0.5">
                  ▲ Live <span className="text-slate-450 font-normal">this month</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Pending Repairs</span>
                <p className="text-2xl font-black text-slate-855">{getVal(selectedBusiness, 'pendingRepairs', 1)}</p>
                <span className="text-xs text-red-500 font-bold">Requires attention</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Completed Repairs</span>
                <p className="text-2xl font-black text-slate-805">{getVal(selectedBusiness, 'completedRepairs', selectedBusiness === 'TV' ? 14 : 18)}</p>
                <span className="text-xs text-green-600 font-bold">Successfully resolved</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Assigned Techs</span>
                <p className="text-2xl font-black text-slate-805">{getVal(selectedBusiness, 'assignedTechs', 2)}</p>
                <span className="text-xs text-amber-600 font-bold">Active technicians</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>

          </div>

          {/* Stepper active console & Radar map columns layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Console Stepper column */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Active Repair Service Console</h3>
                  <p className="text-xs text-slate-500 font-medium">REAL-TIME JOB STEP MONITOR</p>
                </div>
                <div className="bg-amber-50 border border-amber-150 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-black uppercase">
                  Step {workflowStep} of 9
                </div>
              </div>

              {/* Stepper HUD */}
              <div className="grid grid-cols-9 gap-0.5 text-center relative py-1">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 z-0"></div>
                {[
                  { s: 1, name: 'Assign' },
                  { s: 2, name: 'Accept' },
                  { s: 3, name: 'Transit' },
                  { s: 4, name: 'Arrive' },
                  { s: 5, name: 'Pre-Photo' },
                  { s: 6, name: 'Repair' },
                  { s: 7, name: 'Post-Photo' },
                  { s: 8, name: 'Payment' },
                  { s: 9, name: 'Complete' }
                ].map((step) => (
                  <div key={step.s} className="relative z-10 flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      workflowStep > step.s 
                        ? 'bg-green-500 border-green-500 text-white'
                        : workflowStep === step.s 
                        ? 'bg-amber-500 border-amber-500 text-slate-950 font-extrabold ring-4 ring-amber-50'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {workflowStep > step.s ? <Check className="w-3 h-3" /> : step.s}
                    </div>
                    <span className={`text-[10px] font-bold mt-1 uppercase tracking-tight ${workflowStep === step.s ? 'text-amber-600 font-extrabold' : 'text-slate-400'}`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active Job Details layout */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded font-black uppercase">
                      JOB ID: {selectedBusiness === 'Washing Machine' ? '#SRV-882741' : '#SRV-339281'}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-lg pt-1">
                      {selectedBusiness === 'Washing Machine' ? 'IFB Senator Aqua SX 7kg' : 'Sony Bravia 55" OLED TV'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Issue: {selectedBusiness === 'Washing Machine' 
                        ? 'Water not draining. Drain filter cleaned but issue persists.' 
                        : 'Vertical colored lines appearing on the center of display.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block">BASE CHARGE</span>
                    <span className="text-base font-black text-slate-800">
                      ₹{selectedBusiness === 'Washing Machine' ? '350' : '2,500'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  {workflowStep === 2 && (
                    <div className="space-y-3.5">
                      <div className="bg-amber-50 border border-amber-100 text-amber-700 p-3.5 rounded-xl text-xs leading-relaxed font-bold text-center">
                        ✓ Request Accepted! You have committed to servicing this client. Please prepare your tools and click below to begin transit.
                      </div>
                      <button
                        onClick={() => setWorkflowStep(3)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-2xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <Navigation className="w-4.5 h-4.5" /> Start Traveling (On the Way)
                      </button>
                    </div>
                  )}

                  {workflowStep === 3 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">ETA</span>
                          <span className="font-bold text-slate-800">12 min away</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
                          <span className="font-bold text-slate-800">4.8 km</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setWorkflowStep(4)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs"
                      >
                        Confirm Arrival at Customer Location
                      </button>
                    </div>
                  )}

                  {workflowStep === 4 && (
                    <div className="space-y-3.5">
                      <div className="bg-amber-50 border border-amber-100 text-amber-700 p-3.5 rounded-xl text-xs leading-relaxed font-bold text-center">
                        ✓ Arrived! You are currently at the customer's location. Please meet the client and check the device.
                      </div>
                      <button
                        onClick={() => setWorkflowStep(5)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" /> Proceed to Pre-Service Photo
                      </button>
                    </div>
                  )}

                  {workflowStep === 5 && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold block">Document Pre-Service Inspection Condition:</p>
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                          <Camera className="w-5 h-5" />
                          <span className="text-[9px] mt-1 font-bold">PRE-PHOTO</span>
                        </div>
                        <button
                          onClick={() => setWorkflowStep(6)}
                          className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl"
                        >
                          Upload Photo & Start Repair
                        </button>
                      </div>
                    </div>
                  )}

                  {workflowStep === 6 && (
                    <div className="space-y-3.5 text-center py-2">
                      <div className="flex justify-center items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-sm font-black text-slate-800">Repair Timer: {formatTimer(timerSeconds)}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">Troubleshooting device. Perform necessary hardware repair/servicing steps.</p>
                      <button
                        onClick={() => setWorkflowStep(7)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs"
                      >
                        Complete Repair & Take Post-Photo
                      </button>
                    </div>
                  )}

                  {workflowStep === 7 && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold block">Document Completed Work Condition:</p>
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-[9px] mt-1 font-bold">POST-PHOTO</span>
                        </div>
                        <button
                          onClick={() => setWorkflowStep(8)}
                          className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl"
                        >
                          Upload Photo & Go to Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {workflowStep === 8 && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 font-bold block">Select Payment Collection Mode:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2.5 border-2 border-slate-105 hover:border-amber-400 bg-white rounded-xl text-xs font-bold text-slate-700">Cash</button>
                        <button className="py-2.5 border-2 border-amber-500 bg-amber-50 rounded-xl text-xs font-extrabold text-amber-800">UPI / QR</button>
                        <button className="py-2.5 border-2 border-slate-105 hover:border-amber-400 bg-white rounded-xl text-xs font-bold text-slate-700">Card POS</button>
                      </div>
                      <button
                        onClick={() => setWorkflowStep(9)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs mt-2"
                      >
                        Confirm Payment Collection
                      </button>
                    </div>
                  )}

                  {workflowStep === 9 && (
                    <div className="space-y-4 text-center py-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Service Order Completed!</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">Invoice emailed to customer. Payout of ₹{selectedBusiness === 'Washing Machine' ? '350' : '2,500'} credited.</p>
                      </div>
                      <button
                        onClick={() => { setWorkflowStep(2); setTimerSeconds(0); }}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-2.5 rounded-xl text-xs"
                      >
                        Return to Dispatch Console
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-3">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-650" />
                  Customer Information Card
                </h4>
                <div className="grid grid-cols-2 gap-3.5 text-xs leading-tight">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Customer name</span>
                    <span className="font-bold text-slate-805">
                      {selectedBusiness === 'Washing Machine' ? 'Shalini Nair' : 'Anjali Gupta'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Mobile number</span>
                    <span className="font-bold text-amber-600 flex items-center gap-0.5">
                      <Phone className="w-2.5 h-2.5" /> 
                      {selectedBusiness === 'Washing Machine' ? '+91 81290 88374' : '+91 98450 12345'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Full Address</span>
                    <span className="font-medium text-slate-700">
                      {selectedBusiness === 'Washing Machine' 
                        ? 'No. 12, 4th Cross, Koramangala 3rd Block, Bengaluru 560034' 
                        : 'Flat 402, Sunshine Heights, BTM Layout 2nd Stage, Bengaluru 560076'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Map column */}
            <div className="lg:col-span-4 bg-slate-900 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[320px] text-white relative">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="flex-1 flex flex-col items-center justify-center relative p-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-32 h-32 rounded-full border border-brand/10 animate-ping"></div>
                  <div className="absolute w-20 h-20 rounded-full border border-brand/20 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-brand border border-white"></div>
                </div>
              </div>

              <div className="p-5 bg-white border-t border-slate-100 grid grid-cols-2 items-center text-slate-800 relative z-10 rounded-b-3xl text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Distance</span>
                  <span className="font-black text-slate-805">3.5 km</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Est. Arrival</span>
                  <span className="font-black text-slate-805">12 min</span>
                </div>
            </div>

          </div>
        </div>
      </>
    )}

      {/* ========================================================= */}
      {/* 3. AC REPAIR DASHBOARD VIEW                               */}
      {/* ========================================================= */}
      {selectedBusiness === 'AC Repair' && (
        <>
          {/* AC Repair specific KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">AC Revenue</span>
                <p className="text-2xl font-black text-slate-855">₹{getVal('AC Repair', 'revenue').toFixed(2)}</p>
                <span className="text-xs text-green-600 font-bold">▲ active this week</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Gas Filling Jobs</span>
                <p className="text-2xl font-black text-slate-805">{getVal('AC Repair', 'gasFilling')}</p>
                <span className="text-xs text-amber-600 font-bold">Cylinder refill queue</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                <Activity className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Installation Jobs</span>
                <p className="text-2xl font-black text-slate-805">{getVal('AC Repair', 'installation')}</p>
                <span className="text-xs text-green-600 font-bold">Split & Window installs</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                <Layers className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">AC Rating</span>
                <p className="text-2xl font-black text-slate-805">★ {getVal('AC Repair', 'rating')}</p>
                <span className="text-xs text-yellow-600 font-bold">Highly reviewed</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Star className="h-4.5 w-4.5 fill-amber-550" />
              </div>
            </div>

          </div>

          {/* AC Repair Chart & Table list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Vector graph */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm">AC Revenue Trend</h3>
              
              <div className="h-48 relative pt-4 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <path
                    d="M 50 150 Q 200 110, 350 70 T 550 40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="50" fill="#f59e0b" cy="150" r="5" stroke="#fff" strokeWidth="2" />
                  <circle cx="350" fill="#f59e0b" cy="70" r="5" stroke="#fff" strokeWidth="2" />
                  <circle cx="550" fill="#f59e0b" cy="40" r="5" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Statistics */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs font-bold text-slate-700">
              <h3 className="font-extrabold text-slate-805 text-sm">AC Segment Metrics</h3>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between border-b pb-2">
                  <span>AC Customers</span>
                  <span className="text-slate-900 font-extrabold">{getVal('AC Repair', 'customers')} users</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Pending Tasks</span>
                  <span className="text-amber-600 font-extrabold">{getVal('AC Repair', 'pending')} jobs</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Tasks</span>
                  <span className="text-green-600 font-extrabold">{getVal('AC Repair', 'completed')} jobs</span>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 4. OTHER DYNAMIC BUSINESS VIEWS (Fallback dashboard)       */}
      {/* ========================================================= */}
      {selectedBusiness !== 'OVERALL' && selectedBusiness !== 'Washing Machine' && selectedBusiness !== 'TV' && selectedBusiness !== 'AC Repair' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-center">
          <BookOpen className="w-16 h-16 text-amber-500 mx-auto" />
          <div>
            <h3 className="text-lg font-black text-slate-855">{selectedBusiness} Dashboard</h3>
            <p className="text-xs text-slate-405 max-w-md mx-auto mt-1">
              Newly created service business segment dashboard. Statistics and job sheets will update dynamically as service bookings are received.
            </p>
          </div>
          
          <div className="grid grid-cols-2 max-w-md mx-auto gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Today's Revenue</span>
              <span className="text-xl font-black text-slate-800">₹{(getVal(selectedBusiness, 'revenue', 450)).toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Completed Repairs</span>
              <span className="text-xl font-black text-slate-800">{getVal(selectedBusiness, 'completedRepairs', 10)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
