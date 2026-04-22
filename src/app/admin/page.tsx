import { getHomepageData } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Bell, Users, Wallet, FileText, BarChart3 } from 'lucide-react';

export default async function AdminDashboard() {
  const data = await getHomepageData();

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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          label="Total Penduduk" 
          value={data.population} 
          icon={Users} 
          trend="+12 jiwa bulan ini"
          color="emerald"
        />
        <StatCard 
          label="Anggaran Desa" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(data.budget)} 
          icon={Wallet} 
          trend="Realisasi 65%"
          color="blue"
        />
        <StatCard 
          label="Berita & Agenda" 
          value={data.posts.length} 
          icon={FileText} 
          trend="3 baru minggu ini"
          color="amber"
        />
        <StatCard 
          label="Aparatur Desa" 
          value={data.staffCount} 
          icon={Activity} 
          trend="Aktif bertugas"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Recent Activity / Audit Log Placeholder */}
        <div className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-border">
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight uppercase">Audit Aktivitas</h2>
            <BarChart3 size={18} className="text-primary" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Activity size={14} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">Perubahan data kependudukan</p>
                  <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5">Admin • 2 jam yang lalu</p>
                </div>
              </div>
            ))}
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
