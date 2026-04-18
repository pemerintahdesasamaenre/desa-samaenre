import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { getStaffMembers, deleteStaffMember } from '@/actions/staff';
import { revalidatePath } from 'next/cache';

export default async function AdminStaffPage() {
  const staff = await getStaffMembers();

  async function handleDelete(formData: FormData) {
    'use server'
    const id = formData.get('id') as string;
    await deleteStaffMember(id);
    revalidatePath('/admin/staff');
  }

  // Helper to show hierarchy name
  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    return staff.find(s => s.id === parentId)?.name || '-';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Struktur Organisasi</h1>
          <p className="text-slate-500 mt-1">Kelola perangkat desa dan bagan organisasi.</p>
        </div>
        <Link href="/admin/staff/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Tambah Staf</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-medium">Nama Lengkap</th>
              <th className="p-4 font-medium">Jabatan</th>
              <th className="p-4 font-medium">Atasan</th>
              <th className="p-4 font-medium">Urutan</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {staff.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">Belum ada data perangkat desa.</td></tr>
            ) : staff.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.position}</td>
                <td className="p-4">{getParentName(item.parent_id)}</td>
                <td className="p-4">{item.order_index}</td>
                <td className="p-4 text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
