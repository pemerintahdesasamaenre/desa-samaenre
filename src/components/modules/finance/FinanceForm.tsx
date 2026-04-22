'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addFinanceEntry } from '@/actions/finances';
import type { FinanceInput } from '@/lib/validations';
import { Save, Loader2, ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';

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
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6">
        <Link 
          href="/admin/finances" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Transparansi
        </Link>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-border bg-muted/30">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            Tambah Data Anggaran
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Catat pemasukan atau pengeluaran desa secara transparan untuk dipublikasikan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Tahun Anggaran</label>
              <input 
                type="number" 
                name="year" 
                defaultValue={new Date().getFullYear()} 
                required 
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Tipe Anggaran</label>
              <select 
                name="type" 
                required 
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
              >
                <option value="income">Pendapatan</option>
                <option value="expense">Pengeluaran</option>
                <option value="financing">Pembiayaan</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Kategori / Nama Akun</label>
              <input 
                type="text" 
                name="category_name" 
                required 
                placeholder="Contoh: Dana Desa (DDS)" 
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Jumlah (Rp)</label>
              <input 
                type="number" 
                name="amount" 
                required 
                min="0" 
                placeholder="Masukkan nominal angka saja"
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Catatan (Opsional)</label>
              <textarea 
                name="note" 
                rows={4} 
                className="w-full p-6 rounded-[2rem] border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium"
                placeholder="Penjelasan tambahan mengenai anggaran ini..."
              ></textarea>
            </div>
          </div>

          <div className="pt-10 border-t border-border flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
