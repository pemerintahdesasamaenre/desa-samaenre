'use client';

import Link from 'next/link';
import { Search, MapPin, FileSpreadsheet, UserPlus } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

interface ResidentTableHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  dusun: string;
  onDusunChange: (val: string) => void;
  dusunOptions: { id: string; name: string }[];
  dusuns: string[];
}

export const ResidentTableHeader = ({
  search,
  onSearchChange,
  dusun,
  onDusunChange,
  dusunOptions,
  dusuns
}: ResidentTableHeaderProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm h-10 sm:h-12 text-xs sm:text-sm font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[100px] sm:flex-none sm:w-48">
            <CustomSelect 
              options={dusunOptions}
              value={dusun}
              onChange={onDusunChange}
              icon={MapPin}
              placeholder="Dusun"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/admin/statistics/import"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-card border border-border text-foreground px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all hover:bg-muted font-bold shadow-sm h-10 sm:h-12 text-[10px] sm:text-xs"
            >
              <FileSpreadsheet size={14} />
              <span>Import</span>
            </Link>

            <Link
              href="/admin/residents/new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-lg shadow-primary/20 font-black h-10 sm:h-12 uppercase text-[10px] tracking-widest"
            >
              <UserPlus size={14} />
              <span>Tambah</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Filter Dusun */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onDusunChange('SEMUA')}
          className={`px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            dusun === 'SEMUA' 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          Semua
        </button>
        {dusuns.map((d) => (
          <button
            key={d}
            onClick={() => onDusunChange(d)}
            className={`px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              dusun === d 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-card text-muted-foreground border border-border'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};
