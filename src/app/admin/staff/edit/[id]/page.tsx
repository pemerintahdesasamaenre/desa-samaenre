import { createClient } from '@/lib/supabase/server';
import { getStaffMembers } from '@/actions/staff';
import StaffForm from '@/components/modules/village/StaffForm';
import { notFound } from 'next/navigation';

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Ambil data staf tunggal
  const { data: staff, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !staff) {
    notFound();
  }

  // Ambil list staf untuk dropdown atasan (parent_id)
  const staffList = await getStaffMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Data Aparatur</h1>
        <p className="text-slate-500 mt-1">Perbarui profil dan jabatan perangkat desa.</p>
      </div>
      <StaffForm staffList={staffList} initialData={staff} />
    </div>
  );
}
