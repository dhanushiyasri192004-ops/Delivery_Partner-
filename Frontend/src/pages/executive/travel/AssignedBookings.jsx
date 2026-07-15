import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../redux/slices/notificationSlice';

const AssignedBookings = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedPendingBooking, setSelectedPendingBooking] = useState(null);
  const [selectedBusIndex, setSelectedBusIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeDeck, setActiveDeck] = useState('Lower');

  const initialBookings = [
    { pnr: 'PNR12345', passenger: 'Ramesh Kumar', route: 'Chennai → Coimbatore', date: '13 Jul 2025', seats: '2', amount: '₹2,458', status: 'Confirmed' },
    { pnr: 'PNR12346', passenger: 'Suresh Babu', route: 'Bangalore → Mysore', date: '13 Jul 2025', seats: '1', amount: '₹850', status: 'Pending' },
    { pnr: 'PNR12347', passenger: 'Anitha Devi', route: 'Chennai → Madurai', date: '13 Jul 2025', seats: '2', amount: '₹2,950', status: 'Confirmed' },
    { pnr: 'PNR12348', passenger: 'Vijay Kumar', route: 'Trichy → Salem', date: '13 Jul 2025', seats: '1', amount: '₹650', status: 'Cancelled' },
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
    if (busInfo.prebooked.includes(seatNum)) return;

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

    dispatch(addNotification({
      title: 'Booking Confirmed',
      message: `Booking ${pnr} for ${selectedPendingBooking.passenger} confirmed on ${mockBuses[selectedBusIndex].name}. Seats assigned: ${selectedSeats.join(', ')}`,
      isRead: false,
      time: timeStr
    }));

    setSelectedPendingBooking(null);
  };

  const handleAction = (pnr, nextStatus) => {
    const updated = bookings.map(b => b.pnr === pnr ? { ...b, status: nextStatus } : b);
    setBookings(updated);
    localStorage.setItem('travel_bookings', JSON.stringify(updated));

    const booking = bookings.find(b => b.pnr === pnr);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newNotification = {
      id: Date.now(),
      title: `Booking ${pnr} has been ${nextStatus.toLowerCase()}`,
      time: 'Just now',
      iconType: nextStatus === 'Confirmed' ? 'CheckCircle' : 'XCircle',
      style: nextStatus === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
    };

    const savedNotifications = localStorage.getItem('travel_notifications');
    const currentNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    const updatedNotifications = [newNotification, ...currentNotifications];
    localStorage.setItem('travel_notifications', JSON.stringify(updatedNotifications));

    dispatch(addNotification({
      title: nextStatus === 'Confirmed' ? 'Booking Confirmed' : 'Booking Cancelled',
      message: `Booking ${pnr} for ${booking ? booking.passenger : 'Passenger'} has been ${nextStatus.toLowerCase()}`,
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

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-805">
      
      {/* Search & Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search booking by PNR / Name / Route..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="h-4 w-4 text-slate-455" /> Filter
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">PNR</th>
                <th className="pb-3">Passenger</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Journey Date</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.filter(b => {
                const matchesSearch = b.passenger.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                     b.route.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesSearch;
              }).map((b) => (
                <tr key={b.pnr} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 font-bold text-blue-600">{b.pnr}</td>
                  <td className="py-3.5 font-bold text-slate-850">{b.passenger}</td>
                  <td className="py-3.5 text-slate-550">{b.route}</td>
                  <td className="py-3.5 text-slate-450">{b.date}</td>
                  <td className="py-3.5 text-slate-500">{b.seats}</td>
                  <td className="py-3.5 font-extrabold text-slate-800">{b.amount}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      b.status === 'Pending' ? 'bg-yellow-50 text-yellow-750' :
                      'bg-red-50 text-red-700'
                    }`}>{b.status}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAcceptClick(b)}
                        className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAction(b.pnr, 'Cancelled')}
                        className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all active:scale-90"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold">
          <div>
            <span>Showing 1 to {bookings.length} of 1248 entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span className="cursor-pointer hover:text-slate-600">3</span>
            <span>...</span>
          </div>
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

    </div>
  );
};

export default AssignedBookings;
