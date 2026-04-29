'use client';


import Link from 'next/link';
import { Edit2, Layers, Hash } from 'lucide-react';
import DeleteStaffButton from '@/components/modules/village/DeleteStaffButton';
import { StaffMember } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';

interface StaffTableProps {
  staff: StaffMember[];
  isLoading?: boolean;
}

export const StaffTable = ({ staff, isLoading }: StaffTableProps) => {
  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    return staff.find(s => s.id === parentId)?.name || '-';
  };

  const columns: Column<StaffMember>[] = [
    {
      header: 'Aparatur',
      accessor: (item) => (
        <>
          <div className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base tracking-tight truncate">{item.name}</div>
          <div className="md:hidden text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5 truncate">{item.position}</div>
        </>
      ),
    },
    {
      header: 'Jabatan',
      hideOnMobile: true,
      accessor: (item) => (
        <span className="px-2 py-0.5 bg-muted rounded text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
          {item.position}
        </span>
      ),
    },
    {
      header: 'Org',
      hideOnMobile: true,
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
          item.org_type === 'bpd'
            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
            : 'bg-primary/10 text-primary border-primary/20'
        }`}>
          {item.org_type === 'bpd' ? 'BPD' : 'Pemdes'}
        </span>
      ),
    },
    {
      header: 'Atasan',
      hideOnMobile: true,
      hideOnTablet: true,
      accessor: (item) => <span className="text-xs font-bold text-muted-foreground truncate">{getParentName(item.parent_id)}</span>,
    },
    {
      header: 'Urutan',
      hideOnMobile: true,
      accessor: (item) => <span className="font-mono font-bold text-primary text-xs">{item.order_index}</span>,
    },
    {
      header: 'Aksi',
      hideOnMobile: true,
      align: 'right',
      accessor: (item) => (
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <Link 
            href={`/admin/staff/edit/${item.id}`}
            className="p-2 text-muted-foreground hover:text-primary bg-muted/50 rounded-lg transition-all"
          >
            <Edit2 size={14} />
          </Link>
          <DeleteStaffButton id={item.id} name={item.name} />
        </div>
      ),
    },
  ];

  const renderExpandedRow = (item: StaffMember) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
         <div className="flex items-start gap-3">
            <div className="p-1.5 bg-background rounded-lg border border-border">
               <Layers size={12} className="text-primary" />
            </div>
            <div>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Hirarki / Atasan</p>
               <p className="text-xs font-bold text-foreground mt-0.5">{getParentName(item.parent_id)}</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <div className="p-1.5 bg-background rounded-lg border border-border">
               <Hash size={12} className="text-primary" />
            </div>
            <div>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Indeks Urutan</p>
               <p className="text-xs font-bold font-mono text-primary mt-0.5">{item.order_index}</p>
            </div>
         </div>
      </div>
      <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
         <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Manajemen Aparatur</p>
         <div className="grid grid-cols-2 gap-2">
            <Link 
              href={`/admin/staff/edit/${item.id}`}
              className="flex items-center justify-center gap-2 bg-background border border-border text-foreground py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
            >
              <Edit2 size={14} className="text-primary" />
              Edit Data
            </Link>
            <DeleteStaffButton id={item.id} name={item.name} />
         </div>
      </div>
    </div>
  );

  return (
    <DataTable
      data={staff}
      columns={columns}
      keyExtractor={(item) => item.id}
      renderExpandedRow={renderExpandedRow}
      isLoading={isLoading}
    />
  );
};
