import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../../../redux/slices/notificationSlice';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Bus, 
  MapPin, 
  ArrowUpRight,
  Clock,
  ArrowDownRight,
  ChevronRight,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedPendingBooking, setSelectedPendingBooking] = useState(null);
  const [selectedBusIndex, setSelectedBusIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeDeck, setActiveDeck] = useState('Lower');

  const stats = [
    { label: 'Total Bookings', value: '1,248', change: '+8%', positive: true, icon: TrendingUp, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Passengers', value: '3,429', change: '+12%', positive: true, icon: Users, bg: 'bg-green-50 text-green-600' },
    { label: 'Total Revenue', value: '₹12,45,800', change: '+15%', positive: true, icon: CreditCard, bg: 'bg-yellow-50 text-yellow-600' },
    { label: 'Buses Active', value: '86', subtitle: 'Active Buses', icon: Bus, bg: 'bg-purple-50 text-purple-600' },
    { label: 'Routes', value: '42', subtitle: 'Active Routes', icon: MapPin, bg: 'bg-red-50 text-red-600' }
  ];

  const initialBookings = [
    { pnr: 'PNR12345', passenger: 'Ramesh Kumar', route: 'Chennai → Coimbatore', date: '13 Jul 2026', seats: '2', amount: '₹2,450', status: 'Confirmed' },
    { pnr: 'PNR12346', passenger: 'Suresh Babu', route: 'Bangalore → Mysore', date: '13 Jul 2026', seats: '1', amount: '₹850', status: 'Pending' },
    { pnr: 'PNR12347', passenger: 'Anitha Devi', route: 'Chennai → Madurai', date: '13 Jul 2026', seats: '2', amount: '₹2,950', status: 'Confirmed' },
    { pnr: 'PNR12348', passenger: 'Vijay Kumar', route: 'Trichy → Salem', date: '13 Jul 2026', seats: '1', amount: '₹650', status: 'Cancelled' },
    { pnr: 'PNR12349', passenger: 'Karthik R', route: 'Coimbatore → HSR', date: '13 Jul 2025', seats: '2', amount: '₹1,400', status: 'Confirmed' },
    { pnr: 'PNR12350', passenger: 'Meena Priya', route: 'Chennai → Bangalore', date: '14 Jul 2025', seats: '1', amount: '₹1,250', status: 'Pending' },
    { pnr: 'PNR12351', passenger: 'Arun Prasad', route: 'Madurai → Trichy', date: '14 Jul 2025', seats: '1', amount: '₹550', status: 'Confirmed' },
    { pnr: 'PNR12352', passenger: 'Gokul S', route: 'Salem → Chennai', date: '14 Jul 2025', seats: '2', amount: '₹1,800', status: 'Confirmed' }
  ];

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('travel_bookings');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_bookings', JSON.stringify(initialBookings));
    return initialBookings;
  });

  const mockBuses = [
    { name: 'TN01 AB 1234 (Scania Sleeper Plus)', type: 'Sleeper Plus', total: 40, booked: 22, available: 18, prebooked: ['L2', 'L5', 'S1', 'S2', 'S5', 'S6', 'S12', 'S18', 'U3', 'U8', 'U9', 'U14'] },
    { name: 'TN45 CD 5678 (Volvo Full Sleeper)', type: 'Full Sleeper', total: 30, booked: 18, available: 12, prebooked: ['L1', 'L3', 'L7', 'L8', 'L12', 'U2', 'U9', 'U10', 'U14'] },
    { name: 'TN09 EF 9012 (Ashok Leyland Seater)', type: 'Full Seater', total: 30, booked: 12, available: 18, prebooked: ['L2', 'L5', 'R1', 'R2', 'R6', 'R10', 'R11', 'R18', 'R20'] }
  ];

  const handleAcceptClick = (booking) => {
    setSelectedPendingBooking(booking);
    setSelectedSeats([]);
    setSelectedBusIndex(0);
    setActiveDeck('Lower');
  };

  const handleSeatClick = (seatNum) => {
    const busInfo = mockBuses[selectedBusIndex];
    if (busInfo.prebooked.includes(seatNum)) return; // Already booked

    const maxSeats = Number(selectedPendingBooking.seats);

    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNum));
    } else {
      if (selectedSeats.length >= maxSeats) {
        setSelectedSeats(prev => [...prev.slice(1), seatNum]);
      } else {
        setSelectedSeats(prev => [...prev, seatNum]);
      }
    }
  };

  const handleConfirmAssignment = () => {
    const pnr = selectedPendingBooking.pnr;
    const nextStatus = 'Confirmed';

    const updated = bookings.map(b => b.pnr === pnr ? { ...b, status: nextStatus } : b);
    setBookings(updated);
    localStorage.setItem('travel_bookings', JSON.stringify(updated));

    // Construct and store notification
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newNotification = {
      id: Date.now(),
      title: `Booking ${pnr} has been confirmed on ${mockBuses[selectedBusIndex].name} (Seats: ${selectedSeats.join(', ')})`,
      time: 'Just now',
      iconType: 'CheckCircle',
      style: 'bg-green-50 text-green-600 border-green-100'
    };

    const initialNotifications = [
      { id: 1, title: 'New booking PNR12387 received for Chennai → Coimbatore', time: '3 min ago', iconType: 'CheckCircle', style: 'bg-blue-50 text-blue-600 border-blue-100' },
      { id: 2, title: 'Payment received for PNR12345', time: '15 min ago', iconType: 'CreditCard', style: 'bg-green-50 text-green-600 border-green-100' },
      { id: 3, title: 'Bus TH01 AB 1234 is delayed by 30 minutes', time: '1 hour ago', iconType: 'AlertTriangle', style: 'bg-yellow-50 text-yellow-750 border-yellow-100' },
      { id: 4, title: 'Schedule SCH002 has been updated', time: '2 hours ago', iconType: 'Clock', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      { id: 5, title: 'Booking PNR12349 has been cancelled', time: '3 hours ago', iconType: 'XCircle', style: 'bg-red-50 text-red-700 border-red-100' }
    ];

    const savedNotifications = localStorage.getItem('travel_notifications');
    const currentNotifications = savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
    const updatedNotifications = [newNotification, ...currentNotifications];
    localStorage.setItem('travel_notifications', JSON.stringify(updatedNotifications));

    // Also dispatch to Redux store so that global notification layout header count updates
    dispatch(addNotification({
      title: 'Booking Confirmed',
      message: `Booking ${pnr} for ${selectedPendingBooking.passenger} confirmed on ${mockBuses[selectedBusIndex].name}. Seats assigned: ${selectedSeats.join(', ')}`,
      isRead: false,
      time: timeStr
    }));

    setSelectedPendingBooking(null);
  };

  const handleRejectClick = (pnr) => {
    const nextStatus = 'Cancelled';
    const updated = bookings.map(b => b.pnr === pnr ? { ...b, status: nextStatus } : b);
    setBookings(updated);
    localStorage.setItem('travel_bookings', JSON.stringify(updated));

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotification = {
      id: Date.now(),
      title: `Booking ${pnr} has been cancelled`,
      time: 'Just now',
      iconType: 'XCircle',
      style: 'bg-red-50 text-red-700 border-red-100'
    };

    const savedNotifications = localStorage.getItem('travel_notifications');
    const currentNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    const updatedNotifications = [newNotification, ...currentNotifications];
    localStorage.setItem('travel_notifications', JSON.stringify(updatedNotifications));

    dispatch(addNotification({
      title: 'Booking Cancelled',
      message: `Booking ${pnr} has been cancelled.`,
      isRead: false,
      time: timeStr
    }));
  };

  const renderSeatMap = () => {
    const bus = mockBuses[selectedBusIndex];
    
    if (bus.type === 'Sleeper Plus') {
      const rows = [];
      for (let i = 0; i < 10; i++) {
        let leftBerth = null;
        if (i % 2 === 0) {
          const berthNum = (activeDeck === 'Lower' ? 'L' : 'U') + (i / 2 + 1);
          leftBerth = berthNum;
        }

        let rightElements = [];
        if (activeDeck === 'Lower') {
          const s1 = `S${i * 2 + 1}`;
          const s2 = `S${i * 2 + 2}`;
          rightElements = [s1, s2];
        } else {
          if (i % 2 === 0) {
            const bIndex = (i / 2) * 2;
            const s1 = `U${6 + bIndex}`;
            const s2 = `U${7 + bIndex}`;
            rightElements = [s1, s2];
          }
        }
        rows.push({ leftBerth, rightElements, isRowEmptyLeft: i % 2 !== 0 });
      }

      return (
        <div className="space-y-1.5 w-full flex flex-col items-center">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-between items-center w-full max-w-[280px]">
              {row.leftBerth ? (
                <div 
                  onClick={() => handleSeatClick(row.leftBerth)}
                  className={`w-14 h-14 rounded-lg border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                    bus.prebooked.includes(row.leftBerth) 
                      ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                      : selectedSeats.includes(row.leftBerth)
                        ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                        : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                  }`}
                >
                  {row.leftBerth}
                </div>
              ) : row.isRowEmptyLeft ? (
                <div className="w-14 h-14"></div>
              ) : null}

              <div className="w-6"></div>

              <div className="flex gap-2">
                {row.rightElements.map((seatId) => {
                  const isSleeperBerth = seatId.startsWith('U');
                  return (
                    <div 
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={`rounded-md border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                        isSleeperBerth ? 'w-10 h-14' : 'w-9 h-9'
                      } ${
                        bus.prebooked.includes(seatId) 
                          ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                          : selectedSeats.includes(seatId)
                            ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                            : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                      }`}
                    >
                      {seatId}
                    </div>
                  );
                })}
                {activeDeck === 'Upper' && idx % 2 !== 0 && (
                  <div className="w-[88px] h-14"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (bus.type === 'Full Sleeper') {
      const rows = [];
      for (let i = 0; i < 5; i++) {
        const leftBerth = (activeDeck === 'Lower' ? 'L' : 'U') + (i + 1);
        const rightBerth1 = (activeDeck === 'Lower' ? 'L' : 'U') + (6 + i * 2);
        const rightBerth2 = (activeDeck === 'Lower' ? 'L' : 'U') + (7 + i * 2);
        rows.push({ leftBerth, rightBerths: [rightBerth1, rightBerth2] });
      }

      return (
        <div className="space-y-3.5 w-full flex flex-col items-center">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-between items-center w-full max-w-[280px]">
              <div 
                onClick={() => handleSeatClick(row.leftBerth)}
                className={`w-14 h-10 rounded-lg border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                  bus.prebooked.includes(row.leftBerth) 
                    ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                    : selectedSeats.includes(row.leftBerth)
                      ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                      : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                }`}
              >
                {row.leftBerth}
              </div>

              <div className="w-8"></div>

              <div className="flex gap-2">
                {row.rightBerths.map((berthId) => (
                  <div 
                    key={berthId}
                    onClick={() => handleSeatClick(berthId)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                      bus.prebooked.includes(berthId) 
                        ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                        : selectedSeats.includes(berthId)
                          ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                          : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                    }`}
                  >
                    {berthId}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (bus.type === 'Full Seater') {
      const rows = [];
      for (let i = 0; i < 10; i++) {
        const leftSeat = `L${i + 1}`;
        const rightSeat1 = `R${i * 2 + 1}`;
        const rightSeat2 = `R${i * 2 + 2}`;
        rows.push({ leftSeat, rightSeats: [rightSeat1, rightSeat2] });
      }

      return (
        <div className="space-y-1.5 w-full flex flex-col items-center">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-between items-center w-full max-w-[240px]">
              <div 
                onClick={() => handleSeatClick(row.leftSeat)}
                className={`w-8 h-8 rounded border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                  bus.prebooked.includes(row.leftSeat) 
                    ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                    : selectedSeats.includes(row.leftSeat)
                      ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                      : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                }`}
              >
                {row.leftSeat}
              </div>

              <div className="w-8"></div>

              <div className="flex gap-1.5">
                {row.rightSeats.map((seatId) => (
                  <div 
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    className={`w-8 h-8 rounded border flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all ${
                      bus.prebooked.includes(seatId) 
                        ? 'bg-slate-300 border-slate-350 text-slate-500 cursor-not-allowed' 
                        : selectedSeats.includes(seatId)
                          ? 'bg-blue-600 border-blue-700 text-white font-extrabold scale-105 shadow' 
                          : 'bg-white border-slate-300 hover:border-blue-500 text-slate-700'
                    }`}
                  >
                    {seatId}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const topRoutes = [
    { route: 'Chennai → Coimbatore', count: 320 },
    { route: 'Bangalore → Mysore', count: 280 },
    { route: 'Chennai → Madurai', count: 210 },
    { route: 'Trichy → Salem', count: 180 },
  ];

  const todayDepartures = [
    { bus: 'TN01 AB 1234', route: 'Chennai → Coimbatore', time: '08:30 AM', status: 'On Time' },
    { bus: 'TN45 CD 5678', route: 'Bangalore → Mysore', time: '09:00 AM', status: 'On Time' },
    { bus: 'TN37 GH 3456', route: 'Chennai → Madurai', time: '10:30 AM', status: 'Boarding' },
    { bus: 'TN38 IJ 9012', route: 'Trichy → Salem', time: '11:00 AM', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between min-h-[108px]"
          >
            <div className="space-y-1.5 min-w-0 pr-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {s.label}
              </span>
              <span className="text-2xl font-black text-slate-800 block leading-tight">{s.value}</span>
              <div className="flex items-center gap-1 flex-wrap">
                {s.change && (
                  <span className={`text-[9px] font-extrabold flex items-center ${s.positive ? 'text-green-600' : 'text-red-500'}`}>
                    {s.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {s.change}
                  </span>
                )}
                <span className="text-[9px] text-slate-400 font-bold">{s.subtitle || 'from yesterday'}</span>
              </div>
            </div>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${s.bg}`}>
              <s.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Pending Bookings – Awaiting Your Action */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
          <span className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Pending Bookings — Awaiting Your Action
            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full">
              {bookings.filter(b => b.status === 'Pending').length} New
            </span>
          </span>
          <button
            onClick={() => navigate('/executive/trips')}
            className="flex items-center gap-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl hover:bg-blue-100 transition-all"
          >
            View All Bookings <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {bookings.filter(b => b.status === 'Pending').length === 0 ? (
            <div className="text-center text-xs text-slate-400 font-semibold py-6">No pending bookings</div>
          ) : (
            bookings.filter(b => b.status === 'Pending').map((b) => (
              <div
                key={b.pnr}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                    {b.passenger.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{b.passenger}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{b.pnr} · {b.route} · {b.date} ({b.seats} Seats)</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-3 text-[10px] font-bold">
                  <span className="text-slate-800 font-extrabold">{b.amount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptClick(b)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectClick(b.pnr)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seat Assignment Modal Overlay (like AbhiBus / redBus) */}
      {selectedPendingBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl border border-slate-100 shadow-2xl p-6 relative flex flex-col md:flex-row gap-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedPendingBooking(null)} 
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-605"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Column: Details & Controls */}
            <div className="flex-1 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wide">Assign Bus & Select Seats</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Passenger: {selectedPendingBooking.passenger} ({selectedPendingBooking.pnr})</p>
                <p className="text-[10px] text-blue-600 font-extrabold mt-0.5">{selectedPendingBooking.route} · {selectedPendingBooking.date}</p>
              </div>

              {/* Select Available Bus */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450">Available Buses</label>
                <div className="space-y-2">
                  {mockBuses.map((bus, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedBusIndex(idx);
                        setSelectedSeats([]);
                        setActiveDeck('Lower');
                      }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                        selectedBusIndex === idx 
                          ? 'border-blue-600 bg-blue-50/50' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-slate-800">{bus.name}</span>
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">{bus.type}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>Total: {bus.total} seats</span>
                        <span className="text-emerald-600">Available: {bus.available} seats</span>
                        <span className="text-slate-455">Booked: {bus.booked} seats</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status details */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-[10.5px] font-bold text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Seats Needed:</span>
                  <span className="text-slate-850 font-black">{selectedPendingBooking.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Seats:</span>
                  <span className="text-blue-600 font-black">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1 text-slate-800">
                  <span>Amount Payout:</span>
                  <span className="font-extrabold">{selectedPendingBooking.amount}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedPendingBooking(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  disabled={selectedSeats.length !== Number(selectedPendingBooking.seats)}
                  className="flex-1 bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Confirm & Assign
                </button>
              </div>
            </div>

            {/* Right Column: Visual Seat Map (redBus/AbhiBus Style) */}
            <div className="w-full md:w-[350px] bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[460px]">
              
              {/* Deck Selector Tabs for Multi-deck buses */}
              {mockBuses[selectedBusIndex].type !== 'Full Seater' ? (
                <div className="flex w-full gap-2 mb-4 bg-slate-200/50 p-1.5 rounded-xl">
                  <button 
                    onClick={() => setActiveDeck('Lower')}
                    className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase rounded-lg transition-all ${
                      activeDeck === 'Lower' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Lower Deck
                  </button>
                  <button 
                    onClick={() => setActiveDeck('Upper')}
                    className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase rounded-lg transition-all ${
                      activeDeck === 'Upper' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Upper Deck
                  </button>
                </div>
              ) : (
                <div className="w-full text-center pb-2 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Single Deck Layout
                </div>
              )}

              <div className="w-full text-center pb-1 border-b border-slate-200 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Front / Driver
              </div>

              {/* Visual Seat Map Grid Scrollable area */}
              <div className="my-2 w-full max-h-[320px] overflow-y-auto pr-1">
                {renderSeatMap()}
              </div>

              {/* Legend details */}
              <div className="w-full flex justify-between text-[9px] font-extrabold text-slate-500 border-t border-slate-200 pt-3 px-2 mt-4">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-white border border-slate-300 rounded block"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-slate-300 border border-slate-350 rounded block"></span>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-600 border border-blue-700 rounded block"></span>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts & Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Overview Line Chart Mockup */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-805">Bookings Overview</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 text-slate-600 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-52 w-full relative flex items-end justify-between pt-6 border-b border-slate-100">
            {/* SVG mockup graph */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 160 Q 80 120 160 140 T 320 80 T 480 50 L 500 50 L 500 200 L 0 200 Z" 
                fill="url(#chartGradient)"
              />
              <path 
                d="M 0 160 Q 80 120 160 140 T 320 80 T 480 50 L 500 50" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Dots on points */}
              <circle cx="80" cy="135" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="240" cy="110" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="400" cy="65" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
            </svg>
            <div className="text-[9px] text-slate-400 font-bold w-full flex justify-between px-2 pb-1 z-10">
              <span>7 Jul</span>
              <span>8 Jul</span>
              <span>9 Jul</span>
              <span>10 Jul</span>
              <span>11 Jul</span>
              <span>12 Jul</span>
              <span>13 Jul</span>
            </div>
          </div>
        </div>

        {/* Bookings Status Donut Mockup */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-805">Bookings by Status</h3>
          <div className="flex items-center justify-center h-40 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
              <circle cx="64" cy="64" r="50" fill="transparent" stroke="#2563eb" strokeWidth="14" strokeDasharray="314" strokeDashoffset="120" />
              <circle cx="64" cy="64" r="50" fill="transparent" stroke="#eab308" strokeWidth="14" strokeDasharray="314" strokeDashoffset="240" />
              <circle cx="64" cy="64" r="50" fill="transparent" stroke="#ef4444" strokeWidth="14" strokeDasharray="314" strokeDashoffset="280" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-slate-850">1,248</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Bookings</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-500 text-center">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block mb-1"></span>
              <span>Confirmed (62%)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block mb-1"></span>
              <span>Pending (28%)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 block mb-1"></span>
              <span>Refunded (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-805">Recent Bookings</h3>
            <button 
              onClick={() => navigate('/executive/trips')}
              className="text-blue-600 hover:underline text-xs font-bold"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="pb-2.5">PNR</th>
                  <th className="pb-2.5">Passenger</th>
                  <th className="pb-2.5">Route</th>
                  <th className="pb-2.5">Journey Date</th>
                  <th className="pb-2.5">Seats</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.slice(0, 4).map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-blue-600">{b.pnr}</td>
                    <td className="py-2.5 text-slate-850 font-bold">{b.passenger}</td>
                    <td className="py-2.5 text-slate-500">{b.route}</td>
                    <td className="py-2.5 text-slate-450">{b.date}</td>
                    <td className="py-2.5 text-slate-800">{b.seats}</td>
                    <td className="py-2.5 font-bold text-slate-850">{b.amount}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : b.status === 'Pending' ? 'bg-yellow-50 text-yellow-750' : 'bg-red-50 text-red-700'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side columns: Departures & Top Routes */}
        <div className="space-y-6">
          {/* Today's Departures */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-805">Today's Departures</h3>
            <div className="space-y-3">
              {todayDepartures.map((d, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-850 block">{d.bus}</span>
                    <span className="text-[10px] text-slate-400 block">{d.route}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10.5px] font-bold text-slate-700 block">{d.time}</span>
                    <span className={`text-[9px] font-bold ${
                      d.status === 'Boarding' ? 'text-amber-500' : d.status === 'On Time' ? 'text-green-600' : 'text-slate-400'
                    }`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Routes by Bookings */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-805">Top Routes by Bookings</h3>
            <div className="space-y-3">
              {topRoutes.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{r.route}</span>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
