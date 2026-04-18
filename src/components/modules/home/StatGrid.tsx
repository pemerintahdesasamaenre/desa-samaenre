// src/components/modules/home/StatGrid.tsx
import { StatCard } from '@/components/ui/StatCard';
import { Users, Wallet, MapPin } from 'lucide-react';

interface StatGridProps {
  population: number;
  budget: number;
  hamletCount: number;
  staffCount: number;
}

export default function StatGrid({ population, budget, hamletCount, staffCount }: StatGridProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
          <StatCard icon={<Users />} label="Total Penduduk" value={population.toLocaleString()} unit="Jiwa" />
          <StatCard icon={<Wallet />} label={`Anggaran ${new Date().getFullYear()}`} value={`Rp ${Math.round(budget / 1_000_000)} Jt`} unit="Total Pendapatan" />
          <StatCard icon={<MapPin />} label="Jumlah Dusun" value={hamletCount.toLocaleString()} unit="Wilayah" />
          <StatCard icon={<Users />} label="Aparatur Desa" value={staffCount.toLocaleString()} unit="Orang" />
        </div>
      </div>
    </div>
  );
}
