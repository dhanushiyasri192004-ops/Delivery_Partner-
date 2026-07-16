import React, { useState } from 'react';
import { ChevronDown, Edit, X, Save, Info, Check } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 'PAY1001', guest: 'Amit Sharma', room: '101', amount: 5600, status: 'Paid', date: '15 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1002', guest: 'Priya Patel', room: '202', amount: 8500, status: 'Paid', date: '18 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1003', guest: 'Rahul Verma', room: '305', amount: 7500, status: 'Pending', date: '16 Jul', statusStyle: 'bg-amber-50 text-amber-700' },
    { id: 'PAY1004', guest: 'Sneha Iyer', room: '104', amount: 6000, status: 'Paid', date: '17 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' },
    { id: 'PAY1005', guest: 'Vikram Singh', room: '402', amount: 7800, status: 'Paid', date: '18 Jul', statusStyle: 'bg-emerald-50 text-emerald-700' }
  ]);

  const [activeTab, setActiveTab] = useState('All (20)');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Edit Payment State
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState(null);
  const [editGuest, setEditGuest] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDate, setEditDate] = useState('');

  const renderPaymentOrMembership = (amount, guestName, status) => {
    const membershipMap = {
      'Priya Patel': 'MC Gold',
      'Amit Sharma': 'MC Silver',
      'Sneha Iyer': 'MC Diamond',
      'Vikram Singh': 'MC Gold'
    };
    const memberCard = membershipMap[guestName];
    if (memberCard && status === 'Paid') {
      let badgeColor = 'bg-slate-100 text-slate-700 border-slate-205';
      if (memberCard === 'MC Gold') badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200';
      if (memberCard === 'MC Diamond') badgeColor = 'bg-cyan-50 text-cyan-700 border border-cyan-200';
      if (memberCard === 'MC Silver') badgeColor = 'bg-slate-100 text-slate-600 border border-slate-200';
      return (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${badgeColor}`}>
          {memberCard}
        </span>
      );
    }
    return <span className="font-black text-slate-805">₹ {parseFloat(amount).toLocaleString('en-IN')}</span>;
  };

  const tabs = ['All (20)', 'Paid (15)', 'Pending (5)'];

  const handleEditClick = (p) => {
    setSelectedPaymentForEdit(p);
    setEditGuest(p.guest);
    setEditRoom(p.room);
    setEditAmount(p.amount.toString());
    setEditStatus(p.status);
    setEditDate(p.date);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setPayments(payments.map(p => {
      if (p.id === selectedPaymentForEdit.id) {
        return {
          ...p,
          guest: editGuest,
          room: editRoom,
          amount: parseFloat(editAmount.replace(/[^0-9.]/g, '')) || 0,
          status: editStatus,
          date: editDate,
          statusStyle: editStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        };
      }
      return p;
    }));
    setSelectedPaymentForEdit(null);
  };

  // Filter payments list
  const filteredPayments = payments.filter(p => {
    // Tab filter
    if (activeTab === 'Paid (15)' && p.status !== 'Paid') return false;
    if (activeTab === 'Pending (5)' && p.status !== 'Pending') return false;

    // Dropdown filter
    if (statusFilter !== 'All Status' && p.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Filter Options */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                activeTab === tab 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-505 pointer-events-none" />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3">Payment ID</th>
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Room No</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 font-bold text-slate-805">{p.id}</td>
                  <td className="py-3.5 font-extrabold text-slate-850">{p.guest}</td>
                  <td className="py-3.5 text-slate-500 font-bold">Room #{p.room}</td>
                  <td className="py-3.5">
                    {renderPaymentOrMembership(p.amount, p.guest, p.status)}
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ['Priya Patel', 'Amit Sharma', 'Sneha Iyer', 'Vikram Singh'].includes(p.guest) && p.status === 'Paid'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : p.statusStyle
                    }`}>
                      {['Priya Patel', 'Amit Sharma', 'Sneha Iyer', 'Vikram Singh'].includes(p.guest) && p.status === 'Paid'
                        ? 'MC CARD'
                        : p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-bold">{p.date}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-1.5 rounded-lg border border-blue-100 text-blue-605 hover:bg-blue-50 transition-all font-bold"
                      title="Edit Payment"
                    >
                      <Edit className="h-3.5 w-3.5 inline mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none">
              <option>12</option>
              <option>24</option>
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

      {/* ── EDIT PAYMENT MODAL ── */}
      {selectedPaymentForEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Edit Payment Details</h3>
                  <p className="text-blue-100 text-[10px] font-semibold">Modify billing record #{selectedPaymentForEdit.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPaymentForEdit(null)} 
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-3.5">
                {/* Guest Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={editGuest}
                    onChange={(e) => setEditGuest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Room No */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Room Number</label>
                  <input
                    type="text"
                    required
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Amount (₹)</label>
                  <input
                    type="text"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Payment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Billing Date</label>
                  <input
                    type="text"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentForEdit(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-605 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
