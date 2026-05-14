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

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${villageInfo?.header_banner_url || '/placeholder-bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.5)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            {villageInfo?.logo_url && (
              <Image 
                src={villageInfo.logo_url} 
                alt="Logo Desa" 
                width={80} 
                height={80} 
                className="mb-4 drop-shadow-md"
              />
            )}
            <h1 className="text-2xl font-bold text-white text-center">
              {villageInfo?.name || 'Desa Samaenre'}
            </h1>
            <p className="text-white/60 text-sm mt-1">Portal Administrasi Desa</p>
          </div>

          <LoginForm error={error} />

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-white/40 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
