// src/components/modules/home/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  villageName: string;
  bannerUrl?: string | null;
}

export default function HeroSection({ villageName, bannerUrl }: HeroSectionProps) {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {bannerUrl ? (
          <>
            <Image 
              src={bannerUrl} 
              alt={`Banner ${villageName}`}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover"
              priority
              quality={60}
              fetchPriority="high"
              decoding="async"
            />
            {/* Settingan Timpa Gambar Lama: Overlay Gelap Tunggal yang Kuat */}
            <div className="absolute inset-0 bg-black/60"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
          </>
        )}
        
        {!bannerUrl && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        )}
      </div>
      
      <div className="relative z-20 max-w-6xl mx-auto px-4 text-center space-y-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-premium border border-border text-foreground text-sm font-bold tracking-widest uppercase animate-fade-in shadow-xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Selamat Datang di Portal Resmi
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-[0.85] animate-slide-up">
            Desa <br/>
            <span className="text-gradient drop-shadow-2xl">
              {villageName}
            </span>
          </h1>
        </div>
        
        <p className={`text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-500 drop-shadow-lg ${bannerUrl ? 'text-white/90' : 'text-foreground'}`}>
          Mewujudkan tata kelola desa yang <span className="text-primary font-bold border-b-2 border-primary/40 text-glow">transparan</span>, 
          <span className="text-primary font-bold border-b-2 border-primary/40 text-glow"> inovatif</span>, dan 
          <span className="text-primary font-bold border-b-2 border-primary/40 text-glow"> mandiri</span> demi kesejahteraan seluruh masyarakat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in animation-delay-700">
          <Link 
            href="/tentang" 
            className="w-full sm:w-auto px-12 py-5 bg-primary text-primary-foreground rounded-[2rem] font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            Jelajahi Profil
          </Link>
          <Link 
            href="/transparansi" 
            className="w-full sm:w-auto px-12 py-5 glass-premium text-white dark:text-foreground rounded-[2rem] font-bold text-lg hover:bg-white/10 transition-all border border-white/20 shadow-xl"
          >
            Lihat Anggaran
          </Link>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-80">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center p-2 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
}
