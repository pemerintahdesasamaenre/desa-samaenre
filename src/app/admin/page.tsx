import { getDemographics } from '@/services/data-service';
import { StatCard } from '@/components/ui/StatCard';
import { User, Activity, FileText, Bell } from 'lucide-react';

export default async function AdminDashboard() {
  const demographics = await getDemographics();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Utama</h1>
        <p className="text-slate-500 mt-2">Selamat datang di Panel Manajemen Desa. Pantau dan kelola data desa Anda dari sini.</p>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Penduduk" value={demographics.population.total.toLocaleString()} unit="Jiwa" />
        <StatCard label="Laki-laki" value={demographics.population.male.toLocaleString()} unit="Jiwa" />
        <StatCard label="Perempuan" value={demographics.population.female.toLocaleString()} unit="Jiwa" />
        <StatCard label="Dusun Terdaftar" value={demographics.hamlets.length} unit="Wilayah" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Aktivitas Terakhir
            </h3>
            <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          
          <div className="space-y-4">
            {[
              { text: "Update data demografi Dusun Maddenge", time: "2 jam yang lalu", icon: BarChart },
              { text: "Menambahkan berita 'Kegiatan Posyandu Melati'", time: "Kemarin, 14:00", icon: FileText },
              { text: "Admin baru telah ditambahkan (admin@desa.go.id)", time: "2 hari yang lalu", icon: User }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-slate-700 font-medium">{item.text}</p>
                  <p className="text-slate-400 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Bell size={20} className="text-orange-500" />
            Notifikasi Sistem
          </h3>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <p className="text-orange-800 text-sm font-medium">Lengkapi Data Desa!</p>
            <p className="text-orange-700 text-xs mt-1">Data Visi & Misi belum lengkap di pengaturan. Segera lengkapi untuk profil website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to avoid build error for missing icons in map
const BarChart = () => <Activity size={18} />;
