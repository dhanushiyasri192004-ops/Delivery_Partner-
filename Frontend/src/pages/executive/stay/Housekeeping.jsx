import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { markRoomCleaned, assignHousekeepingStaff } from '../../../redux/slices/staySlice';

const Housekeeping = () => {
  const dispatch = useDispatch();
  const housekeepingList = useSelector(state => state.stay.housekeeping);
  
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const counts = {
    All: housekeepingList.length,
    Pending: housekeepingList.filter(h => h.status === 'Pending').length,
    InProgress: housekeepingList.filter(h => h.status === 'In Progress').length,
  };

  const tabs = [
    { label: 'All', count: counts.All },
    { label: 'Pending', count: counts.Pending },
    { label: 'In Progress', count: counts.InProgress }
  ];

  const handleUpdate = (task) => {
    if (task.status === 'Pending') {
      // Move to In Progress
      dispatch(assignHousekeepingStaff({ room: task.room, staff: 'Ramesh Kumar' }));
      // Directly change task in local UI state by updating Redux slice task assignment
      // (Let's make sure the staff name changes, and we simulate the next stage)
      // Actually, let's keep it simple: if In Progress is clicked again, we mark it Cleaned!
      // In a real app, a subagent or staff app updates this, but for the Executive we allow completing the request.
    } else if (task.status === 'In Progress') {
      // Mark as Cleaned (which removes it from housekeeping and updates room to Available)
      dispatch(markRoomCleaned(task.room));
    }
  };

  const filteredTasks = housekeepingList.filter(t => {
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    const matchesFilter = statusFilter === 'All Status' || t.status === statusFilter;
    return matchesTab && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in text-slate-805">
      
      {/* Filter Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                activeTab === tab.label 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3">Room No.</th>
                <th className="pb-3">Task Details</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Assigned To</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No housekeeping tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-bold text-slate-805">Room #{h.room}</td>
                    <td className="py-3.5 text-slate-500">{h.task}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        h.status === 'Pending' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>{h.status}</span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-bold">{h.staff}</td>
                    <td className="py-3.5 text-right">
                      <button 
                        onClick={() => handleUpdate(h)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-xl transition-all active:scale-95"
                      >
                        {h.status === 'Pending' ? 'Assign Staff' : 'Complete / Cleaned'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Housekeeping;
