import React from 'react';
import clsx from 'clsx';

const MetricCard = ({ title, value, unit, icon: Icon, children, className, statusColor = "bg-gray-200" }) => {
  return (
    <div className={clsx("bg-white rounded-xl p-6 border border-stone-300 flex flex-col justify-between h-full relative overflow-hidden", className)}>
       {/* Background Grid Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted-text text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                {Icon && <Icon size={16} />}
                {title}
            </h3>
            <div className={clsx("w-2 h-2 rounded-full", statusColor)} />
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-light tracking-tight text-gray-800">
                {value !== null && value !== undefined ? value : '--'}
            </span>
            <span className="text-sm text-muted-text font-medium">{unit}</span>
        </div>

        <div className="mt-auto">
            {children}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
