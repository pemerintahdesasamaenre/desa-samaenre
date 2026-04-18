import { getDemographics, getVillageInfo } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { DemographicCharts } from '@/components/modules/statistics/DemographicCharts';

export default async function Home() {
  const demographics = await getDemographics();
  const villageInfo = await getVillageInfo();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Profil {villageInfo.name}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 italic font-medium max-w-3xl mx-auto">
            "{villageInfo.vision}"
          </p>
        </section>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard label="Total Penduduk" value={demographics.population.total.toLocaleString()} unit="Jiwa" />
          <StatCard label="Kepala Keluarga" value={demographics.population.households.toLocaleString()} unit="KK" />
          <StatCard label="Laki-laki" value={demographics.population.male.toLocaleString()} unit="Jiwa" />
          <StatCard label="Perempuan" value={demographics.population.female.toLocaleString()} unit="Jiwa" />
        </section>

        {/* Demographics Section */}
        <section>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demografi Penduduk</h2>
            <p className="text-gray-600 max-w-2xl">
              Informasi lengkap mengenai karakteristik demografi penduduk wilayah {villageInfo.name} yang menggambarkan komposisi populasi secara rinci.
            </p>
          </div>
          <DemographicCharts data={demographics} />
        </section>
      </div>
    </main>
  );
}
