import ResidentTable from '@/components/modules/residents/ResidentTable';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ResetDataButton from '@/components/modules/statistics/ResetDataButton';
import Link from 'next/link';
import { getIncompleteStats } from '@/actions/residents';

export default async function AdminResidentsPage() {
  const stats = await getIncompleteStats();
  const totalIncomplete = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Master Data Penduduk</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola data individual penduduk desa, audit log, dan filter wilayah.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <Link 
            href="/admin/residents/audit"
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-bold text-xs uppercase tracking-widest transition-all shrink-0 relative overflow-hidden group ${
              totalIncomplete > 0 
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {totalIncomplete > 0 ? (
              <>
                <AlertTriangle size={16} className="animate-pulse" />
                <span>Audit Data</span>
                <span className="flex items-center justify-center bg-amber-500 text-white text-[10px] h-5 px-2 rounded-full font-black ml-1">
                  {totalIncomplete}
                </span>
                <div className="absolute inset-0 bg-amber-500/5 animate-ping pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" style={{ animationDuration: '3s' }} />
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Data Lengkap</span>
              </>
            )}
          </Link>
          <div className="shrink-0">
            <ResetDataButton />
          </div>
        </div>
      </div>

      <ResidentTable />
    </div>
  );
}
