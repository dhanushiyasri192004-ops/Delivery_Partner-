import React, { useState } from 'react';
import { Search, Filter, Eye, Trash, X } from 'lucide-react';

const Passengers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialPassengers = [
    { name: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@gmail.com', bookings: 12 },
    { name: 'Suresh Babu', phone: '9123456780', email: 'suresh@gmail.com', bookings: 8 },
    { name: 'Anitha Devi', phone: '9345678901', email: 'anitha@gmail.com', bookings: 5 },
    { name: 'Vijay Kumar', phone: '9012345678', email: 'vijay@gmail.com', bookings: 7 },
    { name: 'Meena Priya', phone: '9444156775', email: 'meena@gmail.com', bookings: 6 },
    { name: 'Arun Prasad', phone: '9008765432', email: 'arun@gmail.com', bookings: 4 },
    { name: 'Karthik R', phone: '9811223344', email: 'karthik@gmail.com', bookings: 9 },
    { name: 'Gokul S', phone: '9867766554', email: 'gokul@gmail.com', bookings: 6 }
  ];

  const [passengers, setPassengers] = useState(() => {
    const saved = localStorage.getItem('travel_passengers');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_passengers', JSON.stringify(initialPassengers));
    return initialPassengers;
  });

  const savePassengers = (newPassengers) => {
    setPassengers(newPassengers);
    localStorage.setItem('travel_passengers', JSON.stringify(newPassengers));
  };

  const handleDeletePassenger = (phone) => {
    const updated = passengers.filter(p => p.phone !== phone);
    savePassengers(updated);
  };

  const handleViewDetails = (passenger) => {
    setSelectedPassenger(passenger);
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
            placeholder="Search passenger..." 
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

      {/* Passengers Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">Name</th>
                <th className="pb-3">Mobile</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Total Bookings</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {passengers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
                <tr key={p.phone} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 font-extrabold text-slate-850">{p.name}</td>
                  <td className="py-3.5 text-slate-500 font-bold">{p.phone}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{p.email}</td>
                  <td className="py-3.5 font-extrabold text-slate-800">{p.bookings}</td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button 
                        onClick={() => handleViewDetails(p)}
                        className="text-slate-400 hover:text-blue-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePassenger(p.phone)} 
                        className="text-slate-400 hover:text-red-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="Delete Passenger"
                      >
                        <Trash className="h-4 w-4" />
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
            <span>Showing 1 to {passengers.length} of 3429 entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span className="cursor-pointer hover:text-slate-600">3</span>
            <span>...</span>
          </div>
        </div>
      </div>

      {/* Passenger View Details Modal */}
      {isModalOpen && selectedPassenger && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4 relative animate-scale-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Passenger Profile Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px]">Full Name</span>
                <span className="text-slate-800 font-extrabold text-sm">{selectedPassenger.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Mobile</span>
                <span className="text-slate-800 font-bold">{selectedPassenger.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Email Address</span>
                <span className="text-slate-650 font-bold">{selectedPassenger.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Total Bookings Count</span>
                <span className="text-slate-850 font-black text-sm">{selectedPassenger.bookings} trips</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Customer Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 bg-emerald-50 text-emerald-700 border-emerald-100">
                  Verified Active
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

export default Passengers;
