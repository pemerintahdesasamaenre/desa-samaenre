'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [villageName, setVillageName] = useState('Desa Kami');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const pathname = usePathname();

  useEffect(() => {
    const fetchInfo = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('village_info').select('name, logo_url').single();
      if (data) {
        if (data.name) setVillageName(data.name);
        if (data.logo_url) setLogoUrl(data.logo_url);
      }
    };
    fetchInfo();
  }, []);

  // ... rest of the component

  // Jangan tampilkan header di halaman admin atau login
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Berita', href: '/posts' },
    { name: 'Statistik', href: '/statistik' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Galeri', href: '/gallery' },
    { name: 'Transparansi', href: '/transparansi' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl md:rounded-full px-6 py-3 flex justify-between items-center shadow-lg transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image 
                src={logoUrl} 
                alt="Logo Desa" 
                width={48} 
                height={48} 
                className="object-contain w-auto h-auto"
                decoding="async"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                {villageName}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Portal Resmi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-border mx-2" />
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg"
              >
                Masuk
              </Link>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-foreground hover:bg-primary/10 rounded-xl transition-colors"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-4 right-4 mt-2 transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="glass rounded-3xl p-6 space-y-3 shadow-2xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-foreground p-3 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login"
            className="block bg-primary text-primary-foreground text-center py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </header>
  );
};
