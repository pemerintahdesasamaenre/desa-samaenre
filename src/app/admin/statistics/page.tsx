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
    if (lowerName.includes('populasi')) return <Users size={20} className="text-primary" />;
    if (lowerName.includes('pendidikan')) return <GraduationCap size={20} className="text-purple-500" />;
    if (lowerName.includes('pekerjaan')) return <Briefcase size={20} className="text-amber-500" />;
    if (lowerName.includes('dusun')) return <MapPin size={20} className="text-emerald-500" />;
    if (lowerName.includes('perkawinan')) return <Heart size={20} className="text-rose-500" />;
    if (lowerName.includes('usia')) return <Baby size={20} className="text-indigo-500" />;
    return <Layers size={20} className="text-muted-foreground" />;
  };

  return (
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Data Demografi</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Data ini diperbarui secara otomatis dari basis data kependudukan desa.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/admin/residents" 
            className="flex items-center justify-center gap-3 bg-primary hover:opacity-90 text-primary-foreground px-8 py-4 rounded-full transition-all shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest w-full sm:w-auto active:scale-95"
          >
            <Users size={18} />
            Data Master Penduduk
          </Link>
        </div>
      </div>

      {Object.keys(groupedDemographics).length === 0 ? (
        <div className="bg-card rounded-[3rem] border border-border shadow-sm p-24 text-center">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart size={40} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada data demografi tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedDemographics).map(([category, items]) => (
            <div key={category} className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden flex flex-col">
              <div className="px-10 py-8 bg-muted/30 border-b border-border flex items-center gap-4">
                <div className="p-3 bg-background rounded-2xl border border-border shadow-sm">
                  {getCategoryIcon(category)}
                </div>
                <h2 className="font-black text-xl text-foreground tracking-tight uppercase">{category}</h2>
                <span className="ml-auto text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  {items.length} Kelompok
                </span>
              </div>
              
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/10">
                      <th className="px-10 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Label Data</th>
                      <th className="px-10 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Jumlah (Jiwa)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item: Demographic) => (
                      <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-10 py-5 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </td>
                        <td className="px-10 py-5 text-lg text-foreground font-black text-right tracking-tighter">
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
