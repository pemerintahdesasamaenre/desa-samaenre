import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getFinances } from '@/actions/finances';
import { FinanceTable } from '@/components/modules/finance/FinanceTable';

export default async function AdminFinancesPage() {
  const finances = await getFinances();

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tighter uppercase">Transparansi Keuangan</h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1 font-medium italic">Kelola data APBDDes dan transparansi anggaran desa.</p>
        </div>
        <Link 
          href="/admin/finances/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl sm:rounded-full transition-all shadow-xl shadow-primary/20 font-bold uppercase text-[10px] sm:text-xs tracking-widest active:scale-95 w-full lg:w-auto"
        >
          <Plus size={16} />
          Tambah Data
        </Link>
      </div>

      <FinanceTable finances={finances} />
    </div>
  );
}
