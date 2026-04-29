'use client';


import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import DeleteFinanceButton from '@/components/modules/finance/DeleteFinanceButton';
import { Finance } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';

interface FinanceTableProps {
  finances: Finance[];
}

export const FinanceTable = ({ finances }: FinanceTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const columns: Column<Finance>[] = [
    {
      header: 'Kategori',
      accessor: (item) => (
        <div className="overflow-hidden">
          <div className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-tight line-clamp-1">{item.category_name}</div>
          <div className="md:hidden text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            {item.year} • {item.type === 'income' ? 'IN' : 'OUT'}
          </div>
        </div>
      ),
    },
    {
      header: 'Tahun',
      hideOnMobile: true,
      accessor: (item) => <span className="font-bold text-foreground/70 text-sm">{item.year}</span>,
    },
    {
      header: 'Tipe',
      hideOnMobile: true,
      hideOnTablet: true,
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 
          item.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        }`}>
          {item.type}
        </span>
      ),
    },
    {
      header: 'Jumlah',
      align: 'right',
      accessor: (item) => (
        <span className="font-bold text-foreground tracking-tighter text-sm sm:text-base text-right tabular-nums truncate">
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      header: 'Aksi',
      hideOnMobile: true,
      align: 'right',
      accessor: (item) => <DeleteFinanceButton id={item.id} category={item.category_name} />,
    },
  ];

  const renderExpandedRow = (item: Finance) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tahun Anggaran</p>
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
               <Calendar size={12} className="text-primary" />
               {item.year}
            </p>
         </div>
         <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tipe Aliran</p>
            <div className="flex items-center gap-1.5 mt-0.5">
               {item.type === 'income' ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-destructive" />}
               <span className="text-[10px] font-bold uppercase">{item.type}</span>
            </div>
         </div>
         {item.note && (
           <div className="col-span-2 space-y-0.5 mt-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Keterangan</p>
              <p className="text-[10px] italic text-foreground/70 leading-relaxed">
                 &quot;{item.note}&quot;
              </p>
           </div>
         )}
      </div>
      <div className="pt-3 border-t border-border/50">
         <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Aksi Pengelolaan</p>
         <div className="w-full">
            <DeleteFinanceButton id={item.id} category={item.category_name} />
         </div>
      </div>
    </div>
  );

  return (
    <DataTable
      data={finances}
      columns={columns}
      keyExtractor={(item) => item.id}
      renderExpandedRow={renderExpandedRow}
      emptyState={
        <div className="py-20 text-center text-muted-foreground font-medium italic text-sm">
          Data anggaran kosong.
        </div>
      }
    />
  );
};
