import React, { useState } from 'react';
import { Search, Plus, Eye, X } from 'lucide-react';

const GuestManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const initialGuests = [
    { name: 'Amit Sharma', phone: '9876543210', email: 'amit@gmail.com', bookings: 5 },
    { name: 'Priya Patel', phone: '9123456780', email: 'priya@gmail.com', bookings: 3 },
    { name: 'Rahul Verma', phone: '9988776655', email: 'rahul@gmail.com', bookings: 4 },
    { name: 'Sneha Iyer', phone: '9811223344', email: 'sneha@gmail.com', bookings: 2 },
    { name: 'Vikram Singh', phone: '9012343334', email: 'vikram@gmail.com', bookings: 1 }
  ];

  const [guests, setGuests] = useState(initialGuests);

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newGuest = {
      name: newName,
      phone: newPhone || 'N/A',
      email: newEmail || 'N/A',
      bookings: 1
    };
    setGuests([newGuest, ...guests]);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Search Bar & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search guest..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Guest
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Phone No.</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Total Bookings</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 font-extrabold text-slate-850">{g.name}</td>
                  <td className="py-3.5 text-slate-500 font-bold">{g.phone}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{g.email}</td>
                  <td className="py-3.5 font-extrabold text-slate-800">{g.bookings}</td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={() => setSelectedGuest(g)}
                      className="text-slate-400 hover:text-blue-600 transition-all font-bold inline-flex items-center"
                    >
                      <Eye className="h-4 w-4" />
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

      {/* Add Guest Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Add New Guest Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddGuest} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Guest Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter full name" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input 
                  type="tel" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter phone number" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2"
              >
                Create Guest Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Guest Details Modal Overlay */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in text-xs font-semibold text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Guest Profile Summary</h3>
              <button onClick={() => setSelectedGuest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                <span className="text-slate-400">Full Name</span>
                <span className="font-extrabold text-slate-800">{selectedGuest.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                <span className="text-slate-400">Phone No.</span>
                <span className="font-extrabold text-slate-800">{selectedGuest.phone}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                <span className="text-slate-400">Email ID</span>
                <span className="font-extrabold text-slate-800">{selectedGuest.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Completed Stays</span>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{selectedGuest.bookings}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GuestManagement;
