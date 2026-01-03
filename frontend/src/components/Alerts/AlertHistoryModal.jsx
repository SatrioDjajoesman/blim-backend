import React, { useState } from 'react';
import { useAlerts } from '../../context/AlertContext';
import { X, Search, Trash2, Calendar } from 'lucide-react';

const AlertHistoryModal = () => {
  const { isHistoryOpen, toggleHistory, alertHistory, clearHistory } = useAlerts();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isHistoryOpen) return null;

  const filteredHistory = alertHistory.filter(alert => 
    alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.timestamp.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Alert History</h2>
          <button 
            onClick={toggleHistory}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close history"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sensor-blue focus:border-sensor-blue outline-none"
            />
          </div>
          {alertHistory.length > 0 && (
            <button 
              onClick={() => {
                if(window.confirm('Clear all alert history?')) clearHistory();
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No alerts found.</p>
            </div>
          ) : (
            filteredHistory.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border bg-white shadow-sm flex gap-4 ${
                  alert.type === 'critical' ? 'border-red-200' : 'border-yellow-200'
                }`}
              >
                <div className={`w-1.5 rounded-full flex-shrink-0 ${
                   alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{alert.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      alert.type === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-right">
          Total Alerts: {alertHistory.length}
        </div>
      </div>
    </div>
  );
};

export default AlertHistoryModal;
