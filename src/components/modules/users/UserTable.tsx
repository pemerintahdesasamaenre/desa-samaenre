'use client';

import React, { useState } from 'react';
import { User as UserIcon, ChevronDown, ChevronUp, Clock, Shield } from 'lucide-react';
import { Profile } from '@/types';

interface UserTableProps {
  profiles: Profile[];
}

export const UserTable = ({ profiles }: UserTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card rounded-2xl sm:rounded-[3rem] shadow-sm border border-border overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {/* Kolom 1: Toggle (Mobile Only) */}
              <th className="md:hidden w-10 px-3 py-4"></th>
              
              {/* Kolom 2: Info Admin */}
              <th className="px-4 sm:px-10 py-5 text-[9px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Administrator</th>
              
              {/* Kolom Desktop Only */}
              <th className="hidden md:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Role</th>
              <th className="hidden lg:table-cell px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right">Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {profiles.map((profile: Profile) => (
              <React.Fragment key={profile.id}>
                <tr 
                  className="hover:bg-primary/5 transition-colors group cursor-pointer md:cursor-default"
                  onClick={() => { if (window.innerWidth < 768) toggleRow(profile.id); }}
                >
                  <td className="md:hidden px-3 py-5 text-center">
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleRow(profile.id); }} 
                       className="p-1 text-muted-foreground hover:text-primary"
                     >
                        {expandedRows.includes(profile.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                     </button>
                  </td>
                  <td className="px-4 sm:px-10 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <UserIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-foreground tracking-tight text-sm sm:text-base leading-none truncate">{profile.full_name || 'Administrator'}</div>
                        <div className="md:hidden text-[9px] font-black text-primary uppercase mt-1">{profile.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-10 py-5">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {profile.role}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-10 py-5 text-xs font-bold text-muted-foreground text-right tabular-nums">
                    {new Date(profile.updated_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>

                {/* Mobile Expanded View */}
                {expandedRows.includes(profile.id) && (
                  <tr className="md:hidden bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                     <td colSpan={4} className="px-4 py-4 border-l-2 border-primary">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Wewenang</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <Shield size={12} className="text-primary" />
                                 <span className="text-[10px] font-black uppercase text-foreground">{profile.role}</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Login Terakhir</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <Clock size={12} className="text-muted-foreground" />
                                 <span className="text-[10px] font-bold text-foreground">{new Date(profile.updated_at).toLocaleDateString('id-ID')}</span>
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
