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
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground tracking-tighter">Struktur Organisasi</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Kelola perangkat desa dan bagan organisasi kepengurusan desa.</p>
        </div>
        <Link 
          href="/admin/staff/new" 
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-full transition-all shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest active:scale-95"
        >
          <Plus size={20} />
          <span>Tambah Aparatur</span>
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Nama Lengkap</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Jabatan</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Atasan</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Urutan</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-10 py-5 font-black text-foreground group-hover:text-primary transition-colors text-base tracking-tight">{item.name}</td>
                  <td className="px-10 py-5">
                    <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                      {item.position}
                    </span>
                  </td>
                  <td className="px-10 py-5 text-sm font-bold text-muted-foreground">{getParentName(item.parent_id)}</td>
                  <td className="px-10 py-5 font-mono font-bold text-primary">{item.order_index}</td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/staff/edit/${item.id}`}
                        className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <form action={handleDelete} className="inline-block">
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20">
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
        <div className="md:hidden divide-y divide-border">
          {staff.map((item) => (
            <div key={item.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-black text-foreground leading-tight text-lg tracking-tight">{item.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/staff/edit/${item.id}`}
                    className="p-3 text-muted-foreground hover:text-primary border border-border rounded-2xl"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="p-3 text-muted-foreground hover:text-red-600 border border-border rounded-2xl">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span>Atasan:</span>
                  <span className="text-foreground">{getParentName(item.parent_id)}</span>
                </div>
                <div>Indeks: {item.order_index}</div>
              </div>
            </div>
          ))}
        </div>

        {staff.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada data aparatur tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
