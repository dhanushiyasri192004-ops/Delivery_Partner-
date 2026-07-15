import React, { useState } from 'react';
import { Users, Shield, Calendar, Wrench, CheckCircle } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    { name: 'Suresh Raina', role: 'Technician', status: 'Online', attendance: 'Present', tasks: 2 },
    { name: 'Manoj Kumar', role: 'Housekeeping', status: 'Online', attendance: 'Present', tasks: 4 },
    { name: 'Kiran Dev', role: 'Receptionist', status: 'Offline', attendance: 'On Leave', tasks: 0 },
    { name: 'Vikram Singh', role: 'Security Guard', status: 'Online', attendance: 'Present', tasks: 1 }
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in text-slate-805">

      {/* Staff Directory */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Specialty Role</th>
              <th className="px-6 py-4">Online Status</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4">Assigned Tasks</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold">
            {staff.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-6 py-4.5 font-extrabold text-slate-800">{s.name}</td>
                <td className="px-6 py-4.5 font-bold text-slate-600">{s.role}</td>
                <td className="px-6 py-4.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                    s.status === 'Online' ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-slate-350'}`}></span>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4.5">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    s.attendance === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>{s.attendance}</span>
                </td>
                <td className="px-6 py-4.5 text-center font-bold text-slate-700">{s.tasks} Jobs</td>
                <td className="px-6 py-4.5 text-right">
                  <button 
                    onClick={() => {}}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg transition-all"
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;
