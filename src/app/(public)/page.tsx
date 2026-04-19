// src/app/page.tsx
import { getHomepageData } from '@/services/data-service';
import HeroSection from '@/components/modules/home/HeroSection';
import StatGrid from '@/components/modules/home/StatGrid';
import LatestPosts from '@/components/modules/home/LatestPosts';
import VillageApparatus from '@/components/modules/home/VillageApparatus';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main className="space-y-0 text-foreground">
      <HeroSection villageName={data.villageName} />
      
      {/* Dynamic Summary Section */}
      <section className="pt-24 pb-40 bg-background relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Membangun Masa Depan <br/>
                <span className="text-primary italic">Bersama Masyarakat</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {data.villageName} adalah wilayah yang terus bertransformasi menjadi pusat inovasi ekonomi lokal dan pelestarian budaya. Kami percaya bahwa transparansi dan pelayanan publik yang prima adalah kunci utama kemajuan desa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-3xl font-black text-primary">24/7</p>
                <p className="text-sm border-l-2 border-primary/20 pl-3 text-muted-foreground font-medium">Layanan Informasi<br/>Publik Online</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-secondary">100%</p>
                <p className="text-sm border-l-2 border-secondary/20 pl-3 text-muted-foreground font-medium">Transparansi<br/>Anggaran Desa</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square">
            <div className="absolute inset-4 rounded-[3rem] border-2 border-primary/10 -rotate-3"></div>
            <div className="absolute inset-4 rounded-[3rem] border-2 border-secondary/10 rotate-6"></div>
            <div className="absolute inset-0 bg-muted rounded-[3rem] shadow-2xl overflow-hidden glass">
              {/* Optional Village image could go here */}
              <div className="w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 flex items-center justify-center">
                 <span className="text-muted-foreground/20 font-black text-4xl rotate-12">DESA DIGITAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatGrid 
        population={data.population}
        budget={data.budget}
        hamletCount={data.hamletCount}
        staffCount={data.staffCount}
      />
      
      <LatestPosts posts={data.posts} />
      
      <VillageApparatus staff={data.staff} />
    </main>
  );
}
