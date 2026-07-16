import React, { useState } from 'react';
import { Search, Plus, Filter, Trash, X, Wrench, Shield, FileText, MapPin, Clock, Battery, Fuel, Edit } from 'lucide-react';

const Buses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBusModal, setShowAddBusModal] = useState(false);

  // Add Bus form state
  const [busNo, setBusNo] = useState('');
  const [busName, setBusName] = useState('');
  const [busType, setBusType] = useState('AC Sleeper');
  const [seats, setSeats] = useState('54');
  // Seater: left/right
  const [seaterLeft, setSeaterLeft] = useState(15);
  const [seaterRight, setSeaterRight] = useState(15);
  // Sleeper lower: left/right
  const [lowerLeft, setLowerLeft] = useState(6);
  const [lowerRight, setLowerRight] = useState(6);
  // Sleeper upper: left/right
  const [upperLeft, setUpperLeft] = useState(6);
  const [upperRight, setUpperRight] = useState(6);
  const [status, setStatus] = useState('Active');
  const [driver, setDriver] = useState('');
  const [addInsurance, setAddInsurance] = useState('2027-03-15');
  const [addFitness, setAddFitness] = useState('2026-09-22');
  const [addLastService, setAddLastService] = useState('2026-06-18');
  const [addNextService, setAddNextService] = useState('2026-07-18');

  // Edit Bus form states
  const [selectedEditBus, setSelectedEditBus] = useState(null);
  const [showEditBusModal, setShowEditBusModal] = useState(false);
  const [editBusNo, setEditBusNo] = useState('');
  const [editBusName, setEditBusName] = useState('');
  const [editBusType, setEditBusType] = useState('AC Sleeper');
  const [editSeats, setEditSeats] = useState('54');
  // Edit seater: left/right
  const [editSeaterLeft, setEditSeaterLeft] = useState(15);
  const [editSeaterRight, setEditSeaterRight] = useState(15);
  // Edit sleeper lower: left/right
  const [editLowerLeft, setEditLowerLeft] = useState(6);
  const [editLowerRight, setEditLowerRight] = useState(6);
  // Edit sleeper upper: left/right
  const [editUpperLeft, setEditUpperLeft] = useState(6);
  const [editUpperRight, setEditUpperRight] = useState(6);
  const [editStatus, setEditStatus] = useState('Active');
  const [editDriver, setEditDriver] = useState('');
  const [editInsurance, setEditInsurance] = useState('');
  const [editFitness, setEditFitness] = useState('');
  const [editLastService, setEditLastService] = useState('');
  const [editNextService, setEditNextService] = useState('');

  const initialBuses = [
    { 
      number: 'KA-01-AB-1234', 
      name: 'VRL Travels', 
      type: 'AC Sleeper', 
      seats: '30 Seats (15 Lower / 15 Upper)', 
      lowerSleeperCap: 15,
      upperSleeperCap: 15,
      status: 'Active',
      model: 'Volvo B9R (2022)',
      diesel: 82,
      battery: 95,
      driver: 'Ramesh Kumar',
      condition: 'Excellent',
      insurance: '2027-03-15',
      fitness: '2026-09-22',
      lastService: '2026-06-18',
      nextService: '2026-07-18',
      gps: 'lat: 12.97, lng: 77.59 (Active Corridor)'
    },
    { 
      number: 'TN-37-GH-3456', 
      name: 'Royal Travels', 
      type: 'AC Sleeper', 
      seats: '30 Seats (15 Lower / 15 Upper)', 
      lowerSleeperCap: 15,
      upperSleeperCap: 15,
      status: 'Active',
      model: 'Scania Metrolink (2023)',
      diesel: 75,
      battery: 88,
      driver: 'Suresh Babu',
      condition: 'Good',
      insurance: '2027-04-12',
      fitness: '2026-10-15',
      lastService: '2026-05-20',
      nextService: '2026-07-20',
      gps: 'lat: 13.08, lng: 80.27 (Route Corridor)'
    },
    { 
      number: 'TN-45-CD-5678', 
      name: 'SRS Travels', 
      type: 'AC Seater/Sleeper', 
      seats: '54 Seats (30 Seater / 24 Sleeper: 12L / 12U)', 
      seaterCap: 30,
      lowerSleeperCap: 12,
      upperSleeperCap: 12,
      status: 'Active',
      model: 'Volvo 9400 B11R',
      diesel: 60,
      battery: 90,
      driver: 'Anitha Devi',
      condition: 'Excellent',
      insurance: '2027-02-18',
      fitness: '2026-08-11',
      lastService: '2026-06-05',
      nextService: '2026-07-19',
      gps: 'lat: 12.29, lng: 76.63 (Active Corridor)'
    },
    { 
      number: 'TN-35-IJ-7890', 
      name: 'National Travels', 
      type: 'Non-AC Seater', 
      seats: '45 Seats', 
      seaterCap: 45,
      status: 'Inactive',
      model: 'Tata LPO 1618',
      diesel: 15,
      battery: 40,
      driver: 'Vijay Kumar',
      condition: 'Needs Service',
      insurance: '2026-12-05',
      fitness: '2026-07-30',
      lastService: '2026-04-10',
      nextService: '2026-07-15',
      gps: 'lat: 11.66, lng: 78.14 (Depot Parked)'
    }
  ];

  const [buses, setBuses] = useState(initialBuses);

  const handleAddBus = (e) => {
    e.preventDefault();
    if (!busNo) return;

    let seatStr = '';
    let total = 0;
    if (['AC Sleeper', 'Non-AC Sleeper'].includes(busType)) {
      const lowerTotal = Number(lowerLeft) + Number(lowerRight);
      const upperTotal = Number(upperLeft) + Number(upperRight);
      total = lowerTotal + upperTotal;
      seatStr = `${total} Seats (Lower: ${lowerLeft}L + ${lowerRight}R / Upper: ${upperLeft}L + ${upperRight}R)`;
    } else if (['AC Seater/Sleeper', 'Non-AC Seater/Sleeper'].includes(busType)) {
      const seaterTotal = Number(seaterLeft) + Number(seaterRight);
      const lowerTotal = Number(lowerLeft) + Number(lowerRight);
      const upperTotal = Number(upperLeft) + Number(upperRight);
      total = seaterTotal + lowerTotal + upperTotal;
      seatStr = `${total} Seats (Seater: ${seaterLeft}L+${seaterRight}R / Lower: ${lowerLeft}L+${lowerRight}R / Upper: ${upperLeft}L+${upperRight}R)`;
    } else if (['AC Seater', 'Non-AC Seater', 'Luxury / Semi-Luxury'].includes(busType)) {
      const seaterTotal = Number(seaterLeft) + Number(seaterRight);
      total = seaterTotal;
      seatStr = `${total} Seats (${seaterLeft} Left / ${seaterRight} Right)`;
    } else {
      total = Number(seats);
      seatStr = `${seats} Seats`;
    }

    const newBus = { 
      number: busNo, 
      name: busName || 'VRL Travels', 
      type: busType, 
      seats: seatStr,
      seaterLeft: Number(seaterLeft), seaterRight: Number(seaterRight),
      lowerLeft: Number(lowerLeft), lowerRight: Number(lowerRight),
      upperLeft: Number(upperLeft), upperRight: Number(upperRight),
      status,
      model: 'Volvo B9R (2022)',
      diesel: 100,
      battery: 100,
      driver: driver || 'Unassigned',
      condition: 'Excellent',
      insurance: addInsurance,
      fitness: addFitness,
      lastService: addLastService,
      nextService: addNextService,
      gps: 'lat: 12.97, lng: 77.59 (Stationary)'
    };
    setBuses([newBus, ...buses]);
    setBusNo('');
    setBusName('');
    setDriver('');
    setShowAddBusModal(false);
  };

  const handleDeleteBus = (number) => {
    setBuses(prev => prev.filter(b => b.number !== number));
  };

  const handleOpenEditModal = (bus) => {
    setSelectedEditBus(bus);
    setEditBusNo(bus.number);
    setEditBusName(bus.name);
    setEditBusType(bus.type);
    setEditSeats(bus.seats ? bus.seats.split(' ')[0] : '54');
    setEditSeaterLeft(bus.seaterLeft || 15);
    setEditSeaterRight(bus.seaterRight || 15);
    setEditLowerLeft(bus.lowerLeft || 6);
    setEditLowerRight(bus.lowerRight || 6);
    setEditUpperLeft(bus.upperLeft || 6);
    setEditUpperRight(bus.upperRight || 6);
    setEditStatus(bus.status);
    setEditDriver(bus.driver);
    setEditInsurance(bus.insurance || '2027-03-15');
    setEditFitness(bus.fitness || '2026-09-22');
    setEditLastService(bus.lastService || '2026-06-18');
    setEditNextService(bus.nextService || '2026-07-18');
    setShowEditBusModal(true);
  };

  const handleSaveEditBus = (e) => {
    e.preventDefault();
    let seatStr = '';
    let total = 0;
    if (['AC Sleeper', 'Non-AC Sleeper'].includes(editBusType)) {
      const lowerTotal = Number(editLowerLeft) + Number(editLowerRight);
      const upperTotal = Number(editUpperLeft) + Number(editUpperRight);
      total = lowerTotal + upperTotal;
      seatStr = `${total} Seats (Lower: ${editLowerLeft}L + ${editLowerRight}R / Upper: ${editUpperLeft}L + ${editUpperRight}R)`;
    } else if (['AC Seater/Sleeper', 'Non-AC Seater/Sleeper'].includes(editBusType)) {
      const seaterTotal = Number(editSeaterLeft) + Number(editSeaterRight);
      const lowerTotal = Number(editLowerLeft) + Number(editLowerRight);
      const upperTotal = Number(editUpperLeft) + Number(editUpperRight);
      total = seaterTotal + lowerTotal + upperTotal;
      seatStr = `${total} Seats (Seater: ${editSeaterLeft}L+${editSeaterRight}R / Lower: ${editLowerLeft}L+${editLowerRight}R / Upper: ${editUpperLeft}L+${editUpperRight}R)`;
    } else if (['AC Seater', 'Non-AC Seater', 'Luxury / Semi-Luxury'].includes(editBusType)) {
      const seaterTotal = Number(editSeaterLeft) + Number(editSeaterRight);
      total = seaterTotal;
      seatStr = `${total} Seats (${editSeaterLeft} Left / ${editSeaterRight} Right)`;
    } else {
      total = Number(editSeats);
      seatStr = `${editSeats} Seats`;
    }

    setBuses(prev => prev.map(b => b.number === selectedEditBus.number ? {
      ...b,
      number: editBusNo,
      name: editBusName,
      type: editBusType,
      seats: seatStr,
      seaterLeft: Number(editSeaterLeft), seaterRight: Number(editSeaterRight),
      lowerLeft: Number(editLowerLeft), lowerRight: Number(editLowerRight),
      upperLeft: Number(editUpperLeft), upperRight: Number(editUpperRight),
      status: editStatus,
      driver: editDriver,
      insurance: editInsurance,
      fitness: editFitness,
      lastService: editLastService,
      nextService: editNextService
    } : b));
    setShowEditBusModal(false);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-800">
      
      {/* Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bus by number / operator..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="h-4 w-4 text-slate-450" /> Filter
          </button>
          <button 
            onClick={() => setShowAddBusModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Bus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {buses.filter(b => b.number.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((b) => (
          <div key={b.number} className="bg-white rounded-3xl border border-slate-105 p-6 shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-md transition-all">

            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{b.type}</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{b.number}</h3>
                <span className="text-[11px] font-semibold text-slate-400">{b.model}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wide border ${
                  b.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>{b.status}</span>
                
                <button 
                  onClick={() => handleOpenEditModal(b)} 
                  className="text-slate-400 hover:text-blue-600 transition-all p-0.5"
                  title="Edit Bus Details"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => handleDeleteBus(b.number)} 
                  className="text-slate-300 hover:text-red-500 transition-all p-0.5"
                  title="Delete Bus Profile"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Diagnostics progress bars */}
            <div className="bg-slate-50 p-3 rounded-xl space-y-2.5 text-[10px] font-extrabold text-slate-800">
              {/* Diesel bar */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Fuel className="h-3.5 w-3.5 text-red-500" /> Diesel Level
                  </span>
                  <span className="font-extrabold">{b.diesel}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${b.diesel}%` }}></div>
                </div>
              </div>

              {/* Battery bar */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Battery className="h-3.5 w-3.5 text-green-500" /> Auxiliary Battery Charge
                  </span>
                  <span className="font-extrabold">{b.battery}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${b.battery}%` }}></div>
                </div>
              </div>
            </div>

            {/* Grid properties */}
            <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-700 border-b border-slate-50 pb-3">
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Driver</span>
                <span className="text-slate-800 font-extrabold">{b.driver}</span>
              </div>
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Capacity</span>
                <span className="text-slate-800 font-extrabold">{b.seats}</span>
              </div>
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Condition Index</span>
                <span className={`font-extrabold ${b.condition === 'Needs Service' ? 'text-red-500' : 'text-emerald-600'}`}>{b.condition}</span>
              </div>
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Operator</span>
                <span className="text-slate-800 font-extrabold">{b.name}</span>
              </div>
            </div>

            {/* GPS Desk Banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-yellow-500 animate-pulse shrink-0" />
              <span>Live GPS Desk: <span className="font-semibold text-slate-500">{b.gps}</span></span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button 
                onClick={() => {}}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750 font-extrabold py-2 px-1 rounded-xl transition-all text-[10px] flex items-center justify-center gap-1"
              >
                <Wrench className="h-3.5 w-3.5 text-slate-500" /> Queue Service
              </button>
              <button 
                onClick={() => {}}
                className="bg-yellow-450 hover:bg-yellow-500 text-slate-900 font-black py-2 px-1 rounded-xl transition-all text-[10px] shadow-sm flex items-center justify-center"
              >
                Compliance Verify
              </button>
            </div>

          </div>
        ))}
      </div>
      {showAddBusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-2xl animate-scale-in flex flex-col my-4" style={{maxHeight: 'calc(100vh - 2rem)'}}>
            <div className="flex justify-between items-center p-6 pb-3 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-extrabold text-sm text-slate-805">Add New Bus</h3>
              <button onClick={() => setShowAddBusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pb-2">
            <form id="add-bus-form" onSubmit={handleAddBus} className="space-y-4 text-xs py-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Bus Number</label>
                <input 
                  type="text" 
                  value={busNo}
                  onChange={(e) => setBusNo(e.target.value)}
                  placeholder="e.g. KA-01-AB-1234" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Operator Name</label>
                <input 
                  type="text" 
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  placeholder="e.g. VRL Travels" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Assigned Driver</label>
                <input 
                  type="text" 
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  placeholder="e.g. Ramesh Kumar" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Bus Type</label>
                <select 
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>AC Seater</option>
                  <option>Non-AC Seater</option>
                  <option>AC Sleeper</option>
                  <option>Non-AC Sleeper</option>
                  <option>AC Seater/Sleeper</option>
                  <option>Non-AC Seater/Sleeper</option>
                  <option>Luxury / Semi-Luxury</option>
                </select>
              </div>

              {/* Dynamic Seats Input based on Bus Type */}
              {['AC Sleeper', 'Non-AC Sleeper'].includes(busType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lower Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={lowerLeft} onChange={(e) => setLowerLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={lowerRight} onChange={(e) => setLowerRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Upper Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={upperLeft} onChange={(e) => setUpperLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={upperRight} onChange={(e) => setUpperRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(lowerLeft) + Number(lowerRight) + Number(upperLeft) + Number(upperRight)} Seats</span></p>
                  </div>
                </div>
              ) : ['AC Seater/Sleeper', 'Non-AC Seater/Sleeper'].includes(busType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seater Section</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={seaterLeft} onChange={(e) => setSeaterLeft(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={seaterRight} onChange={(e) => setSeaterRight(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Sleeper Lower Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={lowerLeft} onChange={(e) => setLowerLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={lowerRight} onChange={(e) => setLowerRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Sleeper Upper Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={upperLeft} onChange={(e) => setUpperLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={upperRight} onChange={(e) => setUpperRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(seaterLeft) + Number(seaterRight) + Number(lowerLeft) + Number(lowerRight) + Number(upperLeft) + Number(upperRight)} Seats</span></p>
                  </div>
                </div>
              ) : ['AC Seater', 'Non-AC Seater', 'Luxury / Semi-Luxury'].includes(busType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side Seats</label>
                        <input type="number" value={seaterLeft} onChange={(e) => setSeaterLeft(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side Seats</label>
                        <input type="number" value={seaterRight} onChange={(e) => setSeaterRight(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(seaterLeft) + Number(seaterRight)} Seats</span></p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Seats Capacity</label>
                  <input 
                    type="number" 
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    placeholder="54" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Insurance Expiry</label>
                  <input 
                    type="date" 
                    value={addInsurance}
                    onChange={(e) => setAddInsurance(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Fitness Expiry</label>
                  <input 
                    type="date" 
                    value={addFitness}
                    onChange={(e) => setAddFitness(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Last Service</label>
                  <input 
                    type="date" 
                    value={addLastService}
                    onChange={(e) => setAddLastService(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Next Service</label>
                  <input 
                    type="date" 
                    value={addNextService}
                    onChange={(e) => setAddNextService(e.target.value)}
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
            </form>
            </div>
            <div className="px-6 pb-5 pt-2 flex-shrink-0 border-t border-slate-100">
              <button 
                form="add-bus-form"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
              >
                Create Bus Profile
              </button>
            </div>
          </div>
        </div>
      )}
      {/* EDIT BUS MODAL */}
      {showEditBusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-2xl animate-scale-in flex flex-col my-4" style={{maxHeight: 'calc(100vh - 2rem)'}}>
            <div className="flex justify-between items-center p-6 pb-3 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-extrabold text-sm text-slate-805">Edit Bus Profile</h3>
              <button onClick={() => setShowEditBusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pb-2">
            <form id="edit-bus-form" onSubmit={handleSaveEditBus} className="space-y-4 text-xs py-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Bus Number</label>
                <input 
                  type="text" 
                  value={editBusNo}
                  onChange={(e) => setEditBusNo(e.target.value)}
                  placeholder="e.g. KA-01-AB-1234" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Operator Name</label>
                <input 
                  type="text" 
                  value={editBusName}
                  onChange={(e) => setEditBusName(e.target.value)}
                  placeholder="e.g. VRL Travels" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Assigned Driver</label>
                <input 
                  type="text" 
                  value={editDriver}
                  onChange={(e) => setEditDriver(e.target.value)}
                  placeholder="e.g. Ramesh Kumar" 
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Bus Type</label>
                <select 
                  value={editBusType}
                  onChange={(e) => setEditBusType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option>AC Seater</option>
                  <option>Non-AC Seater</option>
                  <option>AC Sleeper</option>
                  <option>Non-AC Sleeper</option>
                  <option>AC Seater/Sleeper</option>
                  <option>Non-AC Seater/Sleeper</option>
                  <option>Luxury / Semi-Luxury</option>
                </select>
              </div>

              {/* Dynamic Seats Input based on Bus Type */}
              {['AC Sleeper', 'Non-AC Sleeper'].includes(editBusType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lower Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={editLowerLeft} onChange={(e) => setEditLowerLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={editLowerRight} onChange={(e) => setEditLowerRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Upper Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={editUpperLeft} onChange={(e) => setEditUpperLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={editUpperRight} onChange={(e) => setEditUpperRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(editLowerLeft) + Number(editLowerRight) + Number(editUpperLeft) + Number(editUpperRight)} Seats</span></p>
                  </div>
                </div>
              ) : ['AC Seater/Sleeper', 'Non-AC Seater/Sleeper'].includes(editBusType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seater Section</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={editSeaterLeft} onChange={(e) => setEditSeaterLeft(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={editSeaterRight} onChange={(e) => setEditSeaterRight(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Sleeper Lower Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={editLowerLeft} onChange={(e) => setEditLowerLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={editLowerRight} onChange={(e) => setEditLowerRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Sleeper Upper Deck</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side</label>
                        <input type="number" value={editUpperLeft} onChange={(e) => setEditUpperLeft(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side</label>
                        <input type="number" value={editUpperRight} onChange={(e) => setEditUpperRight(e.target.value)} placeholder="6" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(editSeaterLeft) + Number(editSeaterRight) + Number(editLowerLeft) + Number(editLowerRight) + Number(editUpperLeft) + Number(editUpperRight)} Seats</span></p>
                  </div>
                </div>
              ) : ['AC Seater', 'Non-AC Seater', 'Luxury / Semi-Luxury'].includes(editBusType) ? (
                <div className="space-y-2">
                  <label className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Seat Layout</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Left Side Seats</label>
                        <input type="number" value={editSeaterLeft} onChange={(e) => setEditSeaterLeft(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Right Side Seats</label>
                        <input type="number" value={editSeaterRight} onChange={(e) => setEditSeaterRight(e.target.value)} placeholder="15" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-1">Total: <span className="text-blue-600">{Number(editSeaterLeft) + Number(editSeaterRight)} Seats</span></p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Seats Capacity</label>
                  <input 
                    type="number" 
                    value={editSeats}
                    onChange={(e) => setEditSeats(e.target.value)}
                    placeholder="54" 
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Insurance Expiry</label>
                  <input 
                    type="date" 
                    value={editInsurance}
                    onChange={(e) => setEditInsurance(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Fitness Expiry</label>
                  <input 
                    type="date" 
                    value={editFitness}
                    onChange={(e) => setEditFitness(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Last Service</label>
                  <input 
                    type="date" 
                    value={editLastService}
                    onChange={(e) => setEditLastService(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Next Service</label>
                  <input 
                    type="date" 
                    value={editNextService}
                    onChange={(e) => setEditNextService(e.target.value)}
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
            </form>
            </div>
            <div className="px-6 pb-5 pt-2 flex-shrink-0 border-t border-slate-100">
              <button 
                form="edit-bus-form"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Buses;
