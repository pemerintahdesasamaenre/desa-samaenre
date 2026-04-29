'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  prefix?: string;
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
    // Set initial text
    if (ref.current) {
      ref.current.textContent = Intl.NumberFormat("id-ID").format(0);
    }

    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("id-ID").format(
          Math.round(latest)
        );
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return <span ref={ref} className="tabular-nums">0</span>;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value: rawValue, unit, prefix, icon }) => {
  // Pastikan ada nilai, default ke 0
  const value = rawValue ?? 0;
  
  // Cek apakah value adalah angka murni
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9,-]+/g,"").replace(",", ".")) 
    : value;
  const isNumeric = !isNaN(numericValue as number) && typeof numericValue === 'number';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="stat-card-surface p-6 rounded-3xl group relative overflow-hidden flex flex-col justify-between h-full shadow-lg border border-white/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 shadow-inner">
          {icon}
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
      </div>

      <div className="space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tighter flex items-baseline gap-1">
            {prefix && <span className="text-lg md:text-xl opacity-50 font-bold">{prefix}</span>}
            {isNumeric ? <NumberTicker value={numericValue as number} /> : (value || "0")}
          </h2>
          {unit && (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{unit}</span>
          )}
        </div>
      </div>

      {/* Decorative layer - No blur, just subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};
