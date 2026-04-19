import { Suspense } from 'react';
import { Users, Home, MapPin } from 'lucide-react';
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
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-6 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-full h-96 bg-secondary/5 -skew-y-6 translate-y-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 mb-16 text-center md:text-left animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-black uppercase tracking-widest">
            Data Terkini Desa
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-none">
            Statistik <span className="text-gradient">Kependudukan</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-4 font-medium max-w-3xl leading-relaxed">
            Gambaran komprehensif mengenai demografi, pekerjaan, dan distribusi wilayah di desa kami untuk mendukung perencanaan pembangunan yang tepat sasaran.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20" id="statistics">
          <StatCard
            label="Total Penduduk"
            value={data.population.total.toLocaleString()}
            unit="Jiwa"
            icon={<Users />}
          />
          <StatCard
            label="Jumlah Keluarga"
            value={data.population.households.toLocaleString()}
            unit="KK"
            icon={<Home />}
          />
          <StatCard
            label="Wilayah Dusun"
            value={data.hamlets.length}
            unit="Wilayah"
            icon={<MapPin />}
          />
        </div>

        {/* Premium Charts Section */}
        <div className="space-y-16">
          <div className="glass-premium p-8 md:p-12 rounded-[3.5rem] shadow-2xl">
             <Suspense fallback={<div className="h-[600px] flex items-center justify-center font-black text-primary animate-pulse tracking-widest">MEMUAT GRAFIK DEMOGRAFI...</div>}>
                <DemographicCharts data={data} />
             </Suspense>
          </div>
        </div>

        {/* Informational Note */}
        <div className="mt-20 glass-premium p-10 rounded-3xl border border-primary/20 bg-primary/5">
          <h4 className="text-lg font-black text-primary mb-2 uppercase tracking-tight">Catatan Transparansi Data</h4>
          <p className="text-sm text-foreground/70 leading-relaxed font-medium italic">
            &quot;Data yang disajikan di halaman ini merupakan agregasi data terbaru yang dikelola oleh pemerintah desa. Kami berkomitmen untuk menyajikan informasi yang akurat dan transparan bagi seluruh warga dan pihak berkepentingan.&quot;
          </p>
        </div>
      </div>
    </main>
  );
}
