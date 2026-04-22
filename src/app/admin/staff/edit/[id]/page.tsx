import { createClient } from '@/lib/supabase/server';
import { getStaffMembers } from '@/actions/staff';
import StaffForm from '@/components/modules/village/StaffForm';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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
    <div className="space-y-10">
      <div className="flex items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <Link 
          href="/admin/staff" 
          className="p-4 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-2xl transition-all shadow-sm active:scale-95 group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground tracking-tighter">Edit Aparatur</h1>
          <p className="text-muted-foreground font-medium italic mt-1">Perbarui profil, jabatan, dan posisi hirarki perangkat desa.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <StaffForm staffList={staffList} initialData={staff} />
      </div>
    </div>
  );
}
