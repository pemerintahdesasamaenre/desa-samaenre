'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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

  // Jangan tampilkan footer di halaman admin atau login
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const contact = villageInfo?.contact_info || {};

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                {villageInfo?.name?.[0] || 'D'}
              </div>
              <h2 className="text-white text-2xl font-black tracking-tighter">Desa {villageInfo?.name || 'Digital'}</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-medium">
              {villageInfo?.vision || 'Mewujudkan tata kelola desa yang transparan, inovatif, dan mandiri demi kesejahteraan seluruh masyarakat.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Navigasi</h3>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link href="/" className="hover:text-blue-500 transition-colors">Beranda</Link></li>
              <li><Link href="/posts" className="hover:text-blue-500 transition-colors">Kabar Desa</Link></li>
              <li><Link href="/statistik" className="hover:text-blue-500 transition-colors">Statistik Desa</Link></li>
              <li><Link href="/tentang" className="hover:text-blue-500 transition-colors">Profil Desa</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-500 transition-colors">Galeri Desa</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Kontak Resmi</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <span className="leading-snug">{contact.address || 'Alamat Kantor Desa'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <span>{contact.phone || 'N/A'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <span className="break-all">{contact.email || 'info@desa.go.id'}</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Maps Link */}
          <div>
            <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Media Sosial</h3>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white hover:-translate-y-1 transition-all">
                <MessageCircle size={20} />
              </a>
              <a href={contact.maps_url} target="_blank" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:-translate-y-1 transition-all">
                <Share2 size={20} />
              </a>
            </div>
            {contact.maps_url && (
              <a 
                href={contact.maps_url} 
                target="_blank"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-xl hover:bg-blue-500/20 transition-all"
              >
                <MapPin size={14} />
                LIHAT PETA LOKASI
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Pemerintah Desa {villageInfo?.name || ''}. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-blue-500 transition-colors">Admin Login</Link>
            <span>Versi 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
