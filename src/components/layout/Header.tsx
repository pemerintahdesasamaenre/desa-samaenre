'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Landmark } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Jangan tampilkan header di halaman admin atau login
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Statistik', href: '#statistics' },
    { name: 'Aparatur', href: '#staff' },
    { name: 'Transparansi', href: '/transparansi' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Landmark size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 leading-none">DesaDigital</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Profil Resmi</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              Portal Admin
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-700 p-2 hover:bg-gray-50 rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login"
            className="block bg-blue-600 text-white text-center py-3 rounded-xl font-bold"
          >
            Portal Admin
          </Link>
        </div>
      )}
    </header>
  );
};
