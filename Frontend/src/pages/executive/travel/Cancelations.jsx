import React, { useState } from 'react';
import { Search, Filter, Eye, X } from 'lucide-react';

const Cancelations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCancellation, setSelectedCancellation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialCancellations = [
    { pnr: 'PNR12348', passenger: 'Vijay Kumar', route: 'Trichy → Salem', date: '13 Jul 2026', amount: '₹1,000', cancelledOn: '14 Jul 2026 10:30 AM', reason: 'Change of Plan', status: 'Refunded' },
    { pnr: 'PNR12354', passenger: 'Kailash R', route: 'Coimbatore → Kochi', date: '15 Jul 2026', amount: '₹1,400', cancelledOn: '14 Jul 2026 11:20 AM', reason: 'Personal Reason', status: 'Refunded' },
    { pnr: 'PNR12356', passenger: 'Pradeep P', route: 'Bangalore → Mysore', date: '16 Jul 2026', amount: '₹1,800', cancelledOn: '14 Jul 2026 11:35 AM', reason: 'Found Another Bus', status: 'Refunded' },
    { pnr: 'PNR12358', passenger: 'Janani S', route: 'Trichy → Salem', date: '17 Jul 2026', amount: '₹1,850', cancelledOn: '14 Jul 2026 11:40 AM', reason: 'Emergency', status: 'Refunded' },
    { pnr: 'PNR12359', passenger: 'Manoj G', route: 'Chennai → Coimbatore', date: '18 Jul 2026', amount: '₹2,450', cancelledOn: '14 Jul 2026 11:55 AM', reason: 'Schedule Change', status: 'Refunded' }
  ];

  const [cancellations, setCancellations] = useState(() => {
    const saved = localStorage.getItem('travel_cancellations');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_cancellations', JSON.stringify(initialCancellations));
    return initialCancellations;
  });

  const handleViewDetails = (cancellation) => {
    setSelectedCancellation(cancellation);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search cancellations by PNR / Name..." 
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

      {/* Cancellations Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">PNR</th>
                <th className="pb-3">Passenger</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Journey Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Cancelled On</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cancellations.filter(c => c.passenger.toLowerCase().includes(searchQuery.toLowerCase()) || c.pnr.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                <tr key={c.pnr} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 font-bold text-blue-600">{c.pnr}</td>
                  <td className="py-3.5 font-bold text-slate-850">{c.passenger}</td>
                  <td className="py-3.5 text-slate-500 font-bold">{c.route}</td>
                  <td className="py-3.5 text-slate-450">{c.date}</td>
                  <td className="py-3.5 font-extrabold text-slate-800">{c.amount}</td>
                  <td className="py-3.5 text-slate-450">{c.cancelledOn}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{c.reason}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">{c.status}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleViewDetails(c)}
                        className="text-slate-400 hover:text-blue-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
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
            <span>Showing 1 to {cancellations.length} of 186 entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span>...</span>
          </div>
        </div>
      </div>

      {/* Cancellation Details Modal */}
      {isModalOpen && selectedCancellation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4 relative animate-scale-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Cancellation details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">PNR</span>
                <span className="text-blue-600 font-bold text-sm">{selectedCancellation.pnr}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Passenger</span>
                <span className="text-slate-850 font-bold text-sm">{selectedCancellation.passenger}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px]">Route</span>
                <span className="text-slate-800 font-extrabold">{selectedCancellation.route}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Journey Date</span>
                <span className="text-slate-600 font-bold">{selectedCancellation.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Refund Amount</span>
                <span className="text-slate-850 font-black text-sm">{selectedCancellation.amount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px]">Cancelled Timestamp</span>
                <span className="text-slate-700 font-bold">{selectedCancellation.cancelledOn}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px]">Cancellation Reason</span>
                <span className="text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-105 block mt-0.5">
                  {selectedCancellation.reason}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 bg-red-50 text-red-700 border border-red-100">
                  {selectedCancellation.status}
                </span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cancelations;
