import { getRawDemographics } from '@/services/data-service';
import { BarChart, Users, GraduationCap, Briefcase, MapPin, Heart, Baby, Layers } from 'lucide-react';
import Link from 'next/link';
import { Demographic } from '@/types';

export default async function AdminStatisticsPage() {
  const demographics = await getRawDemographics() as Demographic[];

  // Group demographics by category
  const groupedDemographics = demographics.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Lainnya';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, Demographic[]>);

  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('populasi')) return <Users size={20} className="text-blue-500" />;
    if (lowerName.includes('pendidikan')) return <GraduationCap size={20} className="text-purple-500" />;
    if (lowerName.includes('pekerjaan')) return <Briefcase size={20} className="text-amber-500" />;
    if (lowerName.includes('dusun')) return <MapPin size={20} className="text-emerald-500" />;
    if (lowerName.includes('perkawinan')) return <Heart size={20} className="text-rose-500" />;
    if (lowerName.includes('usia')) return <Baby size={20} className="text-indigo-500" />;
    return <Layers size={20} className="text-slate-500" />;
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Data Demografi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Kelola data statistik dan demografi penduduk desa.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/admin/residents" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-bold w-full sm:w-auto"
          >
            <Users size={18} />
            Data Master Penduduk
          </Link>
        </div>
      </div>

      {Object.keys(groupedDemographics).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center text-slate-500">
          <BarChart size={48} className="mx-auto mb-4 opacity-20" />
          Belum ada data demografi.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(groupedDemographics).map(([category, items]) => (
            <div key={category} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                {getCategoryIcon(category)}
                <h2 className="font-bold text-slate-800 dark:text-slate-200">{category}</h2>
                <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {items.length} Data
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Label</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {items.map((item: Demographic) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 text-right font-mono">
                          {item.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
