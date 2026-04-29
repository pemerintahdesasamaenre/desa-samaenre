// src/app/page.tsx
import { getHomepageData } from '@/services/data-service';
import HeroSection from '@/components/modules/home/HeroSection';
import StatGrid from '@/components/modules/home/StatGrid';
import LatestPosts from '@/components/modules/home/LatestPosts';
import VillageApparatus from '@/components/modules/home/VillageApparatus';
import type { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://profil-desa.id';

  return {
    title: `Portal Resmi Desa ${data.villageName}`,
    description: `Selamat datang di website resmi Desa ${data.villageName}. Temukan informasi publik, statistik penduduk, transparansi anggaran, dan berita terbaru kami.`,
    openGraph: {
      title: `Desa ${data.villageName} | Portal Informasi Terintegrasi`,
      description: `Menuju desa digital yang mandiri dan inovatif bersama masyarakat Desa ${data.villageName}.`,
      url: appUrl,
      siteName: `Desa ${data.villageName}`,
      images: data.bannerUrl ? [{ url: data.bannerUrl, width: 1200, height: 630 }] : ['/og-image.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Desa ${data.villageName}`,
      description: `Portal informasi dan pelayanan masyarakat Desa ${data.villageName}.`,
      images: data.bannerUrl ? [data.bannerUrl] : ['/og-image.png'],
    }
  };
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main className="space-y-0 text-foreground bg-background">
      <HeroSection villageName={data.villageName} bannerUrl={data.bannerUrl} />
      
      {/* Dynamic Summary Section */}
      <section className="pb-40 bg-background relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center pt-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight uppercase italic">
                Membangun Masa Depan <br/>
                <span className="text-primary tracking-tighter">Bersama Masyarakat</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {data.villageName} adalah wilayah yang terus bertransformasi menjadi pusat inovasi ekonomi lokal dan pelestarian budaya. Kami percaya bahwa transparansi dan pelayanan publik yang prima adalah kunci utama kemajuan desa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary tracking-tighter uppercase italic">24/7</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l-2 border-primary/20 pl-3">Layanan Informasi<br/>Publik Online</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-emerald-600 tracking-tighter uppercase italic">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l-2 border-emerald-600/20 pl-3">Transparansi<br/>Anggaran Desa</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square">
            <div className="absolute inset-4 rounded-[3.5rem] border-2 border-primary/10 -rotate-3"></div>
            <div className="absolute inset-4 rounded-[3.5rem] border-2 border-secondary/10 rotate-6"></div>
            <div className="absolute inset-0 bg-muted/30 rounded-[3.5rem] shadow-2xl overflow-hidden glass-premium flex items-center justify-center p-12 group">
              {data.logoUrl ? (
                <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                  <Image 
                    src={data.logoUrl} 
                    alt={`Logo Desa ${data.villageName}`}
                    fill
                    sizes="(max-width: 768px) 150px, 300px"
                    className="object-contain drop-shadow-2xl"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 flex items-center justify-center">
                   <span className="text-primary/20 font-bold text-4xl rotate-12 tracking-widest uppercase">LOGO DESA</span>
                </div>
              )}
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
