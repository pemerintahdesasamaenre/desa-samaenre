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
          <h1 className="text-3xl font-bold text-slate-900">Data Demografi</h1>
          <p className="text-slate-500 mt-1">Kelola data statistik dan demografi penduduk desa.</p>
        </div>
        <Link 
          href="/admin/statistics/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Kategori</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Label</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Jumlah</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demographics.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium uppercase tracking-wider">
                      {item.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/statistics/edit/${item.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
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
