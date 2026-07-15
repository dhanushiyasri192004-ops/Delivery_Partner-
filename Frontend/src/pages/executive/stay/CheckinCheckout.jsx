import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkInGuest, checkOutGuest } from '../../../redux/slices/staySlice';
import { X, User, Phone, CreditCard, Users, MessageSquare, CheckCircle, LogIn, LogOut } from 'lucide-react';

const CheckinCheckout = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.stay.bookings);

  const [activeTab, setActiveTab] = useState('Check-in');
  const tabs = ['Check-in', 'Check-out'];

  // Modals
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Check-in form fields
  const [idType, setIdType] = useState('Aadhar Card');
  const [idNumber, setIdNumber] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  const checkInList = bookings.filter(b => b.status === 'roomAssigned');
  const checkOutList = bookings.filter(b => b.status === 'checkedIn');
  const currentList = activeTab === 'Check-in' ? checkInList : checkOutList;

  const openCheckinModal = (booking) => {
    setSelectedBooking(booking);
    setIdType('Aadhar Card');
    setIdNumber('');
    setGuestCount('1');
    setPhone('');
    setSpecialRequest('');
    setCheckinSuccess(false);
    setShowCheckinModal(true);
  };

  const openCheckoutModal = (booking) => {
    setSelectedBooking(booking);
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckin = () => {
    if (!idNumber || !phone) return;
    setCheckinSuccess(true);
    setTimeout(() => {
      dispatch(checkInGuest(selectedBooking.id));
      setShowCheckinModal(false);
      setCheckinSuccess(false);
    }, 1400);
  };

  const handleConfirmCheckout = () => {
    dispatch(checkOutGuest(selectedBooking.id));
    setShowCheckoutModal(false);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">

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
              {tab === 'Check-in' && checkInList.length > 0 && (
                <span className="ml-1.5 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px]">
                  {checkInList.length}
                </span>
              )}
              {tab === 'Check-out' && checkOutList.length > 0 && (
                <span className="ml-1.5 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px]">
                  {checkOutList.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">Guest Name</th>
                <th className="pb-3">Room No.</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Nights</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400 text-xs font-medium">
                    No guests pending {activeTab.toLowerCase()}
                  </td>
                </tr>
              ) : (
                currentList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                          {b.initials || (b.guest?.substring(0,2).toUpperCase())}
                        </div>
                        <span className="font-extrabold text-slate-850">{b.guest}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-indigo-700">Room #{b.assignedRoom}</td>
                    <td className="py-3.5 text-slate-450">{b.dates}</td>
                    <td className="py-3.5 text-slate-500">{b.nights}N</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        b.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>{b.payment}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      {activeTab === 'Check-in' ? (
                        <button
                          onClick={() => openCheckinModal(b)}
                          className="flex items-center gap-1.5 ml-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-xl transition-all shadow-sm shadow-blue-200 active:scale-95"
                        >
                          <LogIn className="h-3 w-3" /> Check-in
                        </button>
                      ) : (
                        <button
                          onClick={() => openCheckoutModal(b)}
                          className="flex items-center gap-1.5 ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-xl transition-all shadow-sm shadow-emerald-200 active:scale-95"
                        >
                          <LogOut className="h-3 w-3" /> Check-out
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none">
              <option>5</option>
              <option>10</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-300 pointer-events-none">&lt;</button>
            <button className="text-blue-600 font-black">1</button>
            <button className="hover:text-slate-600">2</button>
            <button className="hover:text-slate-600">3</button>
            <span>...</span>
            <button className="hover:text-slate-600">&gt;</button>
          </div>
        </div>
      </div>

      {/* ── CHECK-IN VERIFICATION MODAL ── */}
      {showCheckinModal && selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Guest Check-in Verification</h3>
                  <p className="text-blue-100 text-[10px] font-semibold">Verify guest details before check-in</p>
                </div>
              </div>
              <button onClick={() => setShowCheckinModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Booking Summary Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Guest Name</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.guest}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Room No.</span>
                  <span className="font-extrabold text-indigo-700">Room #{selectedBooking.assignedRoom}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Check-in / Check-out</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.dates}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Room Type</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.roomType}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Booking ID</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.id}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Payment</span>
                  <span className={`font-extrabold ${selectedBooking.payment === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedBooking.payment}
                  </span>
                </div>
              </div>

              {/* Verification Form */}
              <div className="space-y-3 text-xs">
                <p className="font-extrabold text-slate-700 text-[11px] flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-blue-500" /> ID Verification
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* ID Type */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] block">ID Proof Type *</label>
                    <select
                      value={idType}
                      onChange={e => setIdType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Aadhar Card</option>
                      <option>Passport</option>
                      <option>Driving License</option>
                      <option>Voter ID</option>
                      <option>PAN Card</option>
                    </select>
                  </div>

                  {/* ID Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] block">ID Number *</label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      placeholder="e.g. 1234 5678 9012"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] block">
                      <Phone className="inline h-3 w-3 mr-0.5" /> Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* No. of Guests */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] block">
                      <Users className="inline h-3 w-3 mr-0.5" /> No. of Guests *
                    </label>
                    <select
                      value={guestCount}
                      onChange={e => setGuestCount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {['1','2','3','4','5','6'].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Special Request */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 text-[10px] block">
                    <MessageSquare className="inline h-3 w-3 mr-0.5" /> Special Requests (optional)
                  </label>
                  <textarea
                    value={specialRequest}
                    onChange={e => setSpecialRequest(e.target.value)}
                    placeholder="e.g. High floor, extra pillows, late checkout..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Success message */}
              {checkinSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-700 text-xs font-bold">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  Guest checked in successfully! Room #{selectedBooking.assignedRoom} is now Occupied.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowCheckinModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckin}
                  disabled={!idNumber || !phone || checkinSuccess}
                  className={`flex-1 font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2
                    ${idNumber && phone && !checkinSuccess
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                      : 'bg-slate-300 cursor-not-allowed'}`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Confirm Check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHECK-OUT CONFIRMATION MODAL ── */}
      {showCheckoutModal && selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Confirm Check-out</h3>
                  <p className="text-emerald-100 text-[10px] font-semibold">Review before releasing the room</p>
                </div>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">

              {/* Guest summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Guest Name</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.guest}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Room No.</span>
                  <span className="font-extrabold text-indigo-700">Room #{selectedBooking.assignedRoom}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Stay Period</span>
                  <span className="font-extrabold text-slate-800">{selectedBooking.dates}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Payment</span>
                  <span className={`font-extrabold ${selectedBooking.payment === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedBooking.payment}
                  </span>
                </div>
              </div>

              {/* Warning info */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 text-amber-700 font-semibold text-[11px] space-y-1">
                <p className="font-extrabold">⚠️ Before checking out, confirm:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                  <li>All pending dues have been collected</li>
                  <li>Room key / card has been returned</li>
                  <li>Guest has settled any extra charges</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Confirm Check-out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckinCheckout;
