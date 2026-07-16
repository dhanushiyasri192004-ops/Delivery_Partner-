import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash, X } from 'lucide-react';

const Schedules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Add/Edit Schedule Form States
  const [route, setRoute] = useState('Chennai ⇄ Coimbatore');
  const [bus, setBus] = useState('TN01 AB 1234');
  const [departure, setDeparture] = useState('08:30 AM');
  const [arrival, setArrival] = useState('06:00 PM');
  const [days, setDays] = useState('Daily');
  const [status, setStatus] = useState('Active');
  const [showSeatsMap, setShowSeatsMap] = useState(false);
  const [activeDeck, setActiveDeck] = useState('Lower');

  const renderSeatMapForBus = (busNumber) => {
    const busType = busTypeMap[busNumber] || 'AC Seater';
    const isSleeper     = busType.includes('Sleeper') && !busType.includes('Seater');
    const isSeater      = busType.includes('Seater') && !busType.includes('Sleeper');
    const isCombo       = busType.includes('Seater') && busType.includes('Sleeper');
    const bookedSeats   = ['A2', 'A5', 'B3', 'B6', 'S3', 'S4', 'L2', 'U1', 'U3'];

    // Reusable small seat box
    const SeatBox = ({ id, wide = false }) => {
      const booked = bookedSeats.includes(id);
      return (
        <div className={`${ wide ? 'w-12 h-11' : 'w-9 h-9'} rounded-lg border flex items-center justify-center text-[9px] font-bold transition-all ${
          booked ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'
        }`}>{id}</div>
      );
    };

    // ── SEATER LAYOUT (Left 2 + aisle + Right 2) ──
    const renderSeaterRows = (count, prefix1, prefix2) => (
      <div className="space-y-2 w-full flex flex-col items-center">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex justify-between items-center w-full max-w-[280px]">
            <div className="flex gap-1.5">
              <SeatBox id={`${prefix1}${i * 2 + 1}`} />
              <SeatBox id={`${prefix1}${i * 2 + 2}`} />
            </div>
            <div className="w-5" />
            <div className="flex gap-1.5">
              <SeatBox id={`${prefix2}${i * 2 + 1}`} />
              <SeatBox id={`${prefix2}${i * 2 + 2}`} />
            </div>
          </div>
        ))}
      </div>
    );

    // ── SLEEPER LAYOUT (1 wide berth left + aisle + 2 berths right) ──
    const renderSleeperRows = (count, leftPfx, rightPfx) => (
      <div className="space-y-2.5 w-full flex flex-col items-center">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex justify-between items-center w-full max-w-[280px]">
            <SeatBox id={`${leftPfx}${i + 1}`} wide />
            <div className="w-6" />
            <div className="flex gap-1.5">
              <SeatBox id={`${rightPfx}${i * 2 + 1}`} />
              <SeatBox id={`${rightPfx}${i * 2 + 2}`} />
            </div>
          </div>
        ))}
      </div>
    );

    // ── PURE SLEEPER BUS ──
    if (isSleeper) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-2 animate-fade-in">
          {/* Pinned Deck switcher */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl w-full max-w-[280px] mx-auto">
            {['Lower', 'Upper'].map(d => (
              <button key={d} type="button" onClick={() => setActiveDeck(d)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all tracking-wider ${
                  activeDeck === d ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}>{d.toUpperCase()} DECK</button>
            ))}
          </div>
          
          {/* Scrollable seat map */}
          <div className="max-h-[260px] overflow-y-auto py-2 space-y-3">
            <div className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Front / Driver</div>
            {activeDeck === 'Lower'
              ? renderSleeperRows(5, 'L', 'S')
              : renderSleeperRows(5, 'U', 'T')}
          </div>

          <div className="flex justify-center gap-6 pt-2 border-t border-slate-200 text-[9px] font-extrabold text-slate-500">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-200 block" />Available</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 block" />Booked</div>
          </div>
        </div>
      );
    }

    // ── SEATER/SLEEPER COMBO BUS ──
    if (isCombo) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-2 animate-fade-in">
          {/* Seater front section */}
          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            <div className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Front / Driver</div>
            <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest text-center">✦ Seater Section</p>
              {renderSeaterRows(3, 'A', 'B')}
            </div>
            {/* Sleeper rear section */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg w-full max-w-[200px] mx-auto mb-2">
                {['Lower', 'Upper'].map(d => (
                  <button key={d} type="button" onClick={() => setActiveDeck(d)}
                    className={`flex-1 py-1 rounded-md text-[9px] font-extrabold transition-all ${
                      activeDeck === d ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                    }`}>{d} Sleeper</button>
                ))}
              </div>
              {activeDeck === 'Lower'
                ? renderSleeperRows(4, 'L', 'S')
                : renderSleeperRows(4, 'U', 'T')}
            </div>
          </div>
          <div className="flex justify-center gap-6 pt-2 border-t border-slate-200 text-[9px] font-extrabold text-slate-500">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-200 block" />Available</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 block" />Booked</div>
          </div>
        </div>
      );
    }

    // ── PURE SEATER / LUXURY ──
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-2 animate-fade-in">
        <div className="max-h-[280px] overflow-y-auto py-2 space-y-3">
          <div className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Front / Driver</div>
          {renderSeaterRows(6, 'L', 'R')}
        </div>
        <div className="flex justify-center gap-6 pt-2 border-t border-slate-200 text-[9px] font-extrabold text-slate-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-200 block" />Available</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 block" />Booked</div>
        </div>
      </div>
    );
  };

  const busTypeMap = {
    'TN01 AB 1234': 'AC Sleeper',
    'TN45 CD 5678': 'AC Sleeper',
    'TN09 EF 9012': 'AC Seater',
    'TN37 GH 3456': 'Non-AC Seater',
    'TN35 IJ 7890': 'AC Seater/Sleeper',
    'TN38 KL 2345': 'Non-AC Sleeper',
    'TN02 MN 3456': 'Luxury',
    'TN10 OP 4567': 'AC Sleeper',
  };

  const busTypeColors = {
    'AC Sleeper':        'bg-blue-50 text-blue-700 border border-blue-100',
    'Non-AC Sleeper':    'bg-slate-100 text-slate-600 border border-slate-200',
    'AC Seater':         'bg-emerald-50 text-emerald-700 border border-emerald-100',
    'Non-AC Seater':     'bg-orange-50 text-orange-700 border border-orange-100',
    'AC Seater/Sleeper': 'bg-purple-50 text-purple-700 border border-purple-100',
    'Non-AC Seater/Sleeper': 'bg-pink-50 text-pink-700 border border-pink-100',
    'Luxury':            'bg-yellow-50 text-yellow-700 border border-yellow-100',
  };

  const initialSchedules = [
    { id: 'SCH001', route: 'Chennai ⇄ Coimbatore',  bus: 'TN01 AB 1234', departure: '08:30 AM', arrival: '06:00 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH002', route: 'Bangalore ⇄ Mysore',    bus: 'TN45 CD 5678', departure: '09:00 AM', arrival: '12:00 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH003', route: 'Chennai ⇄ Madurai',     bus: 'TN09 EF 9012', departure: '10:30 AM', arrival: '06:45 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH004', route: 'Trichy ⇄ Salem',        bus: 'TN37 GH 3456', departure: '11:00 AM', arrival: '02:30 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH005', route: 'Coimbatore ⇄ Kochi',    bus: 'TN35 IJ 7890', departure: '01:00 PM', arrival: '05:30 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH006', route: 'Madurai ⇄ Trichy',      bus: 'TN38 KL 2345', departure: '02:30 PM', arrival: '05:30 PM', days: 'Daily', status: 'Active' },
    { id: 'SCH007', route: 'Salem ⇄ Chennai',       bus: 'TN02 MN 3456', departure: '09:00 PM', arrival: '03:30 AM', days: 'Daily', status: 'Active' },
    { id: 'SCH008', route: 'Bangalore ⇄ Chennai',   bus: 'TN10 OP 4567', departure: '09:00 PM', arrival: '03:30 AM', days: 'Daily', status: 'Inactive' }
  ];

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('travel_schedules');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('travel_schedules', JSON.stringify(initialSchedules));
    return initialSchedules;
  });

  const saveSchedules = (newSchedules) => {
    setSchedules(newSchedules);
    localStorage.setItem('travel_schedules', JSON.stringify(newSchedules));
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    const newSch = {
      id: `SCH${String(schedules.length + 1).padStart(3, '0')}`,
      route,
      bus,
      departure,
      arrival,
      days,
      status
    };
    saveSchedules([newSch, ...schedules]);
    setShowAddScheduleModal(false);
  };

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setRoute(schedule.route);
    setBus(schedule.bus);
    setDeparture(schedule.departure);
    setArrival(schedule.arrival);
    setDays(schedule.days);
    setStatus(schedule.status);
    setShowEditScheduleModal(true);
  };

  const handleEditScheduleSubmit = (e) => {
    e.preventDefault();
    const updated = schedules.map(s => 
      s.id === selectedSchedule.id 
        ? { ...s, route, bus, departure, arrival, days, status } 
        : s
    );
    saveSchedules(updated);
    setShowEditScheduleModal(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id) => {
    const updated = schedules.filter(s => s.id !== id);
    saveSchedules(updated);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search schedule..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="h-4 w-4 text-slate-450" /> Filter
          </button>
          <button 
            onClick={() => {
              setRoute('Chennai ⇄ Coimbatore');
              setBus('TN01 AB 1234');
              setDeparture('08:30 AM');
              setArrival('06:00 PM');
              setDays('Daily');
              setStatus('Active');
              setShowAddScheduleModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Schedule
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 pl-3">Bus Type</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Bus</th>
                <th className="pb-3">Departure</th>
                <th className="pb-3">Arrival</th>
                <th className="pb-3">Days</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schedules.filter(s => s.route.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pl-3">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide whitespace-nowrap ${
                      busTypeColors[busTypeMap[s.bus]] || 'bg-slate-100 text-slate-600'
                    }`}>
                      {busTypeMap[s.bus] || '—'}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-850 font-bold">{s.route}</td>
                  <td className="py-3.5 text-slate-500 font-bold">{s.bus}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{s.departure}</td>
                  <td className="py-3.5 font-bold text-slate-800">{s.arrival}</td>
                  <td className="py-3.5 text-slate-450">{s.days}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700'
                    }`}>{s.status}</span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-bold">
                    {['TN01 AB 1234', 'TN10 OP 4567'].includes(s.bus) ? '40 Seats' : '30 Seats'}
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(s)}
                        className="text-slate-400 hover:text-blue-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="Edit Schedule"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSchedule(s.id)} 
                        className="text-slate-400 hover:text-red-600 transition-all p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
                        title="Delete Schedule"
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
            <span>Showing 1 to {schedules.length} of {schedules.length} entries</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer text-slate-800">1</span>
            <span className="cursor-pointer hover:text-slate-600">2</span>
            <span>...</span>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal Overlay */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Add New Schedule</h3>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Route</label>
                <select 
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>Chennai ⇄ Coimbatore</option>
                  <option>Bangalore ⇄ Mysore</option>
                  <option>Chennai ⇄ Madurai</option>
                  <option>Trichy ⇄ Salem</option>
                  <option>Coimbatore ⇄ Kochi</option>
                  <option>Madurai ⇄ Trichy</option>
                  <option>Salem ⇄ Chennai</option>
                  <option>Bangalore ⇄ Chennai</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">Bus</label>
                  <button
                    type="button"
                    onClick={() => setShowSeatsMap(!showSeatsMap)}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    {showSeatsMap ? 'Hide Seat Layout' : 'Show Seat Layout'}
                  </button>
                </div>
                <select 
                  value={bus}
                  onChange={(e) => setBus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>TN01 AB 1234</option>
                  <option>TN45 CD 5678</option>
                  <option>TN09 EF 9012</option>
                  <option>TN37 GH 3456</option>
                  <option>TN35 IJ 7890</option>
                  <option>TN38 KL 2345</option>
                  <option>TN02 MN 3456</option>
                  <option>TN10 OP 4567</option>
                </select>

                {/* Bus Seats Visual Map */}
                {showSeatsMap && renderSeatMapForBus(bus)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Departure Time</label>
                  <input 
                    type="text" 
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="08:30 AM" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Arrival Time</label>
                  <input 
                    type="text" 
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    placeholder="06:00 PM" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Frequency Days</label>
                  <input 
                    type="text" 
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Daily" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
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
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider mt-2"
              >
                Create Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal Overlay */}
      {showEditScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-805">Edit Schedule</h3>
              <button onClick={() => {
                setShowEditScheduleModal(false);
                setShowSeatsMap(false);
              }} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditScheduleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Route</label>
                <select 
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>Chennai ⇄ Coimbatore</option>
                  <option>Bangalore ⇄ Mysore</option>
                  <option>Chennai ⇄ Madurai</option>
                  <option>Trichy ⇄ Salem</option>
                  <option>Coimbatore ⇄ Kochi</option>
                  <option>Madurai ⇄ Trichy</option>
                  <option>Salem ⇄ Chennai</option>
                  <option>Bangalore ⇄ Chennai</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">Bus</label>
                  <button
                    type="button"
                    onClick={() => setShowSeatsMap(!showSeatsMap)}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    {showSeatsMap ? 'Hide Seat Layout' : 'Show Seat Layout'}
                  </button>
                </div>
                <select 
                  value={bus}
                  onChange={(e) => setBus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>TN01 AB 1234</option>
                  <option>TN45 CD 5678</option>
                  <option>TN09 EF 9012</option>
                  <option>TN37 GH 3456</option>
                  <option>TN35 IJ 7890</option>
                  <option>TN38 KL 2345</option>
                  <option>TN02 MN 3456</option>
                  <option>TN10 OP 4567</option>
                </select>

                {/* Bus Seats Visual Map */}
                {showSeatsMap && renderSeatMapForBus(bus)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Departure Time</label>
                  <input 
                    type="text" 
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="08:30 AM" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Arrival Time</label>
                  <input 
                    type="text" 
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    placeholder="06:00 PM" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Frequency Days</label>
                  <input 
                    type="text" 
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Daily" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
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
              </div>
              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditScheduleModal(false);
                    setShowSeatsMap(false);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
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

export default Schedules;
