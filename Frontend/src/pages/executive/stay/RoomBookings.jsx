import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Check, X, Search } from 'lucide-react';
import { acceptBooking, rejectBooking, addBooking, assignRoom } from '../../../redux/slices/staySlice';

const RoomBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookings = useSelector(state => state.stay.bookings);
  const rooms = useSelector(state => state.stay.rooms);

  const [activeTab, setActiveTab] = useState('New Bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [bookingToAssign, setBookingToAssign] = useState(null);
  const [selectedRoomNo, setSelectedRoomNo] = useState('');

  // Add booking form states
  const [guestName, setGuestName] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('Deluxe Room');
  const [checkIn, setCheckIn] = useState('15 Jul');
  const [checkOut, setCheckOut] = useState('17 Jul');
  const [nights, setNights] = useState('2');
  const [source, setSource] = useState('Direct');
  const [paymentStatus, setPaymentStatus] = useState('Paid');

  const tabs = ['New Bookings', 'Upcoming Check-ins', 'Upcoming Check-outs', 'Cancelled'];

  const handleAction = (id, actionType) => {
    if (actionType === 'Accept') {
      const bk = bookings.find(b => b.id === id);
      setBookingToAssign(bk);
      const firstAvailable = rooms.find(r => r.status === 'Available' && r.type === bk.roomType);
      setSelectedRoomNo(firstAvailable ? firstAvailable.number : '');
      setShowAssignModal(true);
    } else {
      dispatch(rejectBooking(id));
    }
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!guestName) return;
    const initials = guestName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const newBk = {
      id: `BK${1000 + bookings.length + 1}`,
      guest: guestName,
      initials: initials || 'G',
      roomType: selectedRoomType,
      dates: `${checkIn} - ${checkOut}`,
      nights: parseInt(nights) || 1,
      source,
      payment: paymentStatus,
      status: 'pending',
      assignedRoom: null
    };
    dispatch(addBooking(newBk));
    setGuestName('');
    setShowAddBookingModal(false);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* 4 Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total bookings</span>
          <span className="text-2xl font-bold text-slate-805 block">128</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending payment</span>
          <span className="text-2xl font-bold text-amber-600 block">6</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's check-ins</span>
          <span className="text-2xl font-bold text-slate-805 block">14</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Revenue (MTD)</span>
          <span className="text-2xl font-bold text-emerald-600 block">₹4.2L</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search booking, guest or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative">
            <select 
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">Room type</option>
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Superior Room">Superior Room</option>
              <option value="Suite Room">Suite Room</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option>Date range</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => setShowAddBookingModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs"
          >
            <Plus className="h-4 w-4" /> Add Booking
          </button>
        </div>
      </div>

      {/* Booking Tabs and Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 gap-6 text-xs font-bold">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3.5 transition-all relative ${
                activeTab === tab 
                  ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">Guest</th>
                <th className="pb-3">Room Type</th>
                <th className="pb-3">Check-in / Out</th>
                <th className="pb-3">Nights</th>
                <th className="pb-3">Source</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.filter(b => {
                const matchesSearch = b.guest.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesRoom = roomTypeFilter === 'All' || b.roomType === roomTypeFilter;
                const matchesStatus = statusFilter === 'All' || b.payment === statusFilter;
                let matchesTab = true;
                if (activeTab === 'New Bookings') matchesTab = b.status === 'pending';
                else if (activeTab === 'Upcoming Check-ins') matchesTab = b.status === 'accepted' || b.status === 'roomAssigned';
                else if (activeTab === 'Upcoming Check-outs') matchesTab = b.status === 'checkedIn';
                else if (activeTab === 'Cancelled') matchesTab = b.status === 'rejected' || b.status === 'cancelled';
                return matchesSearch && matchesRoom && matchesStatus && matchesTab;
              }).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 flex items-center gap-3">
                    <div className="w-7.5 h-7.5 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-[10px]">
                      {b.initials || 'G'}
                    </div>
                    <span className="font-bold text-slate-850">{b.guest}</span>
                  </td>
                  <td className="py-3.5 text-slate-500">{b.roomType}</td>
                  <td className="py-3.5 text-slate-450">{b.dates}</td>
                  <td className="py-3.5 text-slate-500">{b.nights}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      b.source === 'Direct' ? 'bg-purple-50 text-purple-750' : b.source === 'MMT' ? 'bg-orange-50 text-orange-700' : 'bg-yellow-50 text-yellow-750'
                    }`}>{b.source}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      b.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{b.payment}</span>
                  </td>
                  <td className="py-3.5 text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      b.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                      b.status === 'accepted' ? 'bg-yellow-50 text-yellow-700' :
                      b.status === 'roomAssigned' ? 'bg-indigo-50 text-indigo-700' :
                      b.status === 'checkedIn' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {b.status === 'pending' ? 'New' : b.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAction(b.id, 'Accept')}
                            className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90"
                            title="Accept"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleAction(b.id, 'Cancel')}
                            className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all active:scale-90"
                            title="Reject"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {b.status === 'accepted' && (
                        <button
                          onClick={() => navigate('/executive/rooms')}
                          className="bg-blue-550 hover:bg-blue-600 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-xl shadow-sm transition-all"
                        >
                          Assign Room
                        </button>
                      )}
                      {b.status === 'roomAssigned' && (
                        <button
                          onClick={() => navigate('/executive/checkin-checkout')}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-xl shadow-sm transition-all"
                        >
                          Go to Check-in
                        </button>
                      )}
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
            <span>Show 5 entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span className="cursor-pointer hover:text-slate-600">3</span>
            <span>...</span>
          </div>
        </div>

      </div>

      {/* Add Booking Modal Overlay */}
      {showAddBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Add New Booking</h3>
              <button onClick={() => setShowAddBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddBooking} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Guest Name</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest name" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Room Type</label>
                  <select 
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    <option>Deluxe Room</option>
                    <option>Superior Room</option>
                    <option>Suite Room</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Payment Status</label>
                  <select 
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Nights</label>
                  <input 
                    type="number" 
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    placeholder="2"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Booking Source</label>
                  <select 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    <option>Direct</option>
                    <option>MMT</option>
                    <option>Booking.com</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Check-in Date</label>
                  <input 
                    type="text" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    placeholder="15 Jul"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2"
              >
                Create Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Room Assignment Modal Overlay */}
      {showAssignModal && bookingToAssign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-105 shadow-2xl space-y-4 animate-scale-in text-xs text-slate-805">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-805">Assign Room</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assign available room for guest</p>
              </div>
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setBookingToAssign(null);
                }} 
                className="text-slate-400 hover:text-slate-655"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 font-bold text-slate-700">
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="text-slate-900">{bookingToAssign.guest}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Type Required:</span>
                <span className="text-blue-600 uppercase text-[10px] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">{bookingToAssign.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span>Dates:</span>
                <span className="text-slate-900">{bookingToAssign.dates}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700">Select Available Room ({rooms.filter(r => r.status === 'Available' && r.type === bookingToAssign.roomType).length})</label>
              
              {(() => {
                const availableRooms = rooms.filter(r => r.status === 'Available' && r.type === bookingToAssign.roomType);
                
                if (availableRooms.length === 0) {
                  return (
                    <div className="text-center py-6 text-red-500 font-bold border border-red-100 rounded-xl bg-red-50/50">
                      ⚠️ No Available {bookingToAssign.roomType} found!
                      <p className="text-[9px] text-slate-450 font-semibold mt-1">Please mark a room as cleaned first.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-3 gap-2.5 max-h-40 overflow-y-auto pr-1">
                    {availableRooms.map(r => (
                      <button
                        key={r.number}
                        type="button"
                        onClick={() => setSelectedRoomNo(r.number)}
                        className={`p-3.5 border rounded-2xl font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                          selectedRoomNo === r.number
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20'
                            : 'border-slate-150 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="block text-sm font-black">{r.number}</span>
                        <span className="text-[9px] text-slate-400 font-semibold leading-none">{r.price}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-3 pt-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setBookingToAssign(null);
                }}
                className="flex-1 bg-white border border-slate-200 text-slate-550 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedRoomNo}
                onClick={() => {
                  dispatch(acceptBooking(bookingToAssign.id));
                  dispatch(assignRoom({ bookingId: bookingToAssign.id, roomNumber: selectedRoomNo }));
                  setShowAssignModal(false);
                  setBookingToAssign(null);
                }}
                className={`flex-1 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider text-white shadow-md
                  ${selectedRoomNo 
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
                    : 'bg-slate-350 cursor-not-allowed'}`}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomBookings;
