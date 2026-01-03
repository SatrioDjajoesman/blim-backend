import { useEffect, useRef } from 'react';
import { useAlerts } from '../context/AlertContext';

export const useAlertLogic = (currentData) => {
  const { addAlert } = useAlerts();
  const prevDataRef = useRef(null);

  useEffect(() => {
    if (!currentData) return;

    const prev = prevDataRef.current;
    const curr = currentData;

    // Helper: Rising Threshold (e.g., Speed, Tilt)
    // Triggers when value crosses threshold from below, or is above threshold on initial load
    const checkRise = (prevVal, currVal, threshold, msg, type) => {
      const p = prevVal === undefined || prevVal === null ? -Infinity : prevVal;
      if (currVal !== null && currVal >= threshold && p < threshold) {
        addAlert(msg, type);
      }
    };

    // Helper: Falling Threshold (e.g., Distance)
    // Triggers when value crosses threshold from above, or is below threshold on initial load
    const checkFall = (prevVal, currVal, threshold, msg, type) => {
      const p = prevVal === undefined || prevVal === null ? Infinity : prevVal;
      if (currVal !== null && currVal <= threshold && p > threshold) {
        addAlert(msg, type);
      }
    };

    // --- Water Level Rise Speed (cm/h) ---
    // Triggers at: 30, 50, 70
    if (curr.wph !== undefined) {
       checkRise(prev?.wph, curr.wph, 30, `ALERT: Water level rise speed has reached ${curr.wph} cm/h`, 'warning');
       checkRise(prev?.wph, curr.wph, 50, `ALERT: Water level rise speed has reached ${curr.wph} cm/h`, 'warning');
       checkRise(prev?.wph, curr.wph, 70, `ALERT: Water level rise speed has reached ${curr.wph} cm/h`, 'critical');
    }

    // --- Ultrasonic Distance (cm) ---
    // Triggers at: 100, 50, 30, 10
    if (curr.distance !== undefined) {
        checkFall(prev?.distance, curr.distance, 100, `ALERT: Distance from sensor to water surface is ${curr.distance} cm`, 'warning');
        checkFall(prev?.distance, curr.distance, 50, `ALERT: Distance from sensor to water surface is ${curr.distance} cm`, 'warning');
        checkFall(prev?.distance, curr.distance, 30, `ALERT: Distance from sensor to water surface is ${curr.distance} cm`, 'critical');
        checkFall(prev?.distance, curr.distance, 10, `ALERT: Distance from sensor to water surface is ${curr.distance} cm`, 'critical');
    }

    // --- Tilt Angle ---
    // Triggers at: Medium (15), Extreme (30)
    const maxTilt = Math.max(Math.abs(curr.tiltX || 0), Math.abs(curr.tiltY || 0));
    const prevMaxTilt = prev ? Math.max(Math.abs(prev.tiltX || 0), Math.abs(prev.tiltY || 0)) : null;

    checkRise(prevMaxTilt, maxTilt, 15, `ALERT: Tilt has reached Medium level`, 'warning');
    checkRise(prevMaxTilt, maxTilt, 30, `ALERT: Tilt has reached Extreme level`, 'critical');

    prevDataRef.current = curr;
  }, [currentData, addAlert]);
};
