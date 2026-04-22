'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertStaffMember } from '@/actions/staff';
import type { StaffMemberInput } from '@/lib/validations';
import type { StaffMember } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StaffFormProps {
  staffList: StaffMember[];
  initialData?: StaffMember | null;
}

export default function StaffForm({ staffList, initialData }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const parent_id = formData.get('parent_id') as string;
    
    const data: StaffMemberInput = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      photo_url: photoUrl,
      parent_id: parent_id ? parent_id : null,
      order_index: parseInt(formData.get('order_index') as string || '0'),
    };

    const result = await upsertStaffMember(data, initialData?.id);
    
    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Terjadi kesalahan validasi.');
      setLoading(false);
      return;
    }

    router.push('/admin/staff');
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6">
        <Link 
          href="/admin/staff" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-border bg-muted/30">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {initialData ? 'Edit Data Aparatur' : 'Tambah Aparatur Baru'}
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Lengkapi data perangkat desa untuk bagan organisasi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                defaultValue={initialData?.name}
                placeholder="Masukkan nama lengkap beserta gelar jika ada"
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Jabatan</label>
              <input 
                type="text" 
                name="position" 
                required 
                defaultValue={initialData?.position}
                placeholder="Contoh: Kepala Desa, Sekretaris Desa" 
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Urutan Tampil (Order)</label>
              <input 
                type="number" 
                name="order_index" 
                defaultValue={initialData?.order_index || 0} 
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload 
                label="Foto Profil"
                folder="staff"
                value={photoUrl}
                onChange={setPhotoUrl}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Atasan Langsung (Hirarki)</label>
              <select 
                name="parent_id" 
                defaultValue={initialData?.parent_id || ''}
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
              >
                <option value="">Tidak ada (Posisi Tertinggi)</option>
                {staffList
                  .filter(s => s.id !== initialData?.id) 
                  .map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - {s.position}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="pt-10 border-t border-border flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {initialData ? 'Simpan Perubahan' : 'Tambah Aparatur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
