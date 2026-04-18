import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="glass-premium p-8 rounded-[2.5rem] hover-lift group border-white/20 dark:border-white/10 transition-all duration-700 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
      
      <div className="flex flex-col gap-6 relative z-10">
        {icon && (
          <div className="w-16 h-16 bg-white/50 dark:bg-black/20 backdrop-blur-xl text-primary rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/50 dark:border-white/10">
            {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 32 })}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-muted-foreground/80 text-xs font-black uppercase tracking-[0.2em]">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors duration-500">
              {value}
            </span>
            {unit && <span className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
