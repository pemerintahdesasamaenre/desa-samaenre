import { getHomepageData } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Bell, Users, Wallet, FileText, ShieldCheck, Clock } from 'lucide-react';
import { getAuditLogs } from '@/actions/analytics';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [data, auditLogs] = await Promise.all([
    getHomepageData(),
    getAuditLogs(1, 5)
  ]);

  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      {/* Welcome Header */}
      <div className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter">Halo, Admin Desa!</h1>
          <p className="text-[10px] sm:text-base text-muted-foreground mt-1 font-medium">Selamat datang di sistem manajemen dashboard {data.villageName}.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="p-2 sm:p-3 bg-muted rounded-xl sm:rounded-2xl border border-border flex items-center justify-center text-primary">
              <Activity size={18} className="sm:w-6 sm:h-6" />
           </div>
           <div className="p-2 sm:p-3 bg-muted rounded-xl sm:rounded-2xl border border-border flex items-center justify-center text-muted-foreground">
              <Bell size={18} className="sm:w-6 sm:h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          label="Total Penduduk" 
          value={data.population} 
          icon={<Users size={24} />} 
          unit="Jiwa"
        />
        <StatCard 
          label="Anggaran Desa" 
          value={data.budget} 
          icon={<Wallet size={24} />} 
          prefix="Rp"
        />
        <StatCard 
          label="Berita & Agenda" 
          value={data.posts.length} 
          icon={<FileText size={24} />} 
        />
        <StatCard 
          label="Aparatur Desa" 
          value={data.staffCount} 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Recent Activity / Audit Log ACTUAL */}
        <div className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-border shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-border">
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight uppercase">Audit Aktivitas</h2>
            <Link href="/admin/audit-logs" className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ShieldCheck size={18} className="text-primary" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {auditLogs.data.length > 0 ? auditLogs.data.map((log) => (
              <div key={log.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                  log.method === 'DELETE' ? 'bg-red-500/10 text-red-600' : 
                  log.method === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600' :
                  'bg-primary/10 text-primary'
                }`}>
                  <Activity size={14} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{log.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{log.user_email || 'System'}</p>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-muted-foreground italic">
                       <Clock size={10} />
                       {new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
                 <ShieldCheck size={48} className="mb-2" />
                 <p className="text-xs font-black uppercase tracking-widest">Belum ada aktivitas</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
             <Link href="/admin/audit-logs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
                Lihat Seluruh Audit Trail &rarr;
             </Link>
          </div>
        </div>

        {/* System Health / Status */}
        <div className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-border">
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight uppercase">Status Sistem</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status Web</p>
              <p className="text-sm sm:text-base font-bold text-foreground">Online & Sinkron</p>
            </div>
            <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Peringatan</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed italic">
                &quot;Data Visi & Misi belum lengkap di pengaturan. Segera lengkapi untuk profil website.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
