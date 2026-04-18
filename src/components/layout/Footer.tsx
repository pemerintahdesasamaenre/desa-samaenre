'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

export const Footer = () => {
  const pathname = usePathname();

  // Jangan tampilkan footer di halaman admin atau login
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-white text-2xl font-bold mb-4">DesaDigital</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Mewujudkan tata kelola desa yang transparan, inovatif, dan mandiri demi kesejahteraan seluruh masyarakat.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navigasi</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#statistics" className="hover:text-white transition-colors">Statistik Desa</a></li>
              <li><a href="#staff" className="hover:text-white transition-colors">Aparatur Desa</a></li>
              <li><a href="#finance" className="hover:text-white transition-colors">Anggaran & Belanja</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Kontak Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-500" />
                <span>Jl. Desa Utama No. 01, Kec. Digital</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <span>info@desadigital.go.id</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-6">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-all">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 transition-all">
                <Share2 size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pemerintah Desa Digital. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
