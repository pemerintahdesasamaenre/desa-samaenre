import { getRawDemographics } from '@/services/data-service';
import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { DeleteButton } from '@/components/modules/statistics/DeleteButton';

export default async function AdminStatisticsPage() {
  const demographics = await getRawDemographics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Data Demografi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola data statistik dan demografi penduduk desa.</p>
        </div>
        <Link 
          href="/admin/statistics/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Tambah Data
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Label</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {demographics.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {item.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/statistics/edit/${item.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton id={item.id} label={item.label} />
                    </div>
                  </td>
                </tr>
              ))}
              {demographics.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                    Belum ada data demografi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
