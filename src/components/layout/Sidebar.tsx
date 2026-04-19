'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Wallet,
  Network,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { logout } from '@/actions/auth';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Statistik', href: '/admin/statistics', icon: BarChart3 },
  { name: 'Konten Desa', href: '/admin/content', icon: FileText },
  { name: 'Berita & Agenda', href: '/admin/posts', icon: FileText },
  { name: 'Kategori Konten', href: '/admin/categories', icon: FolderOpen },
  { name: 'Transparansi', href: '/admin/finances', icon: Wallet },
  { name: 'Struktur Organisasi', href: '/admin/staff', icon: Network },
  { name: 'Manajemen User', href: '/admin/users', icon: Users },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-[55]
        transition-all duration-500 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <span className="font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">AdminDesa</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-900/20 hover:text-red-400 transition-all group text-left">
              <LogOut size={20} className="text-slate-400 group-hover:text-red-400" />
              <span className="font-medium">Keluar Sistem</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
