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
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
             <Shield size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Struktur Organisasi</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Manajemen hirarki perangkat desa dan anggota BPD.</p>
          </div>
        </div>
        <Link 
          href="/admin/staff/new" 
          className="flex items-center justify-center gap-3 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl sm:rounded-full transition-all shadow-lg shadow-primary/25 font-bold uppercase text-[10px] sm:text-xs tracking-widest active:scale-95 w-full lg:w-auto"
        >
          <Plus size={16} />
          Tambah Aparatur
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-2 bg-muted/50 rounded-2xl sm:rounded-3xl border border-border max-w-md mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('pemdes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl sm:rounded-2xl font-bold uppercase text-[10px] tracking-wider transition-all ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl sm:rounded-2xl font-bold uppercase text-[10px] tracking-wider transition-all ${
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
                <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-tight">
                  {activeTab === 'pemdes' ? 'Pemerintah Desa' : 'Badan Permusyawaratan Desa'}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                  Total: {filteredStaff.length} Anggota Terdaftar
                </p>
              </div>
           </div>
        </div>

        <StaffTable staff={filteredStaff} isLoading={loading} />


      </div>
    </div>
  );
}
