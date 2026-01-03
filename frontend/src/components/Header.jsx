import React from 'react';
import { Wifi, WifiOff, RefreshCw, Stone, History } from 'lucide-react';
import clsx from 'clsx';
import { useAlerts } from '../context/AlertContext';

const Header = ({ status }) => {
  const { toggleHistory } = useAlerts();

  const getStatusConfig = (s) => {
    switch(s) {
      case 'connected': return { color: 'text-sensor-green', text: 'Live Stream Active', icon: Wifi };
      case 'reconnecting': return { color: 'text-sensor-amber', text: 'Reconnecting...', icon: RefreshCw, animate: true };
      case 'disconnected': return { color: 'text-sensor-red', text: 'Signal Lost', icon: WifiOff };
      default: return { color: 'text-gray-400', text: 'Initializing...', icon: Wifi };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-cream-dark rounded-md flex items-center justify-center text-sensor-blue font-bold">
            <Stone className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
            BLIM <span className="font-light text-muted-text">Environmental Live Observatory</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleHistory}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <History size={16} />
          <span className="hidden sm:inline">View Alert History</span>
        </button>

        <div className={clsx("flex items-center gap-2 text-sm font-medium transition-colors duration-300", config.color)}>
          <span className={clsx("w-2 h-2 rounded-full bg-current", config.animate && "animate-pulse")} />
          <span className="hidden sm:block">{config.text}</span>
          <StatusIcon size={18} className={clsx(config.animate && "animate-spin")} />
        </div>
      </div>
    </header>
  );
};

export default Header;
