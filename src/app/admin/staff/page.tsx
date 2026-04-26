'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, Shield } from 'lucide-react';
import { getStaffMembers } from '@/actions/staff';
import { StaffTable } from '@/components/modules/village/StaffTable';
import type { StaffMember } from '@/types';

export default function AdminStaffPage() {
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const [activeTab, setActiveTab] = useState<'pemdes' | 'bpd'>('pemdes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getStaffMembers();
      setAllStaff(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredStaff = allStaff.filter(s => s.org_type === activeTab);

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
            Struktur <span className="text-primary italic">Organisasi</span>
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground mt-2 font-medium italic">Manajemen hirarki perangkat desa dan anggota BPD.</p>
        </div>
        <Link 
          href="/admin/staff/new" 
          className="flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:scale-105 text-primary-foreground rounded-full transition-all shadow-2xl shadow-primary/25 font-black uppercase text-xs tracking-widest active:scale-95 w-full lg:w-auto"
        >
          <Plus size={20} />
          <span>Tambah Aparatur</span>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-2 bg-muted/50 rounded-[2rem] border border-border max-w-md mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('pemdes')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.15em] transition-all ${
            activeTab === 'pemdes' 
            ? 'bg-background text-primary shadow-sm border border-border' 
            : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users size={16} />
          Pemdes
        </button>
        <button 
          onClick={() => setActiveTab('bpd')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.15em] transition-all ${
            activeTab === 'bpd' 
            ? 'bg-background text-blue-600 shadow-sm border border-border' 
            : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield size={16} />
          BPD
        </button>
      </div>

      {/* Content Section */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between px-4 sm:px-0">
           <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${activeTab === 'pemdes' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-600'}`}>
                {activeTab === 'pemdes' ? <Users size={24} /> : <Shield size={24} />}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  {activeTab === 'pemdes' ? 'Pemerintah Desa' : 'Badan Permusyawaratan Desa'}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  Total: {filteredStaff.length} Anggota Terdaftar
                </p>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold italic">Memuat data...</p>
          </div>
        ) : filteredStaff.length > 0 ? (
          <StaffTable staff={filteredStaff} />
        ) : (
          <div className="p-16 sm:p-24 bg-muted/20 border-2 border-dashed border-border rounded-[3.5rem] text-center space-y-4">
            <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto border border-border text-muted-foreground/30">
               {activeTab === 'pemdes' ? <Users size={40} /> : <Shield size={40} />}
            </div>
            <p className="text-muted-foreground font-bold italic text-lg tracking-tight">Belum ada data di kategori ini.</p>
            <Link 
              href="/admin/staff/new" 
              className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:underline"
            >
              <Plus size={14} /> Klik untuk menambah
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
