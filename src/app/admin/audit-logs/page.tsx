import { AuditLogTable } from '@/components/modules/audit/AuditLogTable';
import { ShieldCheck } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Header Section */}
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
               <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Audit Aktivitas</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Rekaman aktivitas administratif desa (2 bulan terakhir).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AuditLogTable />
    </div>
  );
}
