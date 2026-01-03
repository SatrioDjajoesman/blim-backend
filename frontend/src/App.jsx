import React from 'react';
import Header from './components/Header';
import { DistanceCard, SoilCard, TiltCard } from './components/SensorCards';
import BlimDeviceVisualizer from './components/BlimDeviceVisualizer';
import { InterpretationPanel, RawDataPanel } from './components/InfoPanels';
import { useSensorData } from './hooks/useSensorData';
import AlertContainer from './components/Alerts/AlertContainer';
import AlertHistoryModal from './components/Alerts/AlertHistoryModal';
import { useAlertLogic } from './hooks/useAlertLogic';

function App() {
  const { status, currentData, history, interpretations } = useSensorData();
  
  // Initialize Alert System Logic
  useAlertLogic(currentData);

  return (
    <div className="min-h-screen bg-cream text-gray-800 font-sans selection:bg-sensor-blue/20">
      <AlertContainer />
      <AlertHistoryModal />
      
      <Header status={status} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* 3D Device Visualization */}
        <section>
          <BlimDeviceVisualizer />
        </section>

        {/* Hero Metrics Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DistanceCard 
            value={currentData?.distance} 
            wph={currentData?.wph}
            history={history} 
          />
          <SoilCard 
            value={currentData?.soil} 
            history={history} 
          />
          <TiltCard 
            x={currentData?.tiltX} 
            y={currentData?.tiltY} 
            history={history} 
          />
        </section>

        {/* Interpretation & Trends */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InterpretationPanel messages={interpretations.messages} />
          </div>
          {/* We could add another panel here or just leave it wide */}
        </section>

        {/* Raw Data */}
        <section>
          <RawDataPanel data={interpretations.raw} />
        </section>

      </main>
      
      <footer className="text-center py-6 text-xs text-muted-text opacity-60">
        BLIM Environmental Monitoring System v1.0
      </footer>
    </div>
  );
}

export default App;
