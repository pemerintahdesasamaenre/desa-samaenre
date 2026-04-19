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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/staff" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Data Aparatur' : 'Tambah Aparatur Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Lengkapi data perangkat desa untuk bagan organisasi.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              required 
              defaultValue={initialData?.name}
              placeholder="Masukkan nama lengkap beserta gelar jika ada"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jabatan</label>
            <input 
              type="text" 
              name="position" 
              required 
              defaultValue={initialData?.position}
              placeholder="Contoh: Kepala Desa, Sekretaris Desa" 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Urutan Tampil (Order)</label>
            <input 
              type="number" 
              name="order_index" 
              defaultValue={initialData?.order_index || 0} 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
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
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Atasan Langsung (Struktur Hirarki)</label>
            <select 
              name="parent_id" 
              defaultValue={initialData?.parent_id || ''}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">Tidak ada (Posisi Tertinggi)</option>
              {staffList
                .filter(s => s.id !== initialData?.id) // Jangan jadikan diri sendiri sebagai atasan
                .map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.position}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {initialData ? 'Simpan Perubahan' : 'Tambah Aparatur'}
          </button>
        </div>
      </form>
    </div>
  );
}
