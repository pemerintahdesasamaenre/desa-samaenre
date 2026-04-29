import StaffForm from '@/components/modules/village/StaffForm';
import { getStaffMembers } from '@/actions/staff';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewStaffPage() {
  const staffList = await getStaffMembers();

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <Link 
          href="/admin/staff" 
          className="p-4 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-2xl transition-all shadow-sm active:scale-95 group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground tracking-tighter">Tambah Aparatur</h1>
          <p className="text-muted-foreground font-medium italic mt-1">Daftarkan anggota perangkat desa atau staf baru ke dalam sistem.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <StaffForm staffList={staffList} />
      </div>
    </div>
  );
}
