import React from 'react';
import { X, AlertTriangle, AlertOctagon } from 'lucide-react';
import clsx from 'clsx';

const AlertItem = ({ alert, onDismiss }) => {
  const isCritical = alert.type === 'critical';
  
  const styles = isCritical 
    ? "bg-red-50 border-l-4 border-red-500 text-red-700"
    : "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700";

  const Icon = isCritical ? AlertOctagon : AlertTriangle;

  return (
    <div 
      className={clsx(
        "w-full max-w-md p-4 mb-3 rounded shadow-lg flex items-start justify-between transition-all duration-300 ease-in-out transform translate-y-0 opacity-100",
        styles
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx("w-5 h-5 mt-0.5 flex-shrink-0", isCritical ? "text-red-500" : "text-yellow-500")} />
        <div>
          <p className="font-medium text-sm sm:text-base leading-snug">{alert.message}</p>
          <p className="text-xs mt-1 opacity-75 font-mono">{alert.timestamp}</p>
        </div>
      </div>
      <button 
        onClick={() => onDismiss(alert.id)}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
        aria-label="Dismiss alert"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default AlertItem;
