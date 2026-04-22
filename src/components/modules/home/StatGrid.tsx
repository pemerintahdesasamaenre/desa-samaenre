// src/components/modules/home/StatGrid.tsx
import { StatCard } from '@/components/ui/StatCard';
import { Users, Wallet, MapPin, Briefcase } from 'lucide-react';

interface StatGridProps {
  population: number;
  budget: number;
  hamletCount: number;
  staffCount: number;
}

export default function StatGrid({ population, budget, hamletCount, staffCount }: StatGridProps) {

  // If budget info might be from latest year, we could dynamically detect it, 
  // but for label we'll just use 'Laporan Keuangan' for maximum consistency.

  return (
    <section id="statistics" className="relative pb-24 px-4 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 relative z-30">
          <StatCard icon={<Users size={32} />} label="Populasi" value={population} unit="Jiwa" />
          <StatCard icon={<Wallet size={32} />} label="Anggaran Pendapatan" value={budget} prefix="Rp" unit="Total" />
          <StatCard icon={<MapPin size={32} />} label="Wilayah Dusun" value={hamletCount} unit="Wilayah" />
          <StatCard icon={<Briefcase size={32} />} label="Aparatur Desa" value={staffCount} unit="Orang" />
        </div>
      </div>
    </section>
  );
}
