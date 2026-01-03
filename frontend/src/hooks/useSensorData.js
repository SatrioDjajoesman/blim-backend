import { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from './useWebSocket';

const BUFFER_SIZE = 50; // Keep last 50 readings for trends

export const useSensorData = () => {
  const { status, lastMessage } = useWebSocket();
  const [currentData, setCurrentData] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Parse message
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const parsed = JSON.parse(lastMessage);
      
      // Validate expected keys: w (distance), s (soil), tx/ty (tilt)
      // If valid, update state
      if (parsed) {
        const newData = {
          distance: parsed.w !== undefined ? Number(parsed.w) : null, // Ultrasonic distance
          wph: parsed.wph !== undefined ? Number(parsed.wph) : null,  // Water rise cm/h
          soil: parsed.s !== undefined ? Number(parsed.s) : null,     // Soil moisture
          tiltX: parsed.tx !== undefined ? Number(parsed.tx) : null,   // Tilt X
          tiltY: parsed.ty !== undefined ? Number(parsed.ty) : null,   // Tilt Y
          timestamp: Date.now(),
        };

        setCurrentData(newData);

        setHistory(prev => {
          const newHistory = [...prev, newData];
          if (newHistory.length > BUFFER_SIZE) {
            return newHistory.slice(newHistory.length - BUFFER_SIZE);
          }
          return newHistory;
        });
      }
    } catch (e) {
      console.warn("Received malformed JSON:", lastMessage);
      // Ignore malformed data as per requirements
    }
  }, [lastMessage]);

  // Derived Interpretations
  const interpretations = useMemo(() => {
    if (!currentData) return { messages: ["Waiting for data..."], raw: null };

    const { distance, soil, tiltX, tiltY } = currentData;
    const msgs = [];

    // Soil
    if (soil !== null) {
      if (soil < 30) msgs.push("Ground moisture trending dry.");
      else if (soil > 70) msgs.push("Soil saturation levels high.");
      else msgs.push("Soil moisture optimal.");
    }

    // Distance / Surface
    // Assuming distance measures distance to ground/water surface? 
    // Or maybe just generic distance. "Surface appears stable" suggests ground.
    // Let's analyze fluctuation in history for "Distance readings fluctuating"
    if (history.length > 5) {
      const recentDistances = history.slice(-5).map(h => h.distance).filter(d => d !== null);
      if (recentDistances.length > 1) {
        const variance = Math.max(...recentDistances) - Math.min(...recentDistances);
        if (variance > 5) msgs.push("Surface readings fluctuating.");
        else msgs.push("Surface appears stable.");
      }
    }

    // Tilt
    if (tiltX !== null && tiltY !== null) {
        if (Math.abs(tiltX) > 15 || Math.abs(tiltY) > 15) msgs.push("Significant inclination detected.");
        else msgs.push("Sensor orientation stable.");
    }

    return {
      messages: msgs,
      raw: currentData
    };

  }, [currentData, history]);

  return {
    status,
    currentData,
    history,
    interpretations
  };
};
