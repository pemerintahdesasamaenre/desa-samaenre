import Link from 'next/link';
import { Plus, Trash2, Wallet } from 'lucide-react';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transparansi Keuangan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Kelola data APBDDes dan anggaran desa.</p>
        </div>
        <Link 
          href="/admin/finances/new" 
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 w-full sm:w-auto font-bold"
        >
          <Plus size={20} />
          Tambah Data
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Tahun</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Tipe</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Kategori</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Jumlah</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {finances.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 
                      item.type === 'expense' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type === 'income' ? 'Pendapatan' : item.type === 'expense' ? 'Pengeluaran' : 'Pembiayaan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.category_name}</td>
                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {finances.map((item) => (
            <div key={item.id} className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{item.year}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 
                      item.type === 'expense' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type === 'income' ? 'In' : item.type === 'expense' ? 'Out' : 'Fin'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.category_name}</h3>
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="p-2 text-slate-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
              <div className="text-lg font-black text-slate-800 dark:text-slate-200">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        {finances.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Wallet size={48} className="mx-auto mb-4 opacity-20" />
            Belum ada data keuangan.
          </div>
        )}
      </div>
    </div>
  );
}
