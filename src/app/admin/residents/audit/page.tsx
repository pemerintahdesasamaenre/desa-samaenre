import { getIncompleteStats } from '@/actions/residents';
import { AlertCircle, ChevronRight, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AuditSummaryPage() {
  const stats = await getIncompleteStats();
  const totalIncomplete = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/residents"
            className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Kelengkapan Data Penduduk</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Identifikasi data penduduk yang belum lengkap per wilayah.</p>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <AlertCircle className="text-primary" size={20} />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Belum Lengkap</p>
            <p className="text-xl font-black text-primary leading-none">{totalIncomplete}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.length > 0 ? (
          stats.map((item) => (
            <Link 
              key={item.dusun}
              href={`/admin/residents/audit/${encodeURIComponent(item.dusun)}`}
              className="group bg-card p-5 rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">{item.dusun}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{item.count}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Penduduk</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ChevronRight size={18} />
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
            <LayoutDashboard className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Semua data sudah lengkap!</p>
          </div>
        )}
      </div>
    </div>
  );
}
