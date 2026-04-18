// src/components/modules/home/HeroSection.tsx
import Link from 'next/link';

interface HeroSectionProps {
  villageName: string;
}

export default function HeroSection({ villageName }: HeroSectionProps) {
  return (
    <div className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>
      
      <div className="relative z-20 max-w-6xl mx-auto px-4 text-center space-y-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white text-sm font-bold tracking-widest uppercase animate-fade-in shadow-2xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Selamat Datang di Portal Resmi
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] animate-slide-up">
            Desa <br/>
            <span className="text-gradient">
              {villageName}
            </span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in animation-delay-500">
          Mewujudkan tata kelola desa yang <span className="text-white font-black border-b-2 border-primary/40">transparan</span>, 
          <span className="text-white font-black border-b-2 border-blue-400/40"> inovatif</span>, dan 
          <span className="text-white font-black border-b-2 border-secondary/40"> mandiri</span> demi kesejahteraan seluruh masyarakat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in animation-delay-700">
          <Link 
            href="/tentang" 
            className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg hover-lift shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all"
          >
            Jelajahi Profil
          </Link>
          <Link 
            href="/transparansi" 
            className="w-full sm:w-auto px-12 py-5 glass-premium text-white rounded-[2rem] font-black text-lg hover-lift border-white/20"
          >
            Lihat Anggaran
          </Link>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/20 flex justify-center p-2 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
}
