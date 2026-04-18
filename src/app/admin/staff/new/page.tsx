import StaffForm from '@/components/modules/village/StaffForm';
import { getStaffMembers } from '@/actions/staff';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewStaffPage() {
  const staffList = await getStaffMembers();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/staff" className="p-2.5 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Perangkat Desa</h1>
          <p className="text-slate-500 mt-1">Masukkan data staf atau perangkat desa baru.</p>
        </div>
      </div>
      <div className="max-w-3xl">
        <StaffForm staffList={staffList} />
      </div>
    </div>
  );
}
