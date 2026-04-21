import { Suspense } from 'react';
import { Users, Home, TrendingUp, Info } from 'lucide-react';
import { getDemographics } from '@/services/data-service';
import { DemographicCharts } from '@/components/modules/statistics/DemographicCharts';
import { StatCard } from '@/components/ui/StatCard';

export const metadata = {
  title: 'Statistik Kependudukan - Profil Desa',
  description: 'Data statistik kependudukan, pekerjaan, dan wilayah desa.',
};

export default async function StatistikPage() {
  const data = await getDemographics();

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      {/* Standard App Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-3 -translate-y-48"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 animate-fade-in">
          <div className="space-y-6 max-w-3xl text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-black uppercase tracking-widest">
              Infografis Desa
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85]">
              Data <br/> <span className="text-gradient">Demografi</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Analisis mendalam mengenai komposisi penduduk, tingkat pendidikan, dan persebaran wilayah Dusun di desa kami.
            </p>
          </div>
          
          {/* Total Population Highlight */}
          <div className="bg-primary p-10 rounded-[3rem] text-primary-foreground shadow-2xl shadow-primary/20 flex flex-col items-center lg:items-start min-w-[280px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <TrendingUp size={120} />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] opacity-80 relative z-10">Total Penduduk</span>
            <div className="flex items-baseline gap-2 relative z-10">
               <span className="text-6xl font-black tracking-tighter">{data.population.total.toLocaleString()}</span>
               <span className="text-lg font-bold opacity-60 uppercase">Jiwa</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" id="statistics">
          <StatCard
            label="Keluarga (KK)"
            value={data.population.households.toLocaleString()}
            unit="Rumah Tangga"
            icon={<Home size={32} />}
          />
          <StatCard
            label="Laki-laki"
            value={data.population.male.toLocaleString()}
            unit="Jiwa"
            icon={<Users className="text-blue-500" size={32} />}
          />
          <StatCard
            label="Perempuan"
            value={data.population.female.toLocaleString()}
            unit="Jiwa"
            icon={<Users className="text-pink-500" size={32} />}
          />
        </div>

        {/* Single Layer Chart Background - Optimized for Mobile */}
        <div className="glass-premium p-4 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-2xl">
           <Suspense fallback={<div className="h-[600px] flex items-center justify-center font-black text-primary animate-pulse tracking-widest uppercase italic">Menyiapkan Grafik Statistik...</div>}>
              <DemographicCharts data={data} />
           </Suspense>
        </div>

        {/* Informational Note */}
        <div className="mt-32 glass p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
             <Info size={32} />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Catatan Transparansi Data</h4>
            <p className="text-muted-foreground leading-relaxed font-medium italic">
              &quot;Data ini diperbarui secara berkala oleh Sekretariat Desa berdasarkan laporan kependudukan terbaru. Visualisasi ini bertujuan untuk memberikan informasi publik yang akurat demi mendukung pembangunan desa.&quot;
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
