import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, ChevronDown, Search, CheckCircle, Edit, Trash2, Save, Info } from 'lucide-react';
import { assignRoom, addRoom, updateRoom, deleteRoom } from '../../../redux/slices/staySlice';

const RoomManagement = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.stay.rooms);
  const bookings = useSelector(state => state.stay.bookings);

  const [activeFilter, setActiveFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Room details / edit / delete state
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editRoomType, setEditRoomType] = useState('');
  const [editRoomStatus, setEditRoomStatus] = useState('');
  const [editRoomPrice, setEditRoomPrice] = useState('');
  const [editRoomGuest, setEditRoomGuest] = useState('');
  const [editRoomCheckout, setEditRoomCheckout] = useState('');

  // Add Room form state
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newRoomType, setNewRoomType] = useState('Deluxe Room');
  const [newRoomStatus, setNewRoomStatus] = useState('Available');
  const [newRoomPrice, setNewRoomPrice] = useState('3,200');

  // Accepted bookings that don't have an assigned room yet
  const unassignedBookings = bookings.filter(b => b.status === 'accepted' && !b.assignedRoom);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomNo) return;
    dispatch(addRoom({
      number: newRoomNo,
      type: newRoomType,
      status: newRoomStatus,
      price: `₹${parseFloat(newRoomPrice.replace(/[^0-9]/g, '')).toLocaleString('en-IN')}`,
      guest: null,
      checkout: null
    }));
    setNewRoomNo('');
    setShowAddRoomModal(false);
  };

  useEffect(() => {
    if (unassignedBookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(unassignedBookings[0].id);
    }
  }, [unassignedBookings, selectedBookingId]);

  const counts = {
    All: rooms.length,
    Available: rooms.filter(r => r.status === 'Available').length,
    Occupied: rooms.filter(r => r.status === 'Occupied').length,
    Cleaning: rooms.filter(r => r.status === 'Cleaning').length,
    Maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    Reserved: rooms.filter(r => r.status === 'Reserved').length,
  };

  const filters = [
    { label: 'All', count: counts.All },
    { label: 'Available', count: counts.Available },
    { label: 'Occupied', count: counts.Occupied },
    { label: 'Cleaning', count: counts.Cleaning },
    { label: 'Maintenance', count: counts.Maintenance },
    { label: 'Reserved', count: counts.Reserved }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-850">
      
      {/* Room Assignment Panel */}
      {unassignedBookings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm flex items-center gap-2">
              🔑 Room Assignment Mode
            </h4>
            <p className="text-[11px] opacity-90 font-medium">
              Select an accepted booking below, then click "Assign Room" on any matching Available room card.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {unassignedBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.guest} — {b.roomType} ({b.dates})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="bg-white/20 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider block">
              {unassignedBookings.length} Awaiting Assignment
            </span>
          </div>
        </div>
      )}

      {/* Status & Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                activeFilter === f.label 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-extrabold' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="relative">
            <select 
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">Floor: all</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search room no..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          <button 
            onClick={() => setShowAddRoomModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Room
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.filter(r => {
          const matchesFilter = activeFilter === 'All' || r.status === activeFilter;
          const matchesFloor = floorFilter === 'all' || r.number.startsWith(floorFilter);
          const matchesSearch = r.number.includes(searchQuery) || r.type.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesFilter && matchesFloor && matchesSearch;
        }).map((r) => {
          const activeBooking = unassignedBookings.find(b => b.id === selectedBookingId);
          const canAssign = activeBooking && r.status === 'Available' && r.type === activeBooking.roomType;
          
          let cardStyle = {
            bg: 'bg-white border-slate-105',
            label: 'text-slate-455',
            number: 'text-slate-805',
            type: 'text-slate-450',
            price: 'text-slate-805',
            detail: 'text-slate-400',
            badge: 'bg-slate-50 text-slate-500 border-slate-150'
          };

          if (r.status === 'Occupied') {
            cardStyle = {
              bg: 'bg-blue-50/75 border-blue-200/60 shadow-sm shadow-blue-50/50',
              label: 'text-blue-600/70',
              number: 'text-blue-900',
              type: 'text-blue-700/80',
              price: 'text-blue-900',
              detail: 'text-blue-600/80',
              badge: 'bg-blue-600 text-white border-blue-600'
            };
          } else if (r.status === 'Available') {
            cardStyle = {
              bg: 'bg-emerald-50/75 border-emerald-200/60 shadow-sm shadow-emerald-50/50',
              label: 'text-emerald-600/70',
              number: 'text-emerald-900',
              type: 'text-emerald-700/80',
              price: 'text-emerald-900',
              detail: 'text-emerald-600/80',
              badge: 'bg-emerald-600 text-white border-emerald-600'
            };
          } else if (r.status === 'Cleaning') {
            cardStyle = {
              bg: 'bg-orange-50/75 border-orange-200/60 shadow-sm shadow-orange-50/50',
              label: 'text-orange-600/70',
              number: 'text-orange-900',
              type: 'text-orange-700/80',
              price: 'text-orange-900',
              detail: 'text-orange-600/80',
              badge: 'bg-orange-500 text-white border-orange-500'
            };
          } else if (r.status === 'Maintenance') {
            cardStyle = {
              bg: 'bg-red-50/75 border-red-200/60 shadow-sm shadow-red-50/50',
              label: 'text-red-600/70',
              number: 'text-red-900',
              type: 'text-red-700/80',
              price: 'text-red-900',
              detail: 'text-red-600/80',
              badge: 'bg-red-600 text-white border-red-600'
            };
          } else if (r.status === 'Reserved') {
            cardStyle = {
              bg: 'bg-[#efebe9]/70 border-[#d7ccc8]/60 shadow-sm shadow-stone-100/50',
              label: 'text-[#8d6e63]',
              number: 'text-[#3e2723]',
              type: 'text-[#5d4037]/80',
              price: 'text-[#3e2723]',
              detail: 'text-[#6d4c41]/80',
              badge: 'bg-[#5d4037] text-white border-[#5d4037]'
            };
          }

          // Set detail text dynamically based on status
          let roomDetail = 'Ready for guests';
          if (r.status === 'Occupied') roomDetail = `${r.guest || 'Guest'} · out ${r.checkout || 'today'}`;
          else if (r.status === 'Reserved') roomDetail = `${r.guest || 'Guest'} · Reserved`;
          else if (r.status === 'Cleaning') roomDetail = 'Cleaning in progress';
          else if (r.status === 'Maintenance') roomDetail = 'Under inspection';

          return (
            <div 
              key={r.number} 
              onClick={() => {
                if (!canAssign) {
                  setSelectedRoomForDetail(r);
                  setIsEditingRoom(false);
                  setEditRoomType(r.type);
                  setEditRoomStatus(r.status);
                  setEditRoomPrice(r.price.replace(/[^\d]/g, ''));
                  setEditRoomGuest(r.guest || '');
                  setEditRoomCheckout(r.checkout || '');
                }
              }}
              className={`${cardStyle.bg} border p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between h-52 hover:shadow-md transition-all cursor-pointer ${canAssign ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
            >
              <div>
                <span className={`block text-[9px] font-bold uppercase tracking-wider ${cardStyle.label}`}>Room</span>
                <span className={`text-xl font-bold block leading-tight ${cardStyle.number}`}>{r.number}</span>
                <span className={`text-[10px] font-semibold block mt-0.5 ${cardStyle.type}`}>{r.type}</span>
              </div>
              
              <div className="my-2">
                <span className={`text-xs font-black ${cardStyle.price}`}>{r.price}</span>
                <span className={`text-[9px] font-semibold ${cardStyle.detail}`}> / night</span>
                <span className={`block text-[9px] font-medium mt-1 truncate ${cardStyle.detail}`}>{roomDetail}</span>
              </div>

              {canAssign ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(assignRoom({ bookingId: selectedBookingId, roomNumber: r.number }));
                    setSelectedBookingId('');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase py-2 rounded-xl transition-all shadow shadow-blue-100 active:scale-95 mt-2"
                >
                  Assign Room
                </button>
              ) : (
                <span className={`text-[8.5px] font-extrabold uppercase mt-2.5 block py-1 border rounded-lg ${cardStyle.badge}`}>
                  {r.status}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-xs text-slate-405 font-bold">
        <div>
          <span>Show 12 entries</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="cursor-pointer text-slate-800">1</span>
          <span className="cursor-pointer hover:text-slate-600">2</span>
          <span className="cursor-pointer hover:text-slate-600">3</span>
          <span>...</span>
        </div>
      </div>

      {/* ── ADD ROOM MODAL ── */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Add New Room</h3>
                  <p className="text-blue-100 text-[10px] font-semibold">Define room number and category properties</p>
                </div>
              </div>
              <button onClick={() => setShowAddRoomModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-3.5">
                {/* Room Number */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 113"
                    value={newRoomNo}
                    onChange={(e) => setNewRoomNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Room Type */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Room Category *</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Superior Room">Superior Room</option>
                    <option value="Suite Room">Suite Room</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Initial Status *</label>
                  <select
                    value={newRoomStatus}
                    onChange={(e) => setNewRoomStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Price per Night (₹) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3,200"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md active:scale-95"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ROOM DETAILS / EDIT / DELETE MODAL ── */}
      {selectedRoomForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Room {selectedRoomForDetail.number} Details</h3>
                  <p className="text-blue-100 text-[10px] font-semibold">
                    {isEditingRoom ? 'Editing room configuration' : 'View, edit, or remove this room'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRoomForDetail(null)} 
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isEditingRoom ? (
              /* EDIT FORM */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(updateRoom({
                    number: selectedRoomForDetail.number,
                    type: editRoomType,
                    status: editRoomStatus,
                    price: `₹${parseFloat(editRoomPrice.replace(/[^0-9]/g, '')).toLocaleString('en-IN')}`,
                    guest: editRoomGuest || null,
                    checkout: editRoomCheckout || null
                  }));
                  setSelectedRoomForDetail(null);
                }} 
                className="p-5 space-y-4 text-xs font-semibold text-slate-700"
              >
                <div className="space-y-3.5">
                  {/* Room Type */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Room Category</label>
                    <select
                      value={editRoomType}
                      onChange={(e) => setEditRoomType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Superior Room">Superior Room</option>
                      <option value="Suite Room">Suite Room</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Price per Night (₹)</label>
                    <input
                      type="text"
                      required
                      value={editRoomPrice}
                      onChange={(e) => setEditRoomPrice(e.target.value)}
                      placeholder="e.g. 3,200"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Status</label>
                    <select
                      value={editRoomStatus}
                      onChange={(e) => setEditRoomStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>

                  {/* Show Guest and Checkout fields if Occupied or Reserved */}
                  {(editRoomStatus === 'Occupied' || editRoomStatus === 'Reserved') && (
                    <>
                      <div className="space-y-1 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Guest Name</label>
                        <input
                          type="text"
                          required
                          value={editRoomGuest}
                          onChange={(e) => setEditRoomGuest(e.target.value)}
                          placeholder="Guest Full Name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Checkout / Booking Dates</label>
                        <input
                          type="text"
                          required
                          value={editRoomCheckout}
                          onChange={(e) => setEditRoomCheckout(e.target.value)}
                          placeholder="e.g. 17 Jul"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingRoom(false)}
                    className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold py-2.5 rounded-xl transition-all text-xs"
                  >
                    Back to Details
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* DETAIL VIEW */
              <div className="p-6 space-y-5 text-xs font-semibold text-slate-700">
                <div className="space-y-3.5">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Room Number</span>
                    <span className="font-extrabold text-slate-800">{selectedRoomForDetail.number}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Category</span>
                    <span className="font-extrabold text-slate-850">{selectedRoomForDetail.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Price / Night</span>
                    <span className="font-extrabold text-slate-850">{selectedRoomForDetail.price}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Status</span>
                    <span className="font-extrabold text-slate-800">{selectedRoomForDetail.status}</span>
                  </div>
                  {selectedRoomForDetail.guest && (
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400">Guest</span>
                      <span className="font-extrabold text-blue-600">{selectedRoomForDetail.guest}</span>
                    </div>
                  )}
                  {selectedRoomForDetail.checkout && (
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400">Checkout / Dates</span>
                      <span className="font-extrabold text-slate-700">{selectedRoomForDetail.checkout}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditingRoom(true)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 border border-blue-100"
                    >
                      <Edit className="h-4 w-4" /> Edit Room
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete Room ${selectedRoomForDetail.number}?`)) {
                          dispatch(deleteRoom(selectedRoomForDetail.number));
                          setSelectedRoomForDetail(null);
                        }
                      }}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 border border-red-100"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Room
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedRoomForDetail(null)}
                    className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold py-2.5 rounded-xl transition-all text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomManagement;
