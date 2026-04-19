import { getStaffMembers } from '@/actions/staff';
import { getVillageInfo } from '@/services/data-service';
import OrgChartTree from '@/components/modules/village/OrgChartTree';
import { MapPin, Mail, Phone } from 'lucide-react';

export default async function TentangPage() {
  const staff = await getStaffMembers();
  const villageInfo = await getVillageInfo();
  const contact = villageInfo?.contact_info || {};

  // Gunakan maps_url langsung dari DB (sebagai embed URL)
  // Jika tidak ada, fallback ke pencarian Google Maps standar
  const embedUrl = contact.maps_url || `https://maps.google.com/maps?q=${encodeURIComponent(`${villageInfo.name} ${contact.address || ''}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

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

        {/* Vision & Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="glass p-12 rounded-[3rem] hover-lift space-y-6 border border-white/20">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black">
              01
            </div>
            <h2 className="text-3xl font-black text-foreground">Visi</h2>
            <p className="text-muted-foreground italic text-xl leading-relaxed">
              &quot;{villageInfo.vision}&quot;
            </p>
          </div>
          <div className="glass p-12 rounded-[3rem] hover-lift space-y-6 border border-white/20">
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-2xl font-black">
              02
            </div>
            <h2 className="text-3xl font-black text-foreground">Misi</h2>
            <ul className="space-y-4">
              {villageInfo.mission.map((item: string, index: number) => (
                <li key={index} className="flex gap-4 text-muted-foreground text-lg leading-snug font-medium">
                  <span className="text-primary font-black">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* History Section */}
        {villageInfo.history && (
          <section className="mb-32">
            <div className="glass p-12 md:p-20 rounded-[4rem] relative overflow-hidden border border-white/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-4xl font-black text-foreground mb-12 text-center text-gradient uppercase tracking-tight">Sejarah Singkat</h2>
               <div className="prose prose-xl prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed font-light">
                 {villageInfo.history.split('\n').map((para: string, i: number) => (
                   <p key={i} className="mb-8">{para}</p>
                 ))}
               </div>
            </div>
          </section>
        )}

        {/* Organizational Chart Section */}
        <section id="staff" className="scroll-mt-32 mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-foreground tracking-tight">Struktur Pemerintahan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
              Susunan organisasi Pemerintah Desa {villageInfo.name} yang bertugas melayani masyarakat dengan integritas dan dedikasi.
            </p>
          </div>
          
          <div className="glass p-8 md:p-16 rounded-[4rem] shadow-2xl border border-white/20 overflow-x-auto">
            <OrgChartTree staff={staff} />
          </div>
        </section>

        {/* Contact & Map Section */}
        <section className="scroll-mt-32">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Details Card */}
            <div className="lg:col-span-1 glass p-10 rounded-[3rem] border border-white/20 space-y-8">
              <h2 className="text-3xl font-black text-foreground mb-4 leading-none">Kontak <br/><span className="text-primary">Kami</span></h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Alamat</h4>
                    <p className="text-muted-foreground font-medium">{contact.address || 'Alamat Kantor Desa'}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Telepon</h4>
                    <p className="text-muted-foreground font-medium">{contact.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Email</h4>
                    <p className="text-muted-foreground font-medium break-all">{contact.email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Display */}
            <div className="lg:col-span-2 glass rounded-[3rem] border border-white/20 overflow-hidden min-h-[400px] relative group">
              <iframe
                title="Lokasi Desa"
                src={embedUrl}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <div className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
                Peta Lokasi Desa
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
