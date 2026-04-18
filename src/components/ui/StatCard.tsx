import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
      <p className="text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="ml-2 text-gray-400 dark:text-slate-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};
