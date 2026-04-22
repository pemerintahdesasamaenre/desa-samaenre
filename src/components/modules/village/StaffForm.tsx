'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertStaffMember } from '@/actions/staff';
import type { StaffMemberInput } from '@/lib/validations';
import type { StaffMember } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import { ArrowLeft, Save, Loader2, Network } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
      setError(typeof result.error === 'string' ? result.error : 'Gagal menyimpan.');
      setLoading(false);
      return;
    }

    router.push('/admin/staff');
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <Link 
          href="/admin/staff" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[9px] sm:text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
          <h2 className="text-xl sm:text-3xl font-black text-foreground tracking-tighter">
            {initialData ? 'Edit Aparatur' : 'Tambah Aparatur'}
          </h2>
          <p className="text-[10px] sm:text-base text-muted-foreground mt-1 font-medium italic">Update bagan organisasi desa.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 sm:space-y-12">
          {error && (
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold">
              {error}
            </div>
          )}
        
          <div className="space-y-6 sm:space-y-10">
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Network size={16} />
              </div>
              Profil Aparatur
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2 md:col-span-2">
                <Label>Nama Lengkap</Label>
                <Input name="name" required defaultValue={initialData?.name} className="h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Input name="position" required defaultValue={initialData?.position} className="h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input type="number" name="order_index" defaultValue={initialData?.order_index || 0} className="h-11 sm:h-12 text-sm" />
              </div>
              <div className="md:col-span-2">
                <ImageUpload label="Foto Profil" folder="staff" value={photoUrl} onChange={setPhotoUrl} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Atasan Langsung</Label>
                <select name="parent_id" defaultValue={initialData?.parent_id || ''} className="w-full h-11 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-full border border-border bg-background text-sm sm:font-bold outline-none">
                  <option value="">Posisi Tertinggi</option>
                  {staffList.filter(s => s.id !== initialData?.id).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 sm:px-12 sm:py-5 rounded-full font-black flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg text-[10px] sm:text-sm tracking-widest uppercase">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {initialData ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
