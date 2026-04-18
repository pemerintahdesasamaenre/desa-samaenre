import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="ml-2 text-gray-400 text-sm">{unit}</span>}
      </div>
    </div>
  );
};
