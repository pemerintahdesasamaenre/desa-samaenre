'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const Footer = () => {
  const pathname = usePathname();
  const [villageInfo, setVillageInfo] = useState<any>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('village_info').select('*').single();
      if (data) setVillageInfo(data);
    };
    fetchInfo();
  }, []);

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const contact = villageInfo?.contact_info || {};

  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex items-center justify-center">
                {villageInfo?.logo_url ? (
                  <Image 
                    src={villageInfo.logo_url} 
                    alt="Logo Desa" 
                    width={48} 
                    height={48} 
                    className="object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
                    {villageInfo?.name?.[0] || 'S'}
                  </div>
                )}
              </div>
              <h2 className="text-foreground-secondary text-2xl font-black tracking-tighter">Desa {villageInfo?.name || 'Samaenre'}</h2>
            </div>
            <p className="text-sm leading-relaxed opacity-70 font-medium">
              {villageInfo?.vision || 'Mewujudkan tata kelola desa yang transparan, inovatif, dan mandiri demi kesejahteraan seluruh masyarakat.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-black mb-8 uppercase tracking-[0.2em] text-[10px] opacity-50">Navigasi Utama</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/posts" className="hover:text-primary transition-colors">Kabar Desa</Link></li>
              <li><Link href="/statistik" className="hover:text-primary transition-colors">Statistik Desa</Link></li>
              <li><Link href="/tentang" className="hover:text-primary transition-colors">Profil Desa</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Galeri Desa</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-black mb-8 uppercase tracking-[0.2em] text-[10px] opacity-50">Kontak Resmi</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-primary">
                  <MapPin size={18} />
                </div>
                <span className="leading-snug">{contact.address || 'Alamat Kantor Desa'}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-primary">
                  <Phone size={18} />
                </div>
                <span>{contact.phone || 'N/A'}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-primary">
                  <Mail size={18} />
                </div>
                <span className="break-all">{contact.email || 'info@samaenre.desa.id'}</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Maps Link */}
          <div>
            <h3 className="font-black mb-8 uppercase tracking-[0.2em] text-[10px] opacity-50">Media Sosial</h3>
            <div className="flex gap-4 mb-8">
              {[Globe, MessageCircle].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all shadow-xl">
                  <Icon size={20} />
                </a>
              ))}
              {contact.maps_url && (
                <a href={contact.maps_url} target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all shadow-xl">
                  <Share2 size={20} />
                </a>
              )}
            </div>
            {contact.maps_url && (
              <a 
                href={contact.maps_url} 
                target="_blank"
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-primary bg-primary/10 px-5 py-2.5 rounded-xl hover:bg-primary/20 transition-all uppercase"
              >
                <MapPin size={14} />
                LIHAT PETA LOKASI
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <p>&copy; {new Date().getFullYear()} Pemerintah Desa {villageInfo?.name || ''}. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-primary transition-colors">Admin Login</Link>
            <span>Versi 2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
