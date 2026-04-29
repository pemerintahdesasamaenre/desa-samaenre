'use client';


import { User as UserIcon, Clock, Shield } from 'lucide-react';
import { Profile } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';

interface UserTableProps {
  profiles: Profile[];
}

export const UserTable = ({ profiles }: UserTableProps) => {
  const columns: Column<Profile>[] = [
    {
      header: 'Administrator',
      accessor: (profile) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <UserIcon size={18} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-foreground tracking-tight text-sm sm:text-base leading-none truncate">{profile.full_name || 'Administrator'}</div>
            <div className="md:hidden text-[10px] font-bold text-primary uppercase mt-1">{profile.role}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      hideOnMobile: true,
      accessor: (profile) => (
        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {profile.role}
        </span>
      ),
    },
    {
      header: 'Terakhir',
      hideOnMobile: true,
      hideOnTablet: true,
      align: 'right',
      accessor: (profile) => (
        <span className="text-xs font-bold text-muted-foreground tabular-nums">
          {new Date(profile.updated_at).toLocaleDateString('id-ID')}
        </span>
      ),
    },
  ];

  const renderExpandedRow = (profile: Profile) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Wewenang</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Shield size={12} className="text-primary" />
          <span className="text-[10px] font-bold uppercase text-foreground">{profile.role}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Login Terakhir</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={12} className="text-muted-foreground" />
          <span className="text-[10px] font-bold text-foreground">{new Date(profile.updated_at).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <DataTable
      data={profiles}
      columns={columns}
      keyExtractor={(profile) => profile.id}
      renderExpandedRow={renderExpandedRow}
    />
  );
};
