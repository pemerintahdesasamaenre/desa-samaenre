'use client';

import Link from 'next/link';
import { Edit, Trash2, Loader2, Eye, EyeOff, ChevronDown, ChevronUp, User } from 'lucide-react';
import { ResidentDisplayData } from '@/actions/residents';

interface ResidentTableRowProps {
  item: ResidentDisplayData;
  isVisible: boolean;
  isExpanded: boolean;
  isDeleting: boolean;
  onToggleVisibility: () => void;
  onToggleExpand: () => void;
  onDelete: () => void;
  maskString: (str: string) => string;
}

export const ResidentTableRow = ({
  item,
  isVisible,
  isExpanded,
  isDeleting,
  onToggleVisibility,
  onToggleExpand,
  onDelete,
  maskString
}: ResidentTableRowProps) => {
  return (
    <>
      <tr 
        className="hover:bg-primary/5 transition-colors group border-b border-border last:border-0 cursor-pointer md:cursor-default"
        onClick={() => { if (window.innerWidth < 768) onToggleExpand(); }}
      >
        {/* Kolom 1: Toggle (Mobile Only) */}
        <td className="md:hidden w-10 px-3 py-4 text-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>

        {/* Kolom 2: Nama & Info Singkat */}
        <td className="px-4 sm:px-6 py-4">
          <div className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight">
            {item.name}
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">
            {item.gender} • {item.occupation}
          </div>
        </td>

        {/* Kolom Desktop Only */}
        <td className="hidden md:table-cell px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-foreground/80 tracking-widest">
                {isVisible ? item.nik : maskString(item.nik)}
              </div>
              <div className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                KK: {isVisible ? item.kk : maskString(item.kk)}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </td>
        <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
          <div className="text-sm font-bold text-foreground/80 tracking-tight">
            {item.dusun}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">
            RT {item.rt} / RW {item.rw}
          </div>
        </td>

        {/* Action Column (Desktop Only) */}
        <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link
              href={`/admin/residents/edit/${item.id}`}
              className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all"
            >
              <Edit size={14} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              disabled={isDeleting}
              className="p-2 text-muted-foreground hover:text-destructive bg-muted/50 rounded-lg transition-all"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
          <td colSpan={5} className="px-4 sm:px-6 py-6 border-l-4 border-primary">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Identitas Mobile */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-primary" />
                    <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Identitas Resmi</p>
                  </div>
                  <div className="bg-background p-3 rounded-xl border border-border space-y-3">
                    <div>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">NIK</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs font-mono font-bold text-foreground">
                          {isVisible ? item.nik : maskString(item.nik)}
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="text-[9px] font-bold uppercase text-primary">
                          {isVisible ? 'Sembunyi' : 'Lihat'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Domisili</p>
                      <p className="text-xs font-bold text-foreground uppercase mt-0.5">
                        {item.dusun} • RT {item.rt}/{item.rw}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Manajemen Penduduk</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/admin/residents/edit/${item.id}`} 
                    className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
                  >
                    <Edit size={14} className="text-primary" />
                    Edit Data
                  </Link>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="flex items-center justify-center gap-2 bg-destructive/5 border border-destructive/10 text-destructive py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
