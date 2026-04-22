import { getDemographics } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Bell } from 'lucide-react';

export default async function AdminDashboard() {
  const demographics = await getDemographics();

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Dashboard Utama</h1>
        <p className="text-muted-foreground mt-2 font-medium">Selamat datang di Panel Manajemen Desa. Pantau dan kelola data desa Anda dari sini.</p>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Penduduk" value={demographics.population.total} unit="Jiwa" />
        <StatCard label="Laki-laki" value={demographics.population.male} unit="Jiwa" />
        <StatCard label="Perempuan" value={demographics.population.female} unit="Jiwa" />
        <StatCard label="Dusun Terdaftar" value={demographics.hamlets.length} unit="Wilayah" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Activity size={20} />
              </div>
              Aktivitas Terakhir
            </h3>
            <button className="text-sm font-bold text-primary hover:underline px-4 py-2 bg-primary/5 rounded-full transition-all">Lihat Semua</button>
          </div>
          
          <div className="p-6 space-y-2">
            {[
              { text: "Update data demografi Dusun Maddenge", time: "2 jam yang lalu" },
              { text: "Menambahkan berita 'Kegiatan Posyandu Melati'", time: "Kemarin, 14:00" },
              { text: "Admin baru telah ditambahkan (admin@desa.go.id)", time: "2 hari yang lalu" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-foreground font-bold tracking-tight">{item.text}</p>
                  <p className="text-muted-foreground text-xs font-medium mt-1 uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border bg-muted/30">
            <h3 className="text-xl font-black text-foreground flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                <Bell size={20} />
              </div>
              Notifikasi
            </h3>
          </div>
          <div className="p-8">
            <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl">
              <p className="text-orange-500 text-sm font-black uppercase tracking-widest">Lengkapi Data Desa!</p>
              <p className="text-foreground/70 text-sm mt-3 font-medium leading-relaxed italic">
                &quot;Data Visi & Misi belum lengkap di pengaturan. Segera lengkapi untuk profil website.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

