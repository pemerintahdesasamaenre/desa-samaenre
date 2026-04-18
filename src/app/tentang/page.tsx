import { getStaffMembers } from '@/actions/staff';
import { getVillageInfo } from '@/services/data-service';
import OrgChartTree from '@/components/modules/village/OrgChartTree';

export default async function TentangPage() {
  const staff = await getStaffMembers();
  const villageInfo = await getVillageInfo();

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Tentang Desa {villageInfo.name}</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Mengenal lebih dekat sejarah, visi, misi, dan struktur organisasi pemerintahan Desa {villageInfo.name}.
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">01</span>
              Visi
            </h2>
            <p className="text-slate-600 italic text-lg leading-relaxed">
              "{villageInfo.vision}"
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">02</span>
              Misi
            </h2>
            <ul className="space-y-3">
              {villageInfo.mission.map((item, index) => (
                <li key={index} className="flex gap-3 text-slate-600">
                  <span className="text-primary font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* History */}
        {villageInfo.history && (
          <section className="mb-20 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Sejarah Desa</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              {villageInfo.history.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Organizational Chart */}
        <section id="staff" className="scroll-mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Struktur Organisasi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Susunan organisasi Pemerintah Desa {villageInfo.name} yang bertugas melayani masyarakat dengan integritas dan dedikasi.
            </p>
          </div>
          
          <div className="bg-white p-4 md:p-10 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <OrgChartTree staff={staff} />
          </div>
        </section>
      </div>
    </main>
  );
}
