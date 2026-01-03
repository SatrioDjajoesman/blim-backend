import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState(() => {
    const saved = localStorage.getItem('blim_alert_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Persist history
  useEffect(() => {
    localStorage.setItem('blim_alert_history', JSON.stringify(alertHistory));
  }, [alertHistory]);

  const addAlert = useCallback((message, type = 'warning') => {
    const now = new Date();
    const newAlert = {
      id: crypto.randomUUID(),
      message,
      type, // 'warning' or 'critical'
      timestamp: now.toISOString().replace('T', ' ').split('.')[0], // YYYY-MM-DD HH:MM:SS (approx)
      rawTimestamp: now.getTime(),
    };

    // Add to active alerts
    setActiveAlerts(prev => [newAlert, ...prev]);

    // Add to history
    setAlertHistory(prev => [newAlert, ...prev]);

    // Auto dismiss active alert after 10 seconds
    setTimeout(() => {
      dismissAlert(newAlert.id);
    }, 10000);

    return newAlert.id;
  }, []);

  const dismissAlert = useCallback((id) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setAlertHistory([]);
  }, []);

  const toggleHistory = useCallback(() => {
    setIsHistoryOpen(prev => !prev);
  }, []);

  return (
    <AlertContext.Provider value={{
      activeAlerts,
      alertHistory,
      addAlert,
      dismissAlert,
      clearHistory,
      isHistoryOpen,
      toggleHistory
    }}>
      {children}
    </AlertContext.Provider>
  );
};
