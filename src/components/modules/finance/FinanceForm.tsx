'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addFinanceEntry } from '@/actions/finances';
import type { FinanceInput } from '@/lib/validations';

export default function FinanceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    const data: FinanceInput = {
      year: parseInt(formData.get('year') as string),
      type: formData.get('type') as 'income' | 'expense' | 'financing',
      category_name: formData.get('category_name') as string,
      amount: parseInt(formData.get('amount') as string),
      note: formData.get('note') as string,
    };

    const result = await addFinanceEntry(data);
    
    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Validation failed');
      setLoading(false);
      return;
    }

    router.push('/admin/finances');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tahun</label>
          <input type="number" name="year" defaultValue={new Date().getFullYear()} required className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipe Anggaran</label>
          <select name="type" required className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700">
            <option value="income">Pendapatan</option>
            <option value="expense">Pengeluaran</option>
            <option value="financing">Pembiayaan</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Kategori / Nama Akun</label>
          <input type="text" name="category_name" required placeholder="Contoh: Dana Desa (DDS)" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Jumlah (Rp)</label>
          <input type="number" name="amount" required min="0" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Catatan (Opsional)</label>
          <textarea name="note" rows={3} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700"></textarea>
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
