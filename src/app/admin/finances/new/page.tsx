import FinanceForm from '@/components/modules/finance/FinanceForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewFinancePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/finances" className="p-2.5 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tambah Anggaran</h1>
          <p className="text-slate-500 mt-1">Masukkan data pendapatan atau pengeluaran baru.</p>
        </div>
      </div>
      <div className="max-w-3xl">
        <FinanceForm />
      </div>
    </div>
  );
}
