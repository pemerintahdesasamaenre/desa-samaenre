'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface DemographicData {
  population: { male: number; female: number };
  age_groups: ChartDataPoint[];
  education: ChartDataPoint[];
  marital_status: ChartDataPoint[];
  hamlets: { name: string; value: number }[];
  occupations: ChartDataPoint[];
}

interface ChartProps {
  data: DemographicData;
}

const PREMIUM_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

interface TooltipPayload {
  name: string;
  value: number;
  payload: Record<string, unknown>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-premium p-4 rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 min-w-[120px]">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label || payload[0].name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary tabular-nums">
            {payload[0].value.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Jiwa</span>
        </div>
      </div>
    );
  }
  return null;
};


export const DemographicCharts = ({ data }: ChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isMounted) {
    return <div className="h-[600px] w-full bg-muted/10 animate-pulse rounded-3xl" />;
  }

  const genderData = [
    { name: 'Laki-laki', value: data.population.male },
    { name: 'Perempuan', value: data.population.female }
  ];

  return (
    <div className="space-y-12 min-h-[600px]">
      {/* Row 1: Gender & Age Group */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Gender Distribution */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">Proporsi Jenis Kelamin</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="var(--color-primary)" stroke="none" />
                  <Cell fill="#ec4899" stroke="none" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Groups */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">Kelompok Usia</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.age_groups}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="opacity-50" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="opacity-50" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                <Bar dataKey="value" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Education & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 pt-10 border-t border-slate-100 dark:border-slate-800/50">
        {/* Education Level */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">Tingkat Pendidikan</h3>
          </div>
          <div className="h-[320px] w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.education}
                  nameKey="label"
                  dataKey="value"
                  innerRadius={0}
                  outerRadius={100}
                >
                  {data.education.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marital Status */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">Status Perkawinan</h3>
          </div>
          <div className="h-[320px] w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.marital_status} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="opacity-5" />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'currentColor' }} width={100} className="opacity-70" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                <Bar dataKey="value" fill="#10B981" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Hamlets & Top Occupations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 pt-10 border-t border-slate-100 dark:border-slate-800/50">
        {/* Hamlet Distribution */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">Wilayah Dusun</h3>
          </div>
          <div className="h-[320px] w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hamlets}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="opacity-50" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="opacity-50" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Occupations */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-rose-500 pl-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">5 Besar Pekerjaan</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.occupations} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="opacity-5" />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'currentColor' }} width={120} className="opacity-70" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {data.occupations.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
