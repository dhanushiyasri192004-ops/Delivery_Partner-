import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash, X } from 'lucide-react';

const Routes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  // Add Route form state
  const [fromCity, setFromCity] = useState('');
  const [boardingPlace, setBoardingPlace] = useState('');
  const [toCity, setToCity] = useState('');
  const [droppingPlace, setDroppingPlace] = useState('');
  const [distance, setDistance] = useState('350 km');
  const [duration, setDuration] = useState('6h 30m');
  const [status, setStatus] = useState('Active');

  // Edit Route states
  const [selectedEditRoute, setSelectedEditRoute] = useState(null);
  const [showEditRouteModal, setShowEditRouteModal] = useState(false);
  const [editFromCity, setEditFromCity] = useState('');
  const [editBoardingPlace, setEditBoardingPlace] = useState('');
  const [editToCity, setEditToCity] = useState('');
  const [editDroppingPlace, setEditDroppingPlace] = useState('');
  const [editDistance, setEditDistance] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  const initialRoutes = [
    { name: 'Chennai ⇄ Coimbatore', from: 'Chennai', to: 'Coimbatore', distance: '502 km', duration: '9h 30m', status: 'Active' },
    { name: 'Bangalore ⇄ Mysore', from: 'Bangalore', to: 'Mysore', distance: '140 km', duration: '3h 00m', status: 'Active' },
    { name: 'Chennai ⇄ Madurai', from: 'Chennai', to: 'Madurai', distance: '462 km', duration: '8h 15m', status: 'Active' },
    { name: 'Trichy ⇄ Salem', from: 'Trichy', to: 'Salem', distance: '138 km', duration: '3h 30m', status: 'Active' },
    { name: 'Coimbatore ⇄ Kochi', from: 'Coimbatore', to: 'Kochi', distance: '190 km', duration: '4h 30m', status: 'Active' },
    { name: 'Madurai ⇄ Trichy', from: 'Madurai', to: 'Trichy', distance: '135 km', duration: '3h 00m', status: 'Active' },
    { name: 'Salem ⇄ Chennai', from: 'Salem', to: 'Chennai', distance: '345 km', duration: '6h 30m', status: 'Active' },
    { name: 'Bangalore ⇄ Chennai', from: 'Bangalore', to: 'Chennai', distance: '350 km', duration: '6h 15m', status: 'Inactive' }
  ];

  const [routes, setRoutes] = useState(initialRoutes);

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!fromCity || !toCity) return;
    const name = `${fromCity} ⇄ ${toCity}`;
    const newRoute = { name, from: fromCity, boardingPlace, to: toCity, droppingPlace, distance, duration, status };
    setRoutes([newRoute, ...routes]);
    setFromCity('');
    setBoardingPlace('');
    setToCity('');
    setDroppingPlace('');
    setShowAddRouteModal(false);
  };

  const handleDeleteRoute = (name) => {
    setRoutes(prev => prev.filter(r => r.name !== name));
  };

  const handleOpenEditModal = (route) => {
    setSelectedEditRoute(route);
    setEditFromCity(route.from);
    setEditBoardingPlace(route.boardingPlace || '');
    setEditToCity(route.to);
    setEditDroppingPlace(route.droppingPlace || '');
    setEditDistance(route.distance);
    setEditDuration(route.duration);
    setEditStatus(route.status);
    setShowEditRouteModal(true);
  };

  const handleSaveEditRoute = (e) => {
    e.preventDefault();
    setRoutes(prev => prev.map(r => r.name === selectedEditRoute.name ? {
      name: `${editFromCity} ⇄ ${editToCity}`,
      from: editFromCity,
      boardingPlace: editBoardingPlace,
      to: editToCity,
      droppingPlace: editDroppingPlace,
      distance: editDistance,
      duration: editDuration,
      status: editStatus
    } : r));
    setShowEditRouteModal(false);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-8 py-6 animate-fade-in text-slate-805">
      
      {/* Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search route..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="h-4 w-4 text-slate-455" /> Filter
          </button>
          <button 
            onClick={() => setShowAddRouteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Route
          </button>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-705">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">From</th>
                <th className="pb-3">Boarding Place</th>
                <th className="pb-3">To</th>
                <th className="pb-3">Dropping Place</th>
                <th className="pb-3">Distance</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {routes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => (
                <tr key={r.name} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3 text-slate-800 font-bold">{r.from}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{r.boardingPlace || <span className="text-slate-300">—</span>}</td>
                  <td className="py-3.5 text-slate-805 font-bold">{r.to}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{r.droppingPlace || <span className="text-slate-300">—</span>}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{r.distance}</td>
                  <td className="py-3.5 font-bold text-slate-800">{r.duration}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700'
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(r)} 
                        className="text-slate-400 hover:text-blue-650 transition-all cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRoute(r.name)} 
                        className="text-slate-400 hover:text-red-600 transition-all cursor-pointer"
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
            <span>Showing 1 to {routes.length} of {routes.length} entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span>...</span>
          </div>
        </div>

      </div>

      {/* Add Route Modal Overlay */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Add New Route</h3>
              <button onClick={() => setShowAddRouteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">From City</label>
                  <input 
                    type="text" 
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Chennai" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">To City</label>
                  <input 
                    type="text" 
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Coimbatore" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Boarding Place</label>
                  <input 
                    type="text" 
                    value={boardingPlace}
                    onChange={(e) => setBoardingPlace(e.target.value)}
                    placeholder="e.g. Chennai Bus Stand" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Dropping Place</label>
                  <input 
                    type="text" 
                    value={droppingPlace}
                    onChange={(e) => setDroppingPlace(e.target.value)}
                    placeholder="e.g. Coimbatore Gandhipuram" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Distance</label>
                  <input 
                    type="text" 
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="350 km" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Estimated Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="6h 30m" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2"
              >
                Create Route
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Route Modal Overlay */}
      {showEditRouteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Edit Route</h3>
              <button onClick={() => setShowEditRouteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditRoute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">From City</label>
                  <input 
                    type="text" 
                    value={editFromCity}
                    onChange={(e) => setEditFromCity(e.target.value)}
                    placeholder="e.g. Chennai" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">To City</label>
                  <input 
                    type="text" 
                    value={editToCity}
                    onChange={(e) => setEditToCity(e.target.value)}
                    placeholder="e.g. Coimbatore" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Boarding Place</label>
                  <input 
                    type="text" 
                    value={editBoardingPlace}
                    onChange={(e) => setEditBoardingPlace(e.target.value)}
                    placeholder="e.g. Chennai Bus Stand" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Dropping Place</label>
                  <input 
                    type="text" 
                    value={editDroppingPlace}
                    onChange={(e) => setEditDroppingPlace(e.target.value)}
                    placeholder="e.g. Coimbatore Gandhipuram" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Distance</label>
                  <input 
                    type="text" 
                    value={editDistance}
                    onChange={(e) => setEditDistance(e.target.value)}
                    placeholder="350 km" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Estimated Duration</label>
                  <input 
                    type="text" 
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="6h 30m" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Status</label>
                <select 
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Routes;
