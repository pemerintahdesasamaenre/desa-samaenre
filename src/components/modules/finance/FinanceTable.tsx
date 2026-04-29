'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import DeleteFinanceButton from '@/components/modules/finance/DeleteFinanceButton';
import { Finance } from '@/types';

interface FinanceTableProps {
  finances: Finance[];
}

export const FinanceTable = ({ finances }: FinanceTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {/* Kolom 1: Toggle (Mobile Only) */}
              <th className="md:hidden px-3 py-4 w-10"></th>
              
              {/* Kolom 2: Info Utama */}
              <th className="px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider">Kategori</th>
              
              {/* Kolom Desktop Only */}
              <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-20">Tahun</th>
              <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider w-32">Tipe</th>
              
              {/* Kolom Anggaran (Selalu Muncul) */}
              <th className="px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider text-right">Jumlah</th>
              
              {/* Kolom Aksi (Desktop Only) */}
              <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-wider text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {finances.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground font-medium italic text-sm">
                  Data anggaran kosong.
                </td>
              </tr>
            ) : (
              finances.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    className="hover:bg-primary/5 transition-colors group cursor-pointer md:cursor-default"
                    onClick={() => { if (window.innerWidth < 768) toggleRow(item.id); }}
                  >
                    <td className="md:hidden px-3 py-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleRow(item.id); }}
                        className="p-1 text-muted-foreground hover:text-primary"
                      >
                        {expandedRows.includes(item.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 overflow-hidden">
                      <div className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight line-clamp-1">{item.category_name}</div>
                      <div className="md:hidden text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        {item.year} • {item.type === 'income' ? 'IN' : 'OUT'}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 font-bold text-foreground/70 text-sm">{item.year}</td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 
                        item.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-foreground tracking-tighter text-sm sm:text-base text-right tabular-nums truncate">
                      {formatCurrency(item.amount)}
                    </td>
                    
                    {/* Desktop Action Column */}
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-right">
                      <DeleteFinanceButton id={item.id} category={item.category_name} />
                    </td>
                  </tr>
                  
                  {expandedRows.includes(item.id) && (
                    <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                      <td colSpan={6} className="px-4 py-4 border-l-2 border-primary">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-0.5">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tahun Anggaran</p>
                                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                   <Calendar size={12} className="text-primary" />
                                   {item.year}
                                </p>
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tipe Aliran</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                   {item.type === 'income' ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-destructive" />}
                                   <span className="text-[10px] font-bold uppercase">{item.type}</span>
                                </div>
                             </div>
                             {item.note && (
                               <div className="col-span-2 space-y-0.5 mt-1">
                                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Keterangan</p>
                                  <p className="text-[10px] italic text-foreground/70 leading-relaxed">
                                     &quot;{item.note}&quot;
                                  </p>
                               </div>
                             )}
                          </div>

                          {/* Mobile Action */}
                          <div className="pt-3 border-t border-border/50">
                             <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Aksi Pengelolaan</p>
                             <div className="w-full">
                                <DeleteFinanceButton id={item.id} category={item.category_name} />
                             </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
