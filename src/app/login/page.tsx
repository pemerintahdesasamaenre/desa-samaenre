import { getVillageInfo } from '@/services/data-service';
import LoginForm from '@/components/modules/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const villageInfo = await getVillageInfo();

  // Fallback data if villageInfo is null
  const branding = {
    name: villageInfo?.name || 'Desa Samaenre',
    logo: villageInfo?.logo_url || null,
    banner: villageInfo?.header_banner_url || '/placeholder-bg.jpg'
  };

  return (
    <div className="dark">
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url(${branding.banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.3)',
            transform: 'scale(1.05)'
          }}
        />
        
        {/* Login Card - Using project variables for consistency */}
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-2xl bg-secondary/80 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="flex flex-col items-center mb-10">
              {branding.logo && (
                <Image 
                  src={branding.logo} 
                  alt="Logo Desa" 
                  width={80} 
                  height={80} 
                  className="mb-6 drop-shadow-xl"
                />
              )}
              <h1 className="text-2xl font-bold text-secondary-foreground text-center tracking-tight">
                {branding.name}
              </h1>
              <div className="h-1 w-12 bg-primary mt-3 rounded-full" />
              <p className="text-secondary-foreground/60 text-sm mt-4 font-medium uppercase tracking-widest">Admin Portal</p>
            </div>

            <LoginForm error={error} />

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <Link 
                href="/" 
                className="text-secondary-foreground/40 hover:text-secondary-foreground text-sm transition-colors inline-flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
