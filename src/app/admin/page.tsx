import { getHomepageData } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Bell, Users, Wallet, FileText, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { getAuditLogs } from '@/actions/analytics';
import { getIncompleteStats } from '@/actions/residents';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [data, auditLogs, incompleteStats] = await Promise.all([
    getHomepageData(),
    getAuditLogs(1, 5),
    getIncompleteStats()
  ]);

  const totalIncomplete = incompleteStats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Halo, Admin Desa!</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Selamat datang di sistem manajemen dashboard {data.villageName}.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl sm:rounded-2xl border border-border flex items-center justify-center text-primary">
            <Activity size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl sm:rounded-2xl border border-border flex items-center justify-center text-muted-foreground">
            <Bell size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Penduduk"
          value={data.population}
          icon={<Users size={20} />}
          unit="Jiwa"
        />
        <StatCard
          label="Anggaran Desa"
          value={data.budget}
          icon={<Wallet size={20} />}
          prefix="Rp"
        />
        <StatCard
          label="Berita & Agenda"
          value={data.posts.length}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Aparatur Desa"
          value={data.staffCount}
          icon={<Activity size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight uppercase">Audit Aktivitas</h2>
            <Link href="/admin/audit-logs" className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ShieldCheck size={18} className="text-primary" />
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            {auditLogs.data.length > 0 ? auditLogs.data.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${log.method === 'DELETE' ? 'bg-red-500/10 text-red-600' :
                  log.method === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                  <Activity size={14} className="sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{log.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{log.user_email || 'System'}</p>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground italic">
                      <Clock size={10} />
                      {new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
                <ShieldCheck size={40} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Belum ada aktivitas</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/admin/audit-logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:tracking-wider transition-all">
              Lihat Seluruh Audit Trail &rarr;
            </Link>
          </div>
        </div>

        {/* System Health / Status */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight uppercase">Status Sistem</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Status Web</p>
              <p className="text-sm sm:text-base font-bold text-foreground">Online & Sinkron</p>
            </div>
            <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Peringatan</p>
              {totalIncomplete > 0 ? (
                <Link href="/admin/residents/audit" className="group block">
                  <div className="flex items-start gap-2 text-amber-600 group-hover:text-amber-700 transition-colors">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p className="text-[10px] sm:text-xs font-bold leading-relaxed">
                      Terdapat {totalIncomplete} data penduduk yang belum lengkap. Segera lakukan audit data.
                    </p>
                  </div>
                </Link>
              ) : (
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed italic">
                  Semua data penduduk telah lengkap dan tervalidasi.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
