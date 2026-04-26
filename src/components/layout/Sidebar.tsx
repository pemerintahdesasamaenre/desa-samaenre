'use client';

import { useState } from 'react';
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
  X,
  ShieldCheck
} from 'lucide-react';
import { logout } from '@/actions/auth';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Statistik', href: '/admin/statistics', icon: BarChart3 },
  { name: 'Data Penduduk', href: '/admin/residents', icon: Users },
  { name: 'Audit Trails', href: '/admin/audit-logs', icon: ShieldCheck },
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

  // Close sidebar on route change (mobile) - using a local ref to track previous pathname
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setIsOpen(false);
    setPrevPathname(pathname);
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg border border-primary/20"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-card text-foreground flex flex-col z-[55]
        transition-all duration-500 ease-in-out lg:translate-x-0 border-r border-border
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-black text-xl">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-foreground tracking-tighter leading-none">AdminDesa</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Control Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 font-black' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-primary-foreground' : 'text-primary/60 group-hover:text-primary'} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <form action={logout}>
            <button className="flex items-center gap-3 w-full p-3.5 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all group text-left">
              <LogOut size={20} className="text-muted-foreground group-hover:text-destructive" />
              <span className="font-bold text-sm tracking-tight">Keluar Sistem</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
