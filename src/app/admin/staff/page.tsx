import Link from 'next/link';
import { Plus, Trash2, Users, Edit2 } from 'lucide-react';
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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Struktur Organisasi</h1>
          <p className="text-slate-50 dark:text-slate-400 mt-1 text-sm md:text-base">Kelola perangkat desa dan bagan organisasi.</p>
        </div>
        <Link 
          href="/admin/staff/new" 
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 w-full sm:w-auto font-bold"
        >
          <Plus size={20} />
          <span>Tambah Staf</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Nama Lengkap</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Jabatan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Atasan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Urutan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staff.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.position}</td>
                  <td className="px-6 py-4 text-slate-500">{getParentName(item.parent_id)}</td>
                  <td className="px-6 py-4 text-slate-500">{item.order_index}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/staff/edit/${item.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <form action={handleDelete} className="inline-block">
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {staff.map((item) => (
            <div key={item.id} className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.position}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link 
                    href={`/admin/staff/edit/${item.id}`}
                    className="p-2 text-slate-400 hover:text-blue-600"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <span>Atasan:</span>
                  <span className="text-slate-600 dark:text-slate-300">{getParentName(item.parent_id)}</span>
                </div>
                <div>Urutan: {item.order_index}</div>
              </div>
            </div>
          ))}
        </div>

        {staff.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            Belum ada data perangkat desa.
          </div>
        )}
      </div>
    </div>
  );
}
