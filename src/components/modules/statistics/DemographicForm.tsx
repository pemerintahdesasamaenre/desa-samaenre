'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDemographic, updateDemographic } from '@/actions/demographics';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import { FolderOpen } from 'lucide-react';

interface DemographicFormProps {
  categories: any[];
  initialData?: any;
  isEditing?: boolean;
}

export default function DemographicForm({ categories, initialData, isEditing }: DemographicFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      category_id: formData.get('category_id') as string,
      label: formData.get('label') as string,
      value: parseInt(formData.get('value') as string, 10),
    };

    try {
      const result = isEditing 
        ? await updateDemographic(initialData.id, data)
        : await createDemographic(data);

      if (result.error) {
        setError(typeof result.error === 'string' ? result.error : 'Terjadi kesalahan validasi.');
      } else {
        router.push('/admin/statistics');
        router.refresh();
      }
    } catch (err) {
      setError('Gagal menyimpan data. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/statistics" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Data Demografi' : 'Tambah Data Demografi Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Isi formulir di bawah untuk {isEditing ? 'memperbarui' : 'menambahkan'} data statistik desa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <CustomSelect 
            name="category_id" 
            defaultValue={initialData?.category_id || ''}
            options={categories}
            label="Kategori Statistik"
            icon={FolderOpen}
            required
            onChange={(val) => {
              // Untuk DemographicForm yang menggunakan FormData, kita perlu trigger input hidden
              // Tapi CustomSelect sudah memiliki input hidden dengan name="category_id"
            }}
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Label (Nama Data)</label>
            <input 
              name="label" 
              defaultValue={initialData?.label}
              placeholder="Contoh: Laki-Laki, Petani, Dusun A..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah (Value)</label>
            <input 
              name="value" 
              type="number"
              defaultValue={initialData?.value || 0}
              required
              min="0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
