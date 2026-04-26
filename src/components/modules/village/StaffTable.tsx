'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit2, ChevronDown, ChevronUp, Layers, Hash } from 'lucide-react';
import DeleteStaffButton from '@/components/modules/village/DeleteStaffButton';
import { StaffMember } from '@/types';

interface StaffTableProps {
  staff: StaffMember[];
}

export const StaffTable = ({ staff }: StaffTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    return staff.find(s => s.id === parentId)?.name || '-';
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card rounded-2xl sm:rounded-[3rem] border border-border overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {/* Kolom 1: Toggle (Mobile Only) */}
              <th className="md:hidden w-10 px-3 py-4"></th>
              
              {/* Kolom 2: Info Utama */}
              <th className="px-4 sm:px-10 py-5 text-[9px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Aparatur</th>
              
              {/* Kolom Desktop Only */}
              <th className="hidden md:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-1/4">Jabatan</th>
              <th className="hidden md:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-24">Org</th>
              <th className="hidden lg:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-1/4">Atasan</th>
              <th className="hidden md:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] w-16">Urutan</th>
              
              {/* Kolom Aksi (Desktop Only) */}
              <th className="hidden md:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map((item) => (
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
                  <td className="px-4 sm:px-10 py-5">
                     <div className="font-black text-foreground group-hover:text-primary transition-colors text-sm sm:text-base tracking-tight truncate">{item.name}</div>
                     <div className="md:hidden text-[9px] font-black text-primary uppercase tracking-widest mt-0.5 truncate">{item.position}</div>
                  </td>
                  <td className="hidden md:table-cell px-10 py-5">
                    <span className="px-2 py-0.5 bg-muted rounded text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                      {item.position}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-10 py-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      item.org_type === 'bpd'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {item.org_type === 'bpd' ? 'BPD' : 'Pemdes'}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-10 py-5 text-xs font-bold text-muted-foreground truncate">{getParentName(item.parent_id)}</td>
                  <td className="hidden md:table-cell px-10 py-5 font-mono font-bold text-primary text-xs">{item.order_index}</td>
                  
                  {/* Desktop Action Column */}
                  <td className="hidden md:table-cell px-10 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <Link 
                        href={`/admin/staff/edit/${item.id}`}
                        className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <DeleteStaffButton id={item.id} name={item.name} />
                    </div>
                  </td>
                </tr>
                
                {expandedRows.includes(item.id) && (
                  <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                    <td colSpan={6} className="px-4 py-4 border-l-2 border-primary">
                       <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-3">
                             <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-background rounded-lg border border-border">
                                   <Layers size={12} className="text-primary" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Hirarki / Atasan</p>
                                   <p className="text-xs font-bold text-foreground mt-0.5">{getParentName(item.parent_id)}</p>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-background rounded-lg border border-border">
                                   <Hash size={12} className="text-primary" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Indeks Urutan</p>
                                   <p className="text-xs font-black font-mono text-primary mt-0.5">{item.order_index}</p>
                                </div>
                             </div>
                          </div>

                          {/* Mobile Actions */}
                          <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Manajemen Aparatur</p>
                             <div className="grid grid-cols-2 gap-2">
                                <Link 
                                  href={`/admin/staff/edit/${item.id}`}
                                  className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95"
                                >
                                  <Edit2 size={14} className="text-primary" />
                                  Edit Data
                                </Link>
                                <DeleteStaffButton id={item.id} name={item.name} />
                             </div>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
