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
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
              Infografis Desa
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tighter leading-[0.85]">
              Data <br/> <span className="text-gradient">Demografi</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Analisis mendalam mengenai komposisi penduduk, tingkat pendidikan, dan persebaran wilayah Dusun di desa kami.
            </p>
          </div>
          
          {/* Total Population Highlight - Using StatCard for Consistency and Animation */}
          <div className="min-w-[320px]">
            <StatCard
              label="Total Penduduk"
              value={data.population.total}
              unit="Jiwa"
              icon={<TrendingUp size={32} />}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" id="statistics">
          <StatCard
            label="Keluarga (KK)"
            value={data.population.households}
            unit="Rumah Tangga"
            icon={<Home size={32} />}
          />
          <StatCard
            label="Laki-laki"
            value={data.population.male}
            unit="Jiwa"
            icon={<Users className="text-blue-500" size={32} />}
          />
          <StatCard
            label="Perempuan"
            value={data.population.female}
            unit="Jiwa"
            icon={<Users className="text-pink-500" size={32} />}
          />
        </div>

        {/* Simplified Chart Background - Optimized for Performance */}
        <div className="bg-card/50 border border-border/60 dark:border-white/10 p-4 md:p-16 rounded-2xl shadow-xl relative z-10">
           <Suspense fallback={<div className="h-[600px] flex items-center justify-center font-bold text-primary animate-pulse tracking-widest uppercase italic">Menyiapkan Grafik Statistik...</div>}>
              <DemographicCharts data={data} />
           </Suspense>
        </div>

        {/* Informational Note */}
        <div className="mt-32 glass p-12 rounded-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
             <Info size={32} />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">Catatan Transparansi Data</h4>
            <p className="text-muted-foreground leading-relaxed font-medium italic">
              &quot;Data ini diperbarui secara berkala oleh Sekretariat Desa berdasarkan laporan kependudukan terbaru. Visualisasi ini bertujuan untuk memberikan informasi publik yang akurat demi mendukung pembangunan desa.&quot;
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
