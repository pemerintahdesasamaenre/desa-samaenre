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
  ChevronDown,
  Wallet,
  Network,
  FolderOpen,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { logout } from '@/actions/auth';

const menuGroups = [
  {
    name: 'Utama',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    name: 'Publikasi',
    icon: FileText,
    items: [
      { name: 'Berita & Agenda', href: '/admin/posts', icon: FileText },
      { name: 'Kategori Konten', href: '/admin/categories', icon: FolderOpen },
      { name: 'Transparansi', href: '/admin/finances', icon: Wallet },
    ]
  },
  {
    name: 'Kependudukan',
    icon: Users,
    items: [
      { name: 'Data Penduduk', href: '/admin/residents', icon: Users },
      { name: 'Statistik', href: '/admin/statistics', icon: BarChart3 },
      { name: 'Struktur Organisasi', href: '/admin/staff', icon: Network },
    ]
  },
  {
    name: 'Sistem',
    icon: Settings,
    items: [
      { name: 'Konten Desa', href: '/admin/content', icon: FileText },
      { name: 'Manajemen User', href: '/admin/users', icon: Users },
      { name: 'Audit Trails', href: '/admin/audit-logs', icon: ShieldCheck },
      { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
    ]
  }
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // State for accordion groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialExpanded: Record<string, boolean> = { 'Utama': true };
    menuGroups.forEach(group => {
      if (group.items.some(item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin'))) {
        initialExpanded[group.name] = true;
      }
    });
    return initialExpanded;
  });

  // Derived state sync for pathname changes (React 18+ pattern for state sync)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    
    // Auto-expand group on navigation
    const nextExpanded = { ...expandedGroups };
    menuGroups.forEach(group => {
      if (group.items.some(item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin'))) {
        nextExpanded[group.name] = true;
      }
    });
    setExpandedGroups(nextExpanded);
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

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
            <span className="font-bold text-xl">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground tracking-tighter leading-none uppercase">AdminDesa</span>
            <span className="text-[11px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Management</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 mt-2 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => {
            const isExpanded = !!expandedGroups[group.name];
            const hasActiveChild = group.items.some(item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin'));
            
            // Single items (like Dashboard)
            if (group.items.length === 1 && group.name === 'Utama') {
              const item = group.items[0];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? 'text-primary-foreground' : 'text-primary/60 group-hover:text-primary'} />
                    <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            }

            return (
              <div key={group.name} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
                    isExpanded || hasActiveChild ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {group.icon && <group.icon size={18} className={hasActiveChild ? 'text-primary' : 'text-primary/40'} />}
                    <span className="font-extrabold text-[11px] uppercase tracking-[0.15em]">{group.name}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {isExpanded && (
                  <div className="pl-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            isActive 
                            ? 'text-primary font-bold bg-primary/5' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
                          <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border bg-muted/20">
          <form action={logout}>
            <button className="flex items-center gap-3 w-full p-3.5 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all group text-left">
              <LogOut size={20} className="text-muted-foreground group-hover:text-destructive" />
              <span className="font-bold text-sm uppercase tracking-widest">Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};