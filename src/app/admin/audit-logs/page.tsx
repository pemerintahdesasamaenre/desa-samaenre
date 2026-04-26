import { AuditLogTable } from '@/components/modules/audit/AuditLogTable';
import { ShieldCheck } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      {/* Header Section */}
      <div className="bg-card p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
             <ShieldCheck size={14} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter uppercase">Audit Trails</h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1 font-medium max-w-2xl">
            Rekaman aktivitas administratif penduduk Desa Samaenre. Data dibatasi untuk <span className="text-primary font-bold">2 bulan terakhir</span> guna efisiensi sistem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <AuditLogTable />
    </div>
  );
}
