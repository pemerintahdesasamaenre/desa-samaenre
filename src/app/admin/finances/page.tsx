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
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground tracking-tighter">Transparansi Keuangan</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Kelola data APBDDes dan transparansi anggaran desa.</p>
        </div>
        <Link 
          href="/admin/finances/new" 
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-full transition-all shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest active:scale-95"
        >
          <Plus size={20} />
          Tambah Data
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Tahun</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Tipe</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Kategori Anggaran</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Jumlah</th>
                <th className="px-10 py-5 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {finances.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-10 py-5 font-black text-foreground/70">{item.year}</td>
                  <td className="px-10 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                      item.type === 'expense' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {item.type === 'income' ? 'Pendapatan' : item.type === 'expense' ? 'Pengeluaran' : 'Pembiayaan'}
                    </span>
                  </td>
                  <td className="px-10 py-5 font-bold text-foreground">{item.category_name}</td>
                  <td className="px-10 py-5 font-black text-foreground tracking-tighter text-lg">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-10 py-5 text-right">
                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20">
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
        <div className="md:hidden divide-y divide-border">
          {finances.map((item) => (
            <div key={item.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-muted-foreground">{item.year}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 
                      item.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                    }`}>
                      {item.type === 'income' ? 'IN' : item.type === 'expense' ? 'OUT' : 'FIN'}
                    </span>
                  </div>
                  <h3 className="font-black text-foreground leading-tight text-lg">{item.category_name}</h3>
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-border">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
              <div className="text-2xl font-black text-primary tracking-tighter">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        {finances.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Wallet size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada data keuangan tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
