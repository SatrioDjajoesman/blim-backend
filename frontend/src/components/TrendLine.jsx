import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

const TrendLine = ({ data, dataKey, color = "#8884d8", height = 100, domain = ['auto', 'auto'] }) => {
  if (!data || data.length < 2) return <div style={{ height }} className="w-full bg-technical-grid/50 rounded" />;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={domain} hide />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} // Disable animation for smoother real-time updates or keep it subtle
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLine;
