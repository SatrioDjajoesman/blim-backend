import React from 'react';
import MetricCard from './MetricCard';
import TrendLine from './TrendLine';
import { Ruler, Droplets, Rotate3D } from 'lucide-react';
import clsx from 'clsx';

export const DistanceCard = ({ value, history, wph }) => {
  // Assuming max distance for gauge is 200cm (ultrasonic usually goes further but for visual scale)
  const MAX_DIST = 200;
  const percentage = value ? Math.min((value / MAX_DIST) * 100, 100) : 0;
  
  const unitDisplay = (
    <span className="flex items-baseline gap-2">
      cm

    </span>
  );

  return (
    <MetricCard 
      title="Ultrasonic Distance" 
      value={value ? value.toFixed(1) : null} 
      unit={unitDisplay} 
      icon={Ruler}
      statusColor="bg-sensor-blue"
    >
      <div className='flex justify-end'>
            {wph !== null && wph !== undefined && (
        <span className="text-sm tracking-tight text-sensor-blue bg-blue-50 border border-blue-600/50 px-2 py-0.5 rounded-lg hover:scale-105 shadow-sm hover:shadow-md shadow-blue-800/30 transition-all duration-300 font-medium whitespace-nowrap ml-1">
          Water level rise: {wph > 0 ? '↑' : ''}{wph} cm/h
        </span>
      )}
      </div>
      <div className="flex gap-4 h-32 items-end">

        {/* Trend and Min/Max */}
        <div className="flex-1 flex flex-row justify-end gap-2 border-b">
            <div className="text-[9px] text-muted-text flex flex-col items-end justify-between border-r border-gray-500 p-1">
                <span>{MAX_DIST}+</span>
                <span>100</span>
                <span>0</span>
            </div>
            <TrendLine data={history} dataKey="distance" color="#4A90E2" />
        </div>
      </div>
    </MetricCard>
  );
};

export const SoilCard = ({ value, history }) => {
  // Value is percentage 0-100
  const getMoistureStatus = (v) => {
      if (v < 30) return { label: 'Dry', color: 'text-sensor-amber' };
      if (v > 70) return { label: 'Saturated', color: 'text-sensor-blue' };
      return { label: 'Optimal', color: 'text-sensor-green' };
  };

  const status = value !== null ? getMoistureStatus(value) : { label: '--', color: '' };

  return (
    <MetricCard 
      title="Soil Moisture" 
      value={value ? value.toFixed(0) : null} 
      unit="%" 
      icon={Droplets}
      statusColor="bg-sensor-green"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <span className={clsx("text-sm font-medium tracking-tight border border-zinc-500/30 bg-zinc-400/30 px-2 py-0.5 rounded-lg hover:scale-105 shadow-sm hover:shadow-md shadow-black/30 transition-all duration-300", status.color)}>Status: {status.label}</span>
        </div>

        <div className="flex gap-4 h-32 items-end">
            <div className="flex-1 flex flex-row justify-end gap-2 border-b">
                <div className="text-[9px] text-muted-text flex flex-col items-end justify-between border-r border-gray-500 p-1">
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                </div>
                <TrendLine data={history} dataKey="soil" color="#50E3C2" domain={[0, 100]} />
            </div>
        </div>
      </div>
    </MetricCard>
  );
};

export const TiltCard = ({ x, y, history }) => {
  // Artificial Horizon Visualization
  // Rotate line by X (roll), Move up/down by Y (pitch)
  // Simple clamped values for visualization
  const roll = x || 0;
  const pitch = y || 0;
  
  const rotation = `rotate(${roll}deg)`;
  const translateY = `translateY(${Math.max(Math.min(pitch, 45), -45)}px)`;

  const getTiltStatus = (xVal, yVal) => {
      const xAbs = Math.abs(xVal || 0);
      const yAbs = Math.abs(yVal || 0);
      
      const xExtreme = xAbs > 30;
      const yExtreme = yAbs > 30;
      
      if (xExtreme || yExtreme) {
          const axes = [];
          if (xExtreme) axes.push('X');
          if (yExtreme) axes.push('Y');
          return { label: `Extreme Tilt (${axes.join(', ')})`, color: 'text-red-500' };
      }
      
      const xMedium = xAbs >= 15;
      const yMedium = yAbs >= 15;
      
      if (xMedium || yMedium) {
          const axes = [];
          if (xMedium) axes.push('X');
          if (yMedium) axes.push('Y');
          return { label: `Medium Tilt (${axes.join(', ')})`, color: 'text-sensor-amber' };
      }

      return { label: 'Normal Tilt', color: 'text-sensor-green' };
  };

  const status = getTiltStatus(x, y);

  return (
    <MetricCard 
      title="Tilt Angle" 
      value={null} // Custom value display
      unit="" 
      icon={Rotate3D}
      statusColor="bg-sensor-amber"
    >
        <div className="absolute top-1/2 -translate-y-[20%] right-6 text-right flex flex-col items-end gap-2">
             <div className="text-lg text-muted-text">X: <span className="text-gray-800 font-mono text-lg">{x?.toFixed(1)}°</span></div>
             <div className="text-lg text-muted-text">Y: <span className="text-gray-800 font-mono text-lg">{y?.toFixed(1)}°</span></div>
              <span className={clsx("text-sm tracking-tight font-medium border border-zinc-500/30 px-2 py-0.5 hover:scale-105 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg", status.color, {
                "bg-red-500/20 text-red-500 shadow-red-500/30": status.color === "text-red-500",
                "bg-amber-500/20 text-sensor-amber shadow-amber-500/30": status.color === "text-sensor-amber",
                "bg-green-500/20 text-sensor-green shadow-green-500/30": status.color === "text-sensor-green"
              })}>
                {status.label}
            </span>
        </div>

        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center justify-center py-2 h-40">
                {/* Artificial Horizon Circle */}
                <div className="w-40 h-40 rounded-full border-4 border-gray-200 bg-sky-100 relative overflow-hidden shadow-inner">
                    {/* Ground/Sky division moving with pitch */}
                    <div 
                        className="absolute inset-[-50%] bg-stone-300 origin-center transition-transform duration-300 ease-out"
                        style={{ transform: `${rotation} ${translateY}` }}
                    >
                        <div className="w-full h-[50%] bg-sky-200 border-b border-gray-400" />
                    </div>
                    
                    {/* Crosshair fixed */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                        <div className="w-full h-[1px] bg-gray-800" />
                        <div className="h-full w-[1px] bg-gray-800 absolute" />
                    </div>
                </div>
            </div>
        </div>
        
        {/* We can show X tilt trend as a proxy for activity */}
        {/* <div className="h-10 mt-2">
             <TrendLine data={history} dataKey="tiltX" color="#F5A623" height={40} />
        </div> */}
    </MetricCard>
  );
};
