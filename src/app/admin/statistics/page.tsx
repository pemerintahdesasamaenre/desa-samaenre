import { getRawDemographics } from '@/services/data-service';
import { BarChart, Users, GraduationCap, Briefcase, MapPin, Heart, Baby, Layers } from 'lucide-react';
import Link from 'next/link';
import { Demographic } from '@/types';

export default async function AdminStatisticsPage() {
  const demographics = await getRawDemographics() as Demographic[];

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
    if (lowerName.includes('populasi')) return <Users size={18} className="text-primary" />;
    if (lowerName.includes('pendidikan')) return <GraduationCap size={18} className="text-purple-500" />;
    if (lowerName.includes('pekerjaan')) return <Briefcase size={18} className="text-amber-500" />;
    if (lowerName.includes('dusun')) return <MapPin size={18} className="text-emerald-500" />;
    if (lowerName.includes('perkawinan')) return <Heart size={18} className="text-rose-500" />;
    if (lowerName.includes('usia')) return <Baby size={18} className="text-indigo-500" />;
    return <Layers size={18} className="text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter uppercase">Statistik Desa</h1>
          <p className="text-[10px] sm:text-base text-muted-foreground mt-1 font-medium italic">Update otomatis dari basis data kependudukan.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/admin/residents" 
            className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-full transition-all shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest w-full sm:w-auto active:scale-95"
          >
            <Users size={16} />
            Data Penduduk
          </Link>
        </div>
      </div>

      {Object.keys(groupedDemographics).length === 0 ? (
        <div className="bg-card rounded-2xl sm:rounded-[3rem] border border-border shadow-sm p-12 sm:p-24 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Data tidak tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {Object.entries(groupedDemographics).map(([category, items]) => (
            <div key={category} className="bg-card rounded-2xl sm:rounded-[3rem] border border-border shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 sm:px-10 sm:py-8 bg-muted/30 border-b border-border flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-background rounded-xl sm:rounded-2xl border border-border shadow-sm shrink-0">
                  {getCategoryIcon(category)}
                </div>
                <h2 className="font-black text-sm sm:text-xl text-foreground tracking-tight uppercase truncate">{category}</h2>
                <span className="ml-auto text-[8px] sm:text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest shrink-0">
                  {items.length} Data
                </span>
              </div>
              
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="border-b border-border bg-muted/10">
                      <th className="px-5 py-3 sm:px-10 sm:py-4 text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Label</th>
                      <th className="px-5 py-3 sm:px-10 sm:py-4 text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs sm:text-base">
                    {items.map((item: Demographic) => (
                      <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-5 py-3 sm:px-10 sm:py-5 font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.label}
                        </td>
                        <td className="px-5 py-3 sm:px-10 sm:py-5 text-sm sm:text-lg text-foreground font-black text-right tracking-tighter tabular-nums">
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
