'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertStaffMember } from '@/actions/staff';
import type { StaffMemberInput } from '@/lib/validations';
import type { StaffMember } from '@/types';

export default function StaffForm({ staffList }: { staffList: StaffMember[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const parent_id = formData.get('parent_id') as string;
    
    const data: StaffMemberInput = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      photo_url: formData.get('photo_url') as string || '',
      parent_id: parent_id ? parent_id : null,
      order_index: parseInt(formData.get('order_index') as string || '0'),
    };

    const result = await upsertStaffMember(data);
    
    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Validation failed');
      setLoading(false);
      return;
    }

    router.push('/admin/staff');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Nama Lengkap</label>
          <input type="text" name="name" required className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Jabatan</label>
          <input type="text" name="position" required placeholder="Contoh: Kepala Desa" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">URL Foto (Opsional)</label>
          <input type="url" name="photo_url" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Atasan Langsung (Parent)</label>
          <select name="parent_id" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700">
            <option value="">Tidak ada (Posisi Tertinggi)</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name} - {s.position}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Urutan (Order Index)</label>
          <input type="number" name="order_index" defaultValue={0} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">Batal</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </form>
  );
}
