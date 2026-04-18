import { getStaffMembers } from '@/actions/staff';
import { getVillageInfo } from '@/services/data-service';
import OrgChartTree from '@/components/modules/village/OrgChartTree';

export default async function TentangPage() {
  const staff = await getStaffMembers();
  const villageInfo = await getVillageInfo();

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-6 -translate-y-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <section className="text-center mb-24 space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
            Identitas Desa
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">
            Tentang <span className="text-primary">{villageInfo.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Mengenal lebih dekat sejarah, visi, misi, dan struktur organisasi pemerintahan Desa {villageInfo.name}.
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="glass p-12 rounded-[3rem] hover-lift space-y-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black">
              01
            </div>
            <h2 className="text-3xl font-black text-foreground">Visi</h2>
            <p className="text-muted-foreground italic text-xl leading-relaxed">
              "{villageInfo.vision}"
            </p>
          </div>
          <div className="glass p-12 rounded-[3rem] hover-lift space-y-6">
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-2xl font-black">
              02
            </div>
            <h2 className="text-3xl font-black text-foreground">Misi</h2>
            <ul className="space-y-4">
              {villageInfo.mission.map((item: string, index: number) => (
                <li key={index} className="flex gap-4 text-muted-foreground text-lg leading-snug">
                  <span className="text-primary font-black">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* History */}
        {villageInfo.history && (
          <section className="mb-32">
            <div className="glass p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-4xl font-black text-foreground mb-12 text-center text-gradient">Sejarah Singkat</h2>
               <div className="prose prose-xl prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed font-light">
                 {villageInfo.history.split('\n').map((para: string, i: number) => (
                   <p key={i} className="mb-8">{para}</p>
                 ))}
               </div>
            </div>
          </section>
        )}

        {/* Organizational Chart */}
        <section id="staff" className="scroll-mt-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-foreground tracking-tight">Struktur Pemerintahan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Susunan organisasi Pemerintah Desa {villageInfo.name} yang bertugas melayani masyarakat dengan integritas dan dedikasi.
            </p>
          </div>
          
          <div className="glass p-8 md:p-16 rounded-[4rem] shadow-2xl border-white/10">
            <OrgChartTree staff={staff} />
          </div>
        </section>
      </div>
    </main>
  );
}
