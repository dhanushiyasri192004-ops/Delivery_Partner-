import React from 'react';
import { Compass } from 'lucide-react';

const LiveTracking = () => {
  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="h-[450px] bg-slate-100 relative flex items-center justify-center">
          <svg viewBox="0 0 400 200" className="w-full h-full opacity-60">
            <path d="M 50,150 Q 150,50 250,120 T 350,50" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="6 4" />
            <circle cx="50" cy="150" r="8" fill="#3b82f6" />
            <circle cx="350" cy="50" r="8" fill="#ef4444" />
            <circle cx="210" cy="108" r="10" fill="#f59e0b" />
          </svg>
          <div className="absolute text-center space-y-2">
            <Compass className="h-10 w-10 text-brand animate-spin mx-auto" />
            <span className="text-xs font-semibold text-slate-600 block">Mapping live position coordinates...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
