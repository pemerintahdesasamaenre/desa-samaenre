import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { getFinances, deleteFinanceEntry } from '@/actions/finances';
import { revalidatePath } from 'next/cache';

export default async function AdminFinancesPage() {
  const finances = await getFinances();

  async function handleDelete(formData: FormData) {
    'use server'
    const id = formData.get('id') as string;
    await deleteFinanceEntry(id);
    revalidatePath('/admin/finances');
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transparansi</h1>
          <p className="text-slate-500 mt-1">Kelola data APBDDes dan anggaran desa.</p>
        </div>
        <Link href="/admin/finances/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Tambah Data</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-medium">Tahun</th>
              <th className="p-4 font-medium">Tipe</th>
              <th className="p-4 font-medium">Kategori</th>
              <th className="p-4 font-medium">Jumlah (Rp)</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {finances.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">Belum ada data keuangan.</td></tr>
            ) : finances.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4">{item.year}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    item.type === 'income' ? 'bg-green-100 text-green-700' : 
                    item.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type === 'income' ? 'Pendapatan' : item.type === 'expense' ? 'Pengeluaran' : 'Pembiayaan'}
                  </span>
                </td>
                <td className="p-4 font-medium">{item.category_name}</td>
                <td className="p-4">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.amount)}
                </td>
                <td className="p-4 text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
