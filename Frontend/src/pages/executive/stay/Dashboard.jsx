import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { acceptBooking, rejectBooking, assignRoom } from '../../../redux/slices/staySlice';
import { 
  Calendar, 
  Hotel, 
  Key, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  BarChart,
  Wrench,
  Plus,
  Bell,
  CheckCircle,
  XCircle,
  Bed,
  ShieldCheck,
  LogIn,
  Coffee,
  LogOut,
  Brush,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const bookings = useSelector(state => state.stay.bookings);
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const [activeFlowStep, setActiveFlowStep] = useState(null);
  
  // Accept with Available Rooms Modal
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');

  const rooms = useSelector(state => state.stay.rooms);

  const handleBookingAction = (id, action) => {
    if (action === 'accepted') {
      const booking = bookings.find(b => b.id === id);
      const matchingAvailableRooms = rooms.filter(r => r.status === 'Available' && r.type === booking.roomType);
      
      setTargetBooking(booking);
      if (matchingAvailableRooms.length > 0) {
        setSelectedRoomNumber(matchingAvailableRooms[0].number);
      } else {
        setSelectedRoomNumber('');
      }
      setShowAcceptModal(true);
    } else {
      dispatch(rejectBooking(id));
    }
  };

  const handleConfirmAccept = () => {
    dispatch(acceptBooking(targetBooking.id));
    if (selectedRoomNumber) {
      dispatch(assignRoom({
        bookingId: targetBooking.id,
        roomNumber: selectedRoomNumber
      }));
    }
    setShowAcceptModal(false);
    setTargetBooking(null);
  };

  const flowSteps = [
    { step: 1, label: 'Booking Received', icon: Bell, color: 'bg-blue-500', light: 'bg-blue-50 border-blue-200 text-blue-700', desc: 'New booking alert arrives on dashboard', path: '/executive/bookings' },
    { step: 2, label: 'Verify Booking', icon: ShieldCheck, color: 'bg-violet-500', light: 'bg-violet-50 border-violet-200 text-violet-700', desc: 'Check room availability & payment status', path: '/executive/bookings' },
    { step: 3, label: 'Accept / Reject', icon: CheckCircle, color: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200 text-emerald-700', desc: 'Approve or cancel the booking request', path: '/executive/bookings' },
    { step: 4, label: 'Assign Room', icon: Bed, color: 'bg-indigo-500', light: 'bg-indigo-50 border-indigo-200 text-indigo-700', desc: 'Mark an available room as Reserved', path: '/executive/rooms' },
    { step: 5, label: 'Guest Check-in', icon: LogIn, color: 'bg-teal-500', light: 'bg-teal-50 border-teal-200 text-teal-700', desc: 'Verify ID & mark room as Occupied', path: '/executive/checkin-checkout' },
    { step: 6, label: 'During Stay', icon: Coffee, color: 'bg-amber-500', light: 'bg-amber-50 border-amber-200 text-amber-700', desc: 'Handle housekeeping, maintenance & requests', path: '/executive/housekeeping' },
    { step: 7, label: 'Check-out & Bill', icon: LogOut, color: 'bg-rose-500', light: 'bg-rose-50 border-rose-200 text-rose-700', desc: 'Generate bill, collect payment & check-out', path: '/executive/checkin-checkout' },
    { step: 8, label: 'Room Cleaning', icon: Brush, color: 'bg-orange-500', light: 'bg-orange-50 border-orange-200 text-orange-700', desc: 'Housekeeping cleans & resets room to Available', path: '/executive/housekeeping' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in text-slate-800">
      
      {/* 5 Top metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {/* Card 1: Today's Check-ins */}
        <div 
          onClick={() => navigate('/executive/checkin-checkout')}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Today's Check-ins</span>
            <span className="text-2xl font-black text-slate-800">12</span>
            <span className="text-[9px] text-green-600 font-bold block flex items-center gap-0.5">↗ 10% from yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Today's Check-outs */}
        <div 
          onClick={() => navigate('/executive/checkin-checkout')}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Today's Check-outs</span>
            <span className="text-2xl font-black text-slate-800">8</span>
            <span className="text-[9px] text-green-600 font-bold block flex items-center gap-0.5">↗ 8% from yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Occupancy */}
        <div 
          onClick={() => navigate('/executive/rooms')}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Occupancy</span>
            <span className="text-2xl font-black text-slate-800">78%</span>
            <span className="text-[9px] text-slate-450 font-semibold block">120 / 153 Rooms</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Hotel className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Available Rooms */}
        <div 
          onClick={() => navigate('/executive/rooms')}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Available Rooms</span>
            <span className="text-2xl font-black text-slate-800">34</span>
            <span className="text-[9px] text-slate-450 font-semibold block">Total Rooms: 153</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Key className="h-5 w-5" />
          </div>
        </div>

        {/* Card 5: Earnings Today */}
        <div 
          onClick={() => navigate('/executive/payments')}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block">Earnings Today</span>
            <span className="text-2xl font-black text-slate-808">₹ 24,500</span>
            <span className="text-[9px] text-green-600 font-bold block flex items-center gap-0.5">↗ 12% from yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ── PENDING BOOKINGS — AWAITING YOUR ACTION ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
          <span className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Pending Bookings — Awaiting Your Action
            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full">
              {pendingBookings.filter(b => b.status === 'pending').length} New
            </span>
          </span>
          <button
            onClick={() => navigate('/executive/bookings')}
            className="flex items-center gap-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl hover:bg-blue-100 transition-all"
          >
            View All Bookings <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-2.5">
          {pendingBookings.length === 0 ? (
            <div className="text-center text-xs text-slate-400 font-semibold py-6">No pending bookings</div>
          ) : (
            pendingBookings.map((b) => (
              <div
                key={b.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all
                  ${b.status === 'accepted' ? 'bg-emerald-50/60 border-emerald-100' :
                    b.status === 'rejected' ? 'bg-red-50/60 border-red-100 opacity-60' :
                    'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
              >
                {/* Guest Info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                    {b.initials}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{b.guest}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{b.id} · {b.room} · {b.dates} ({b.nights}N)</p>
                  </div>
                </div>

                {/* Source & Payment */}
                <div className="hidden md:flex items-center gap-3 text-[10px] font-bold">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{b.source}</span>
                  <span className={`px-2.5 py-1 rounded-lg font-extrabold
                    ${b.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {b.payment}
                  </span>
                </div>

                {/* Status / Action */}
                <div className="flex items-center gap-2 ml-3">
                  {b.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleBookingAction(b.id, 'accepted')}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition-all active:scale-95"
                      >
                        <CheckCircle className="h-3 w-3" /> Accept
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, 'rejected')}
                        className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                      >
                        <XCircle className="h-3 w-3" /> Reject
                      </button>
                    </>
                  ) : b.status === 'accepted' ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-extrabold">
                      <CheckCircle className="h-4 w-4" />
                      Accepted — <button onClick={() => navigate('/executive/rooms')} className="underline">Assign Room →</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-extrabold">
                      <XCircle className="h-4 w-4" /> Rejected
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3-Column main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Left (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Today's Booking Summary */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-805 text-sm">Today's Booking Summary</h3>
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center p-3.5 bg-emerald-50/60 border border-emerald-100/40 rounded-2xl text-emerald-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span className="font-bold">New Bookings</span>
                </div>
                <span className="font-black text-emerald-950 text-sm">15</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-blue-50/60 border border-blue-100/40 rounded-2xl text-blue-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span className="font-bold">Upcoming Check-ins</span>
                </div>
                <span className="font-black text-blue-950 text-sm">18</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-amber-50/60 border border-amber-100/40 rounded-2xl text-amber-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                    <Key className="h-4 w-4" />
                  </span>
                  <span className="font-bold">Today's Check-outs</span>
                </div>
                <span className="font-black text-amber-950 text-sm">8</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-rose-50/60 border border-rose-100/40 rounded-2xl text-rose-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-rose-600 shadow-sm">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <span className="font-bold">Pending Payments</span>
                </div>
                <span className="font-black text-rose-950 text-sm">6</span>
              </div>
            </div>
          </div>

          {/* Upcoming Check-ins list table */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-805 text-sm">Upcoming Check-ins</h3>
              <button className="text-[10px] text-blue-600 font-extrabold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="pb-2">Guest Name</th>
                    <th className="pb-2">Room No.</th>
                    <th className="pb-2">Check-in Time</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Amit Sharma', room: '101', time: '11:30 AM', status: 'Confirmed', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { name: 'Priya Patel', room: '202', time: '01:00 PM', status: 'Confirmed', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { name: 'Rahul Verma', room: '305', time: '03:00 PM', status: 'Confirmed', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { name: 'Sneha Iyer', room: '104', time: '04:30 PM', status: 'Confirmed', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { name: 'Vikram Singh', room: '402', time: '06:00 PM', status: 'Pending', style: 'bg-orange-50 text-orange-700 border-orange-100' }
                  ].map((g, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold text-slate-805">{g.name}</td>
                      <td className="py-2.5 text-slate-500">{g.room}</td>
                      <td className="py-2.5 text-slate-450">{g.time}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${g.style}`}>{g.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Column 2: Middle (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Room Status horizontal progress bars */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-805 text-sm">Room Status</h3>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">153 Total Rooms</span>
            </div>
            
            {/* Stacked Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
              <div style={{ width: '62%' }} className="h-full bg-blue-500" title="Occupied (62%)"></div>
              <div style={{ width: '22%' }} className="h-full bg-emerald-500" title="Available (22%)"></div>
              <div style={{ width: '10%' }} className="h-full bg-amber-500" title="Cleaning (10%)"></div>
              <div style={{ width: '6%' }} className="h-full bg-purple-500" title="Maintenance (6%)"></div>
            </div>

            {/* Status Breakdown with Individual Progress Bars */}
            <div className="space-y-3.5">
              {[
                { label: 'Occupied', count: 94, percent: 62, colorClass: 'bg-blue-600', textClass: 'text-blue-700' },
                { label: 'Available', count: 34, percent: 22, colorClass: 'bg-emerald-600', textClass: 'text-emerald-700' },
                { label: 'Cleaning', count: 15, percent: 10, colorClass: 'bg-amber-500', textClass: 'text-amber-700' },
                { label: 'Maintenance', count: 10, percent: 6, colorClass: 'bg-purple-600', textClass: 'text-purple-700' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`}></span>
                      <span className="text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-slate-500">{item.count} Rooms ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${item.percent}%` }} 
                      className={`h-full ${item.colorClass} rounded-full`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Housekeeping Status list table */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-805 text-sm">Housekeeping Status</h3>
              <button className="text-[10px] text-blue-600 font-extrabold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="pb-2">Room No.</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { room: '101', status: 'Cleaning', staff: 'Ramesh', color: 'bg-orange-50 text-orange-700 border-orange-100' },
                    { room: '202', status: 'Cleaned', staff: 'Suresh', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { room: '305', status: 'In Progress', staff: 'Anita', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { room: '405', status: 'Pending', staff: 'Kavitha', color: 'bg-red-50 text-red-700 border-red-105' }
                  ].map((h, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold text-slate-805">Room #{h.room}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${h.color}`}>{h.status}</span>
                      </td>
                      <td className="py-2.5 text-right text-slate-500 font-bold">{h.staff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Column 3: Right (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions 3x3 Grid */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-805 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-black uppercase text-slate-655 tracking-wider">
              {[
                { label: 'New Booking', icon: Plus, color: 'text-blue-600', bgBtn: 'bg-blue-50/70 border-blue-100/50 hover:bg-blue-100/70', path: '/executive/bookings' },
                { label: 'Check-in Guest', icon: ArrowRight, color: 'text-green-600', bgBtn: 'bg-emerald-50/70 border-emerald-100/50 hover:bg-emerald-100/70', path: '/executive/checkin-checkout' },
                { label: 'Check-out Guest', icon: ArrowLeft, color: 'text-orange-600', bgBtn: 'bg-amber-50/70 border-amber-100/50 hover:bg-amber-100/70', path: '/executive/checkin-checkout' },
                { label: 'Assign Room', icon: Hotel, color: 'text-blue-600', bgBtn: 'bg-blue-50/70 border-blue-100/50 hover:bg-blue-100/70', path: '/executive/rooms' },
                { label: 'Housekeeping', icon: Sparkles, color: 'text-red-600', bgBtn: 'bg-rose-50/70 border-rose-100/50 hover:bg-rose-100/70', path: '/executive/housekeeping' },
                { label: 'Collect Payment', icon: DollarSign, color: 'text-green-600', bgBtn: 'bg-emerald-50/70 border-emerald-100/50 hover:bg-emerald-100/70', path: '/executive/payments' },
                { label: 'Maintenance', icon: Wrench, color: 'text-orange-600', bgBtn: 'bg-orange-50/70 border-orange-100/50 hover:bg-orange-100/70', path: '/executive/complaints' },
                { label: 'View Reports', icon: BarChart, color: 'text-blue-600', bgBtn: 'bg-sky-50/70 border-sky-100/50 hover:bg-sky-100/70', path: '/executive/reports' },
                { label: 'Add Walk-in', icon: UserPlus, color: 'text-purple-600', bgBtn: 'bg-purple-50/70 border-purple-100/50 hover:bg-purple-100/70', path: '/executive/checkin-checkout' }
              ].map((act, idx) => (
                <button key={idx} onClick={() => navigate(act.path)} className={`p-3 border ${act.bgBtn} rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95`}>
                  <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center ${act.color} shadow-sm`}>
                    <act.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="block leading-tight text-[8px] font-black">{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-805 text-sm">Recent Activity</h3>
              <button className="text-[10px] text-blue-600 font-extrabold hover:underline">View All</button>
            </div>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              {[
                { time: '09:30 AM', text: 'Guest Amit Sharma Checked-in (Room 101)', style: 'text-green-500 bg-green-50' },
                { time: '09:45 AM', text: 'Payment of ₹3,500 received from Room 202', style: 'text-green-500 bg-green-50' },
                { time: '10:15 AM', text: 'Housekeeping completed in Room 305', style: 'text-blue-500 bg-blue-50' },
                { time: '10:30 AM', text: 'Maintenance request for Room 104', style: 'text-orange-500 bg-orange-50' },
                { time: '11:00 AM', text: 'Guest Priya Patel Checked-in (Room 202)', style: 'text-green-500 bg-green-50' }
              ].map((act, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-[10px] text-slate-400 font-bold block pt-0.5 whitespace-nowrap">{act.time}</span>
                  <div className="flex items-start gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] mt-0.5 ${act.style}`}>✓</span>
                    <p className="text-[11px] text-slate-650 font-semibold leading-snug">{act.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── ACCEPT BOOKING & SELECT ROOM MODAL ── */}
      {showAcceptModal && targetBooking && (() => {
        const matchingAvailableRooms = rooms.filter(r => r.status === 'Available' && r.type === targetBooking.roomType);
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Accept Booking</h3>
                    <p className="text-emerald-100 text-[10px] font-semibold">Verify availability and assign room</p>
                  </div>
                </div>
                <button onClick={() => setShowAcceptModal(false)} className="text-white/70 hover:text-white transition-colors">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs font-semibold text-slate-700">
                {/* Guest Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guest Name:</span>
                    <span className="font-extrabold text-slate-800">{targetBooking.guest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Room Category:</span>
                    <span className="font-extrabold text-indigo-700">{targetBooking.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stay Duration:</span>
                    <span className="font-extrabold text-slate-800">{targetBooking.dates} ({targetBooking.nights} Nights)</span>
                  </div>
                </div>

                {/* Available Rooms List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Rooms ({targetBooking.roomType})</span>
                  
                  {matchingAvailableRooms.length === 0 ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl font-bold text-[11px] text-center">
                      ⚠️ No Available rooms left in this category!
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {matchingAvailableRooms.map((r) => (
                        <button
                          key={r.number}
                          type="button"
                          onClick={() => setSelectedRoomNumber(r.number)}
                          className={`p-3 rounded-xl border text-center font-extrabold text-xs transition-all active:scale-95
                            ${selectedRoomNumber === r.number
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100'
                              : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                          Room {r.number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAcceptModal(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAccept}
                    disabled={matchingAvailableRooms.length > 0 && !selectedRoomNumber}
                    className={`flex-1 font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider text-white shadow-md
                      ${matchingAvailableRooms.length === 0 || selectedRoomNumber
                        ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                        : 'bg-slate-350 cursor-not-allowed'
                      }`}
                  >
                    Confirm Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Dashboard;
