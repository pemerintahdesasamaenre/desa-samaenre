import { getStaffMembers } from '@/actions/staff';
import { getVillageInfo } from '@/services/data-service';
import OrgChartTree from '@/components/modules/village/OrgChartTree';
import { MapPin, Mail, Phone, Map as MapIcon, Compass, Network } from 'lucide-react';
import { Timeline } from '@/components/ui/Timeline';
import ExpandableHistory from '@/components/modules/village/ExpandableHistory';
import { FormerLeader } from '@/types';

export default async function TentangPage() {
  const staff = await getStaffMembers();
  const villageInfo = await getVillageInfo();
  const contact = villageInfo?.contact_info || {};

  const formerLeaders = Array.isArray(villageInfo.former_leaders) 
    ? [...villageInfo.former_leaders].reverse() 
    : [];

  const timelineData = formerLeaders.map((leader: FormerLeader, idx: number) => ({
    title: leader.period,
    content: (
      <div key={`leader-${idx}`} className="space-y-4">
        <h4 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
          {leader.name}
        </h4>
        <p className="text-muted-foreground text-sm md:text-lg font-medium leading-relaxed max-w-2xl">
          Beliau menjabat dan mengabdi sebagai Kepala Desa pada periode tahun {leader.period}, memberikan kontribusi nyata bagi fondasi kemajuan desa yang kita nikmati saat ini.
        </p>
        <div className="flex items-center gap-3">
           <div className="h-px w-10 bg-primary/30" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Aparatur Berjasa</span>
        </div>
      </div>
    )
  }));

  const getMapsUrls = (url: string) => {
    const fallbackSearch = `https://www.google.com/maps/search/${encodeURIComponent(`${villageInfo.name} ${contact.address || ''}`)}`;
    if (!url) return { embed: `${fallbackSearch}&output=embed`, external: fallbackSearch };
    if (url.includes('/maps/embed') || url.includes('output=embed')) {
      return { embed: url, external: url.includes('/maps/embed') ? fallbackSearch : url };
    }
    return { embed: `${url}&output=embed`, external: url };
  };

  const { embed: embedUrl, external: externalUrl } = getMapsUrls(contact.maps_url);

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative text-foreground font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 skew-y-3 -translate-y-48"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <section className="text-center mb-24 space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest">
            Profil Resmi
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-foreground tracking-tighter leading-none">
            Tentang <span className="text-primary italic">{villageInfo.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Mengenal lebih dekat sejarah, visi, misi, dan geografis Desa {villageInfo.name}.
          </p>
        </section>

        <section className="grid lg:grid-cols-3 gap-8 mb-32">
           <div className="lg:col-span-1 bg-emerald-600 p-12 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-emerald-600/20 relative overflow-hidden group border-none">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <MapIcon size={240} />
              </div>
              <MapIcon size={40} className="opacity-50 relative z-10" />
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-80 mb-2">Luas Wilayah</h3>
                <p className="text-5xl font-black tracking-tighter">{villageInfo.area_size || 'N/A'}</p>
              </div>
              <p className="text-emerald-50/70 font-medium leading-relaxed relative z-10">
                Total cakupan wilayah administratif Desa {villageInfo.name} yang terdiri dari beberapa dusun dan area produktif.
              </p>
           </div>

           <div className="lg:col-span-2 glass p-12 rounded-[3.5rem] relative overflow-hidden group border border-border/50">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                 <Compass size={200} />
              </div>
              <h3 className="text-xl font-black mb-10 flex items-center gap-3 uppercase tracking-tighter">
                 <Compass className="text-primary" />
                 Batas-batas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
                 {[
                   { label: 'Utara', value: villageInfo.boundaries?.north, icon: 'N' },
                   { label: 'Selatan', value: villageInfo.boundaries?.south, icon: 'S' },
                   { label: 'Timur', value: villageInfo.boundaries?.east, icon: 'E' },
                   { label: 'Barat', value: villageInfo.boundaries?.west, icon: 'W' },
                 ].map((boundary) => (
                   <div key={boundary.label} className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center font-black text-primary shadow-inner">
                        {boundary.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{boundary.label}</p>
                        <p className="font-bold text-xl leading-tight">{boundary.value || '-'}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="glass p-12 rounded-[3rem] space-y-6 border border-border/50">
            <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight uppercase">
               <div className="w-2 h-8 bg-primary rounded-full"></div>
               Visi
            </h2>
            <p className="text-muted-foreground italic text-2xl leading-relaxed">
              &quot;{villageInfo.vision}&quot;
            </p>
          </div>
          <div className="glass p-12 rounded-[3rem] space-y-6 border border-border/50">
            <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight uppercase">
               <div className="w-2 h-8 bg-secondary rounded-full"></div>
               Misi
            </h2>
            <ul className="space-y-5">
              {(villageInfo.mission || []).map((item: string, index: number) => (
                <li key={index} className="flex gap-4 text-muted-foreground text-lg leading-snug font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0 mt-1">
                    {index + 1}
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {villageInfo.history && (
          <ExpandableHistory content={villageInfo.history} />
        )}

        {/* Organizational Chart Section */}
        <section id="staff" className="scroll-mt-32 mb-32">
          <div className="text-center mb-16 space-y-6">
            <div className="p-4 bg-primary/10 text-primary rounded-3xl inline-block mx-auto mb-2">
              <Network size={40} className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-none uppercase">
              Struktur <br/><span className="text-primary italic border-b-4 border-primary/20">Pemerintahan</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Susunan organisasi Pemerintah Desa {villageInfo.name} yang saat ini aktif bertugas melayani masyarakat.
            </p>
          </div>
          
          <OrgChartTree staff={staff} />
        </section>

        {/* Former Leaders Timeline Section */}
        {timelineData.length > 0 && (
          <section className="mb-32 scroll-mt-32">
            <div className="glass-premium rounded-[4rem] border border-border/50 overflow-hidden bg-card/30">
               <Timeline data={timelineData} />
            </div>
          </section>
        )}

        <section className="scroll-mt-32">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 glass p-10 rounded-[3.5rem] space-y-10 border border-border/50">
              <h2 className="text-3xl font-black mb-4 leading-none uppercase tracking-tighter">Kontak <br/><span className="text-primary italic">Resmi Kami</span></h2>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Alamat</h4>
                    <p className="font-bold leading-relaxed">{contact.address || 'Alamat Kantor Desa'}</p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Telepon</h4>
                    <p className="font-bold leading-relaxed">{contact.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Email</h4>
                    <p className="font-bold leading-relaxed break-all">{contact.email || '-'}</p>
                  </div>
                </div>
              </div>
              
              <a 
                href={externalUrl} 
                target="_blank" 
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-[2rem] font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 uppercase tracking-widest text-xs"
              >
                <MapPin size={20} />
                Buka di Google Maps
              </a>
            </div>

            <div className="lg:col-span-2 glass rounded-[3.5rem] overflow-hidden min-h-[400px] sm:min-h-[500px] relative group border border-border/50">
              <iframe
                title="Lokasi Desa"
                src={embedUrl}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute top-8 right-8 px-5 py-2.5 bg-background/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-xl border border-border">
                Peta Wilayah Desa
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
