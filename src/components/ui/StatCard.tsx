'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

// Komponen Ticker Angka ala Magic UI / 3rd Party
function NumberTicker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.round(latest)
        );
      }
    });
  }, [springValue]);

  return <span ref={ref} className="tabular-nums" />;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  // Cek apakah value adalah angka murni
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;
  const isNumeric = !isNaN(numericValue as number) && typeof numericValue === 'number';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="stat-card-surface p-8 rounded-[3rem] group relative overflow-hidden flex flex-col justify-between h-full shadow-lg border border-white/10"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 shadow-inner">
          {icon}
        </div>
        <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            {isNumeric ? <NumberTicker value={numericValue as number} /> : value}
          </h2>
          {unit && (
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{unit}</span>
          )}
        </div>
      </div>

      {/* Decorative layer - No blur, just subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};
