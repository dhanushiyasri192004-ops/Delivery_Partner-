import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceHistory } from '../../redux/slices/technicianSlice';
import { 
  Wrench, 
  Calendar, 
  CheckCircle, 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Award, 
  Star, 
  AlertTriangle,
  XCircle,
  MessageSquare,
  Package
} from 'lucide-react';

const CompletedServices = () => {
  const dispatch = useDispatch();
  const { history = [] } = useSelector((state) => state.technician);

  useEffect(() => {
    dispatch(fetchServiceHistory());
  }, [dispatch]);

  // Seeding mock completed history fallback
  const mockCompletedHistory = [
    { _id: 'SRV-882740', customerName: 'Suresh Babu', createdAt: '2026-07-09T09:00:00.000Z', status: 'COMPLETED', earnings: 350, serviceType: 'Washing Machine Drum Repair', rating: 5, feedback: 'Highly professional, resolved the drum vibrations in 30 minutes.' },
    { _id: 'SRV-882739', customerName: 'Meena Sharma', createdAt: '2026-07-08T10:30:00.000Z', status: 'COMPLETED', earnings: 1200, serviceType: 'Washing Machine Installation', rating: 5, feedback: 'Neat installation. Explained the new settings clearly.' },
    { _id: 'SRV-882738', customerName: 'Ravi Teja', createdAt: '2026-07-05T14:00:00.000Z', status: 'CANCELLED', earnings: 0, serviceType: 'Washing Machine Spinner Fix', rating: 0, feedback: '' },
    { _id: 'SRV-881239', customerName: 'Divya K.', createdAt: '2026-07-02T11:15:00.000Z', status: 'COMPLETED', earnings: 850, serviceType: 'Washing Machine Descaling & Service', rating: 4, feedback: 'Good service, cleaned out all scaling residue.' },
    { _id: 'SRV-880922', customerName: 'Rajesh Sen', createdAt: '2026-06-28T15:00:00.000Z', status: 'COMPLETED', earnings: 650, serviceType: 'Drain Pump Replacement', rating: 5, feedback: 'Fast work, replaced pump quickly.' }
  ];

  const displayHistory = history.length > 0 ? history : mockCompletedHistory;

  // --- FILTER & SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  // Filtered History Calculator
  const filteredHistory = displayHistory.filter((item) => {
    const matchesSearch = 
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.serviceType && item.serviceType.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesRating = ratingFilter === 'ALL' || (item.rating && Math.floor(item.rating) === Number(ratingFilter));

    return matchesSearch && matchesStatus && matchesRating;
  });

  // Calculate summary metrics based on displayed history
  const totalCompleted = displayHistory.filter(x => x.status === 'COMPLETED').length;
  const totalEarnings = displayHistory.reduce((sum, x) => sum + (x.earnings || 0), 0);
  const averageRating = (displayHistory.filter(x => x.rating > 0).reduce((sum, x) => sum + x.rating, 0) / displayHistory.filter(x => x.rating > 0).length || 0).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in text-slate-800 text-sm">
      
      {/* 2-Column Responsive Layout covering Left and Right sides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: HISTORY LIST & SEARCH FILTERS (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SEARCH & FILTERS BAR CONTROLS */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, ID, service type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>
              
              {/* Filters dropdown triggers */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Ratings</option>
                  <option value="5">★ 5 Stars</option>
                  <option value="4">★ 4 Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* COMPLETED SERVICES TICKET LIST */}
          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((booking) => (
                <div key={booking._id} className="bg-white p-5 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold border ${
                      booking.status === 'COMPLETED' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-500 border-red-100'
                    }`}>
                      {booking.status === 'COMPLETED' ? '✓' : '✗'}
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-slate-800 text-sm">
                        {booking.serviceType || 'Washing Machine Service'}
                      </h5>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-400 items-center font-bold">
                        <span className="text-slate-700">#{booking._id}</span>
                        <span>•</span>
                        <span className="text-slate-600">{booking.customerName || 'Customer'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(booking.createdAt).toLocaleDateString()}</span>
                        {booking.rating > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-600 font-extrabold flex items-center gap-0.5">★ {booking.rating}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Customer written review text */}
                      {booking.feedback && (
                        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl italic mt-2">
                          "{booking.feedback}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 text-xs">
                    <span className={`font-black text-base ${booking.status === 'COMPLETED' ? 'text-slate-800' : 'text-red-500'}`}>
                      {booking.status === 'COMPLETED' ? `₹${(booking.earnings || 0).toLocaleString()}` : 'Cancelled'}
                    </span>
                    <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                      booking.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-755'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-150">
                  <Wrench className="h-8 w-8" />
                </div>
                <h4 className="font-extrabold text-slate-700">No Match Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search criteria or filters to view matching service history tickets.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ADDITIONAL STATS & PIECES (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* HISTORY STATISTICS OVERVIEW WIDGET */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
              History Overview
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1">
                <span className="text-[10px] text-slate-455 font-bold block uppercase">Total Jobs</span>
                <span className="font-black text-slate-800 text-lg">{displayHistory.length}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-155 space-y-1">
                <span className="text-[10px] text-slate-455 font-bold block uppercase">Completed</span>
                <span className="font-black text-green-600 text-lg">{totalCompleted}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-155 space-y-1">
                <span className="text-[10px] text-slate-455 font-bold block uppercase">Avg Rating</span>
                <span className="font-black text-yellow-600 text-lg flex items-center gap-0.5">★ {averageRating}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-155 space-y-1">
                <span className="text-[10px] text-slate-455 font-bold block uppercase">Cancel Rate</span>
                <span className="font-black text-red-500 text-lg">
                  {((displayHistory.filter(x => x.status === 'CANCELLED').length / displayHistory.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="col-span-2 bg-slate-800 text-white p-4.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] text-blue-300 font-bold block uppercase">All-Time Earnings</span>
                <p className="text-xl font-black text-yellow-400">₹{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* MOST USED PARTS ANALYTICS WIDGET */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Package className="w-4.5 h-4.5 text-blue-600" />
              Frequently Used Parts
            </h3>
            <p className="text-xs text-slate-455 font-bold uppercase tracking-wider leading-none">Spare parts replacement distribution</p>
            
            <div className="space-y-3 pt-1 text-xs">
              {[
                { name: 'PCB Board', count: 4, pct: '80%' },
                { name: 'Motor Replaced', count: 3, pct: '60%' },
                { name: 'Water Inlet Valve', count: 2, pct: '40%' },
                { name: 'Drain Pump Replaced', count: 1, pct: '20%' }
              ].map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{p.name}</span>
                    <span className="text-slate-500">{p.count} units</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: p.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT FEEDBACK LOG WIDGET */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600" />
              Recent Feedbacks
            </h3>
            
            <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
              {displayHistory
                .filter(x => x.feedback)
                .slice(0, 3)
                .map((x, i) => (
                  <div key={i} className={`space-y-1.5 ${i > 0 ? 'pt-3.5' : ''}`}>
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800 font-bold">{x.customerName}</span>
                      <span className="text-yellow-600">★ {x.rating}</span>
                    </div>
                    <p className="text-xs text-slate-505 italic">"{x.feedback}"</p>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CompletedServices;
