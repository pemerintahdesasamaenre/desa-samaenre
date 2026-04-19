// src/components/modules/home/VillageApparatus.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Staff {
  name: string;
  position: string;
  photo_url: string | null;
}

interface VillageApparatusProps {
  staff: Staff[];
}

export default function VillageApparatus({ staff }: VillageApparatusProps) {
  return (
    <section id="staff" className="py-32 bg-background scroll-mt-32 relative overflow-hidden">
      {/* Decorative background accent using primary tosca */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="space-y-6 mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
            Aparatur <br/> <span className="text-gradient">Struktur Desa</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Pelayanan profesional dengan integritas tinggi untuk seluruh lapisan masyarakat Desa Samaenre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {staff.map((member) => (
            <div 
              key={member.name} 
              className="glass-premium p-10 rounded-[3.5rem] hover-lift transition-all duration-700 group relative shadow-2xl shadow-primary/5"
            >
              <div className="relative w-48 h-48 mx-auto rounded-[2.5rem] overflow-hidden bg-card shadow-2xl border-4 border-primary/20 group-hover:border-primary/50 group-hover:scale-105 group-hover:rotate-2 transition-all duration-700">
                {member.photo_url ? (
                  <Image 
                    src={member.photo_url} 
                    alt={member.name} 
                    fill
                    sizes="192px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-white/5 dark:to-white/10">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>
              <div className="mt-8 space-y-2 text-center">
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] bg-primary/10 dark:bg-primary/20 py-2 px-4 rounded-full inline-block">
                  {member.position}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <Link 
            href="/tentang" 
            className="inline-flex items-center gap-4 px-12 py-5 bg-secondary text-secondary-foreground rounded-2xl font-black text-lg hover-lift hover:bg-primary transition-all duration-500 shadow-xl shadow-secondary/20"
          >
            Lihat Struktur Lengkap
          </Link>
        </div>
      </div>
    </section>
  );
}
