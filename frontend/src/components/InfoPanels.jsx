import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import clsx from 'clsx';

export const InterpretationPanel = ({ messages = [] }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-muted-text text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
        <Activity size={16} />
        System Interpretation
      </h3>
      <div className="space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-700 animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="w-1.5 h-1.5 rounded-full bg-sensor-blue" />
              <span>{msg}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-400 italic">No significant events detected.</span>
        )}
      </div>
    </div>
  );
};

export const RawDataPanel = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-cream-dark rounded-xl border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <span className="text-xs font-mono text-muted-text uppercase flex items-center gap-2">
            <Terminal size={14} />
            Raw Telemetry Stream
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
