import React, { useState } from 'react';
import { Search, Filter, Eye, Pencil, X } from 'lucide-react';

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ amount: '', mode: '', status: '' });

  const initialPayments = [
    { id: 'PAY10001', pnr: 'PNR12345', passenger: 'Ramesh Kumar', amount: '₹2,450', mode: 'Card', date: '13 Jul 2026', status: 'Success' },
    { id: 'PAY10002', pnr: 'PNR12346', passenger: 'Suresh Babu', amount: '₹1,300', mode: 'UPI', date: '13 Jul 2026', status: 'Success' },
    { id: 'PAY10003', pnr: 'PNR12347', passenger: 'Anitha Devi', amount: '₹2,950', mode: 'UPI', date: '13 Jul 2026', status: 'Success' },
    { id: 'PAY10004', pnr: 'PNR12348', passenger: 'Vijay Kumar', amount: '₹1,000', mode: 'Net Banking', date: '13 Jul 2026', status: 'Success' },
    { id: 'PAY10005', pnr: 'PNR12349', passenger: 'Karthik R', amount: '₹1,400', mode: 'Card', date: '13 Jul 2026', status: 'Refunded' },
    { id: 'PAY10006', pnr: 'PNR12350', passenger: 'Meena Priya', amount: '₹2,500', mode: 'UPI', date: '14 Jul 2026', status: 'Pending' },
    { id: 'PAY10007', pnr: 'PNR12351', passenger: 'Arun Prasad', amount: '₹1,800', mode: 'Card', date: '14 Jul 2026', status: 'Success' },
    { id: 'PAY10008', pnr: 'PNR12352', passenger: 'Gokul S', amount: '₹1,800', mode: 'Card', date: '14 Jul 2026', status: 'Success' }
  ];

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('travel_payments');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_payments', JSON.stringify(initialPayments));
    return initialPayments;
  });

  const savePayments = (newPayments) => {
    setPayments(newPayments);
    localStorage.setItem('travel_payments', JSON.stringify(newPayments));
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setEditForm({
      amount: payment.amount.replace('₹', '').replace(',', ''),
      mode: payment.mode,
      status: payment.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formattedAmount = '₹' + Number(editForm.amount).toLocaleString('en-IN');
    const updated = payments.map(p => 
      p.id === selectedPayment.id 
        ? { ...p, amount: formattedAmount, mode: editForm.mode, status: editForm.status } 
        : p
    );
    savePayments(updated);
    setIsEditModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search payments by PNR / Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="h-4 w-4 text-slate-450" /> Filter
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">Payment ID</th>
                <th className="pb-3">PNR</th>
                <th className="pb-3">Passenger</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment Mode</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.filter(p => p.passenger.toLowerCase().includes(searchQuery.toLowerCase()) || p.pnr.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 font-bold text-slate-800">{p.id}</td>
                  <td className="py-3.5 font-bold text-blue-600">{p.pnr}</td>
                  <td className="py-3.5 font-bold text-slate-850">{p.passenger}</td>
                  <td className="py-3.5 font-extrabold text-slate-800">{p.amount}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{p.mode}</td>
                  <td className="py-3.5 text-slate-450">{p.date}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      p.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      p.status === 'Pending' ? 'bg-yellow-50 text-yellow-750' :
                      'bg-red-50 text-red-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(p)}
                        className="text-slate-400 hover:text-blue-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="text-slate-400 hover:text-yellow-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="Edit Payment"
                      >
                        <Pencil className="h-4 w-4" />
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
            <span>Showing 1 to {payments.length} of 1248 entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span>...</span>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {isViewModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4 relative animate-scale-up">
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Payment details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Payment ID</span>
                <span className="text-slate-800 font-bold text-sm">{selectedPayment.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">PNR</span>
                <span className="text-blue-600 font-bold text-sm">{selectedPayment.pnr}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px]">Passenger</span>
                <span className="text-slate-800 font-extrabold text-sm">{selectedPayment.passenger}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Amount</span>
                <span className="text-slate-850 font-black text-sm">{selectedPayment.amount}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Payment Mode</span>
                <span className="text-slate-700 font-bold">{selectedPayment.mode}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Transaction Date</span>
                <span className="text-slate-600 font-bold">{selectedPayment.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 ${
                  selectedPayment.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  selectedPayment.status === 'Pending' ? 'bg-yellow-50 text-yellow-750' :
                  'bg-red-50 text-red-700'
                }`}>{selectedPayment.status}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4 relative animate-scale-up">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Edit Payment Info</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] mb-1">Payment ID</span>
                <span className="text-slate-800 font-bold text-sm">{selectedPayment.id} ({selectedPayment.passenger})</span>
              </div>
              <div className="space-y-1">
                <label className="block text-slate-450">Amount (₹)</label>
                <input 
                  type="number" 
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-450">Payment Mode</label>
                <select 
                  value={editForm.mode}
                  onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                >
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-slate-450">Status</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                >
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Save Changes
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
