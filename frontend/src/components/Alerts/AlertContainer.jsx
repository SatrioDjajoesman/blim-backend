import React from 'react';
import { useAlerts } from '../../context/AlertContext';
import AlertItem from './AlertItem';

const AlertContainer = () => {
  const { activeAlerts, dismissAlert } = useAlerts();

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[60] flex flex-col items-end gap-2 max-w-[90vw] sm:max-w-md pointer-events-none">
      {/* 
        pointer-events-none on container allows clicking through to page 
        pointer-events-auto on items allows interaction
      */}
      {activeAlerts.map(alert => (
        <div key={alert.id} className="pointer-events-auto w-full">
          <AlertItem alert={alert} onDismiss={dismissAlert} />
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
