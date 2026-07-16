import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash, X } from 'lucide-react';

const Routes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  const availableCities = [
    'Chennai',
    'Coimbatore',
    'Bangalore',
    'Mysore',
    'Madurai',
    'Trichy',
    'Salem',
    'Kochi',
    'Hosur',
    'Krishnagiri',
    'Vellore',
    'Erode',
    'Tirupur'
  ];

  // Add Route form state
  const [fromCity, setFromCity] = useState('Chennai');
  const [boardingPlace, setBoardingPlace] = useState('');
  const [toCity, setToCity] = useState('Coimbatore');
  const [droppingPlace, setDroppingPlace] = useState('');
  const [distance, setDistance] = useState('502');
  const [duration, setDuration] = useState('9h 30m');
  const [status, setStatus] = useState('Active');
  const [stops, setStops] = useState(['Hosur', 'Krishnagiri', 'Vellore']);
  const [newStop, setNewStop] = useState('');
  const [showAddStopInput, setShowAddStopInput] = useState(false);

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
  const [editStops, setEditStops] = useState([]);
  const [newEditStop, setNewEditStop] = useState('');
  const [showEditAddStopInput, setShowEditAddStopInput] = useState(false);

  const initialRoutes = [
    { name: 'Chennai ⇄ Coimbatore', from: 'Chennai', boardingPlace: 'Koyambedu', to: 'Coimbatore', droppingPlace: 'Gandhipuram', distance: '502 km', duration: '9h 30m', status: 'Active', stops: ['Hosur', 'Krishnagiri', 'Vellore'] },
    { name: 'Bangalore ⇄ Mysore', from: 'Bangalore', boardingPlace: 'Majestic', to: 'Mysore', droppingPlace: 'Subhash Nagar', distance: '140 km', duration: '3h 00m', status: 'Active', stops: ['Bidadi', 'Ramanagara', 'Channapatna'] },
    { name: 'Chennai ⇄ Madurai', from: 'Chennai', boardingPlace: 'Koyambedu', to: 'Madurai', droppingPlace: 'Mattuthavani', distance: '462 km', duration: '8h 15m', status: 'Active', stops: ['Villupuram', 'Trichy', 'Melur'] },
    { name: 'Trichy ⇄ Salem', from: 'Trichy', boardingPlace: 'Central Bus Stand', to: 'Salem', droppingPlace: 'New Bus Stand', distance: '138 km', duration: '3h 30m', status: 'Active', stops: ['Namakkal', 'Rasipuram'] },
    { name: 'Coimbatore ⇄ Kochi', from: 'Coimbatore', boardingPlace: 'Gandhipuram', to: 'Kochi', droppingPlace: 'Vytilla', distance: '190 km', duration: '4h 30m', status: 'Active', stops: ['Palakkad', 'Thrissur'] },
    { name: 'Madurai ⇄ Trichy', from: 'Madurai', boardingPlace: 'Mattuthavani', to: 'Trichy', droppingPlace: 'Central Bus Stand', distance: '135 km', duration: '3h 00m', status: 'Active', stops: ['Melur', 'Kottampatti'] },
    { name: 'Salem ⇄ Chennai', from: 'Salem', boardingPlace: 'New Bus Stand', to: 'Chennai', droppingPlace: 'Koyambedu', distance: '345 km', duration: '6h 30m', status: 'Active', stops: ['Attur', 'Kallakurichi', 'Ulundurpet'] },
    { name: 'Bangalore ⇄ Chennai', from: 'Bangalore', boardingPlace: 'Majestic', to: 'Chennai', droppingPlace: 'Koyambedu', distance: '350 km', duration: '6h 15m', status: 'Inactive', stops: ['Hosur', 'Krishnagiri', 'Vellore', 'Kanchipuram'] }
  ];

  const [routes, setRoutes] = useState(initialRoutes);

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!fromCity || !toCity) return;
    const name = `${fromCity} ⇄ ${toCity}`;
    const formattedDistance = distance.toLowerCase().includes('km') ? distance : `${distance} km`;
    const newRoute = { name, from: fromCity, boardingPlace, to: toCity, droppingPlace, distance: formattedDistance, duration, status, stops };
    setRoutes([newRoute, ...routes]);
    setFromCity('Chennai');
    setToCity('Coimbatore');
    setBoardingPlace('');
    setDroppingPlace('');
    setDistance('502');
    setDuration('9h 30m');
    setStatus('Active');
    setStops(['Hosur', 'Krishnagiri', 'Vellore']);
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
    setEditDistance(route.distance ? route.distance.replace(' km', '') : '');
    setEditDuration(route.duration);
    setEditStatus(route.status);
    setEditStops(route.stops || []);
    setShowEditRouteModal(true);
  };

  const handleSaveEditRoute = (e) => {
    e.preventDefault();
    const formattedDistance = editDistance.toLowerCase().includes('km') ? editDistance : `${editDistance} km`;
    setRoutes(prev => prev.map(r => r.name === selectedEditRoute.name ? {
      name: `${editFromCity} ⇄ ${editToCity}`,
      from: editFromCity,
      boardingPlace: editBoardingPlace,
      to: editToCity,
      droppingPlace: editDroppingPlace,
      distance: formattedDistance,
      duration: editDuration,
      status: editStatus,
      stops: editStops
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
                <th className="pb-3">Routes</th>
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
                  <td className="py-3.5 pl-3 text-slate-800 font-bold">
                    <div>{r.from}</div>
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{r.boardingPlace || <span className="text-slate-300">—</span>}</td>
                  <td className="py-3.5 text-slate-500 font-medium">
                    {r.stops && r.stops.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {r.stops.map((stop, sIdx) => (
                          <span key={sIdx} className="bg-slate-105/80 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold border border-slate-200">
                            {stop}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-850 font-bold">{r.to}</td>
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
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-slate-105 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-805">Add Route</h3>
              <button onClick={() => setShowAddRouteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddRoute} className="space-y-4 text-xs font-semibold">
              {/* From / To Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">From</label>
                  <select 
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">To</label>
                  <select 
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Between (via stops) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Between (via stops)</label>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
                  {stops.map((stop, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 bg-blue-50/80 text-blue-700 px-3 py-1 rounded-full font-bold text-[10px] border border-blue-100">
                      {stop}
                      <button 
                        type="button" 
                        onClick={() => setStops(stops.filter((_, i) => i !== idx))} 
                        className="hover:text-blue-900 ml-1 text-slate-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {showAddStopInput ? (
                    <input
                      type="text"
                      placeholder="Type & press Enter"
                      value={newStop}
                      onChange={(e) => setNewStop(e.target.value)}
                      className="bg-transparent border-none outline-none text-[10px] font-bold w-28 px-1 py-0.5 text-slate-800 placeholder-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newStop.trim();
                          if (val) {
                            setStops([...stops, val]);
                          }
                          setNewStop('');
                          setShowAddStopInput(false);
                        }
                      }}
                      onBlur={() => {
                        const val = newStop.trim();
                        if (val) {
                          setStops([...stops, val]);
                        }
                        setNewStop('');
                        setShowAddStopInput(false);
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddStopInput(true)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Boarding place / Dropping place */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Boarding place</label>
                <input 
                  type="text" 
                  value={boardingPlace}
                  onChange={(e) => setBoardingPlace(e.target.value)}
                  placeholder="Enter boarding point" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Dropping place</label>
                <input 
                  type="text" 
                  value={droppingPlace}
                  onChange={(e) => setDroppingPlace(e.target.value)}
                  placeholder="Enter dropping point" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Distance / Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Distance (km)</label>
                  <input 
                    type="text" 
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. 502" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 9h 30m" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Status pills */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('Active')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-bold ${
                      status === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Inactive')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-bold ${
                      status === 'Inactive'
                        ? 'bg-slate-100 border-slate-305 text-slate-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${status === 'Inactive' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                    Inactive
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3">
                <button 
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="flex-1 bg-white border border-slate-250 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                >
                  + Add Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Route Modal Overlay */}
      {showEditRouteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-805">Edit Route</h3>
              <button onClick={() => setShowEditRouteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditRoute} className="space-y-4 text-xs font-semibold">
              {/* From / To Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">From</label>
                  <select 
                    value={editFromCity}
                    onChange={(e) => setEditFromCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">To</label>
                  <select 
                    value={editToCity}
                    onChange={(e) => setEditToCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Between (via stops) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Between (via stops)</label>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
                  {editStops.map((stop, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 bg-blue-50/80 text-blue-700 px-3 py-1 rounded-full font-bold text-[10px] border border-blue-100">
                      {stop}
                      <button 
                        type="button" 
                        onClick={() => setEditStops(editStops.filter((_, i) => i !== idx))} 
                        className="hover:text-blue-900 ml-1 text-slate-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {showEditAddStopInput ? (
                    <input
                      type="text"
                      placeholder="Type & press Enter"
                      value={newEditStop}
                      onChange={(e) => setNewEditStop(e.target.value)}
                      className="bg-transparent border-none outline-none text-[10px] font-bold w-28 px-1 py-0.5 text-slate-800 placeholder-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newEditStop.trim();
                          if (val) {
                            setEditStops([...editStops, val]);
                          }
                          setNewEditStop('');
                          setShowEditAddStopInput(false);
                        }
                      }}
                      onBlur={() => {
                        const val = newEditStop.trim();
                        if (val) {
                          setEditStops([...editStops, val]);
                        }
                        setNewEditStop('');
                        setShowEditAddStopInput(false);
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowEditAddStopInput(true)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Boarding place / Dropping place */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Boarding place</label>
                <input 
                  type="text" 
                  value={editBoardingPlace}
                  onChange={(e) => setEditBoardingPlace(e.target.value)}
                  placeholder="Enter boarding point" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Dropping place</label>
                <input 
                  type="text" 
                  value={editDroppingPlace}
                  onChange={(e) => setEditDroppingPlace(e.target.value)}
                  placeholder="Enter dropping point" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Distance / Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Distance (km)</label>
                  <input 
                    type="text" 
                    value={editDistance}
                    onChange={(e) => setEditDistance(e.target.value)}
                    placeholder="e.g. 502" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Duration</label>
                  <input 
                    type="text" 
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="e.g. 9h 30m" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Status pills */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditStatus('Active')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-bold ${
                      editStatus === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${editStatus === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('Inactive')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-bold ${
                      editStatus === 'Inactive'
                        ? 'bg-slate-100 border-slate-300 text-slate-650 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${editStatus === 'Inactive' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                    Inactive
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3">
                <button 
                  type="button"
                  onClick={() => setShowEditRouteModal(false)}
                  className="flex-1 bg-white border border-slate-250 text-slate-605 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
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

export default Routes;
