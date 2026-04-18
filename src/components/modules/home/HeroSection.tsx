// src/components/modules/home/HeroSection.tsx
import Link from 'next/link';

interface HeroSectionProps {
  villageName: string;
}

export default function HeroSection({ villageName }: HeroSectionProps) {
  return (
    <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-slate-800">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      {/* Placeholder for background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/placeholder-bg.jpg')" }}></div>
      
      <div className="relative z-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Selamat Datang di {villageName}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200">
          Situs resmi untuk informasi, transparansi, dan layanan publik Desa {villageName}.
        </p>
        <div className="mt-8">
          <Link href="/tentang" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg">
            Jelajahi Profil Desa
          </Link>
        </div>
      </div>
    </div>
  );
}
