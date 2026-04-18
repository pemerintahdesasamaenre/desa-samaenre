import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1 flex items-center gap-4">
      {icon && (
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
          {icon}
        </div>
      )}
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {label}
        </p>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
          {unit && <span className="ml-2 text-slate-400 dark:text-slate-500 text-xs">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
