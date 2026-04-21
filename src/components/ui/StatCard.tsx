'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover="hover"
      className="glass-premium p-8 rounded-[3.5rem] group relative overflow-hidden cursor-default shadow-xl"
    >
      {/* Decorative background glow - ONLY visible/active on hover for max performance */}
      <motion.div 
        variants={{
          hover: { scale: 1.5, opacity: 0.15, x: 20, y: 20 }
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full blur-[50px] pointer-events-none opacity-5 transition-opacity duration-500"
      />

      <div className="flex flex-col gap-6 relative z-10">
        {icon && (
          <motion.div 
            variants={{
              hover: { scale: 1.1, rotate: 5 }
            }}
            className="w-16 h-16 bg-white/10 text-primary rounded-[1.8rem] flex items-center justify-center shadow-lg border border-white/20 transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {icon}
          </motion.div>
        )}
        <div className="space-y-2">
          <p className="text-foreground/80 dark:text-muted-foreground font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter transition-colors duration-500 group-hover:text-primary">
              {value}
            </span>
            {unit && <span className="text-foreground/80 dark:text-muted-foreground font-black uppercase text-[10px] tracking-widest">{unit}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
