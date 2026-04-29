'use client';

import Link from 'next/link';
import { Search, FileSpreadsheet, UserPlus } from 'lucide-react';

interface ResidentTableHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  dusun: string;
  onDusunChange: (val: string) => void;
  dusuns: string[];
}

export const ResidentTableHeader = ({
  search,
  onSearchChange,
  dusun,
  onDusunChange,
  dusuns
}: ResidentTableHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Search & Actions Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Cari NIK, KK, atau Nama Penduduk..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 h-12 sm:h-14 rounded-[1.25rem] border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-bold tracking-tight text-sm uppercase"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/statistics/import"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 h-12 sm:h-14 rounded-2xl transition-all hover:bg-muted font-bold shadow-sm uppercase text-[10px] tracking-widest"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span>Import</span>
          </Link>

          <Link
            href="/admin/residents/new"
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-foreground text-background px-8 h-12 sm:h-14 rounded-2xl transition-all hover:bg-primary hover:text-primary-foreground shadow-xl shadow-primary/10 font-bold uppercase text-[10px] tracking-widest active:scale-95"
          >
            <UserPlus size={16} />
            <span>Tambah</span>
          </Link>
        </div>
      </div>

      {/* Primary Navigation / Tab Filter Dusun */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => onDusunChange('SEMUA')}
          className={`px-8 h-11 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
            dusun === 'SEMUA' 
            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10' 
            : 'bg-card text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          Semua Wilayah
        </button>
        
        {/* Sort dusuns to ensure consistency */}
        {[...dusuns].sort().map((d) => (
          <button
            key={d}
            onClick={() => onDusunChange(d)}
            className={`px-8 h-11 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
              dusun === d 
              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10' 
              : 'bg-card text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};
