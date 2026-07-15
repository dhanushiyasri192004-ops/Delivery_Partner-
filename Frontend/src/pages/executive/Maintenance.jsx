import React, { useState } from 'react';
import { Wrench, Clock, ShieldAlert, CheckCircle2, CheckCircle } from 'lucide-react';

const Maintenance = () => {
  const [logs, setLogs] = useState([
    { room: '103', issue: 'AC Repair', tech: 'Suresh Raina', eta: 'Today, 02:00 PM', priority: 'High', status: 'Assigned' },
    { room: '104', issue: 'Plumbing Leakage', tech: 'Vikram Singh', eta: 'Today, 04:30 PM', priority: 'Critical', status: 'In Progress' },
    { room: '202', issue: 'Bed Fixing', tech: 'Unassigned', eta: 'Tomorrow, 10:00 AM', priority: 'Medium', status: 'Pending' }
  ]);
  const [toast, setToast] = useState(null);

  const markCompleted = (idx) => {
    setLogs(prev => prev.map((l, i) => i === idx ? { ...l, status: 'Completed' } : l));
    setToast(`Room #${logs[idx].room} maintenance marked as completed!`);
    setTimeout(() => setToast(null), 3000);
  };

  const getPriorityStyle = (priority) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOW': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-slate-805">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl animate-fade-in">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          {toast}
        </div>
      )}

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-805 text-sm">Room #{log.room}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{log.issue}</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${getPriorityStyle(log.priority)}`}>
                {log.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Technician</span>
                <span className="flex items-center gap-1.5 mt-0.5"><Wrench className="h-3.5 w-3.5 text-slate-450" /> {log.tech}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Expected ETA</span>
                <span className="flex items-center gap-1.5 mt-0.5"><Clock className="h-3.5 w-3.5 text-slate-455" /> {log.eta}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-50 text-[10px] font-black uppercase">
              {log.status === 'Completed' ? (
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase">
                  <CheckCircle className="h-4 w-4" /> Task Completed
                </div>
              ) : (
                <button
                  onClick={() => markCompleted(idx)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark Task Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
