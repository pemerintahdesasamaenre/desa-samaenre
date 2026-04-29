'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addFinanceEntry } from '@/actions/finances';
import type { FinanceInput } from '@/lib/validations';
import { Save, Loader2, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function FinanceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const toastId = toast.loading('Menyimpan data anggaran...');

    const formData = new FormData(e.currentTarget);
    
    const data: FinanceInput = {
      year: parseInt(formData.get('year') as string),
      type: formData.get('type') as 'income' | 'expense' | 'financing',
      category_name: formData.get('category_name') as string,
      amount: parseInt(formData.get('amount') as string),
      note: formData.get('note') as string,
    };

    try {
      const result = await addFinanceEntry(data);
      
      if (result.error) {
        const msg = typeof result.error === 'string' ? result.error : 'Gagal validasi data';
        setError(msg);
        toast.error('Gagal: ' + msg, { id: toastId });
        setLoading(false);
      } else {
        toast.success('Data anggaran berhasil disimpan!', { id: toastId });
        setTimeout(() => {
          router.push('/admin/finances');
          router.refresh();
        }, 1500);
      }
    } catch {
      toast.error('Terjadi kesalahan sistem', { id: toastId });
      setLoading(false);
    }
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

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Tambah Data Anggaran
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Catat pemasukan atau pengeluaran desa secara transparan untuk dipublikasikan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 sm:space-y-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-6 sm:space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <TrendingUp size={18} />
              </div>
              Rincian Anggaran
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <Label>Tahun Anggaran</Label>
                <Input 
                  type="number" 
                  name="year" 
                  defaultValue={new Date().getFullYear()} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipe Anggaran</Label>
                <select 
                  name="type" 
                  required 
                  className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold hover:border-primary/50"
                >
                  <option value="income">Pendapatan</option>
                  <option value="expense">Pengeluaran</option>
                  <option value="financing">Pembiayaan</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Kategori / Nama Akun</Label>
                <Input 
                  name="category_name" 
                  required 
                  placeholder="Contoh: Dana Desa (DDS)" 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Jumlah (Rp)</Label>
                <Input 
                  type="number" 
                  name="amount" 
                  required 
                  min="0" 
                  placeholder="Masukkan nominal angka saja"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Catatan (Opsional)</Label>
                <textarea 
                  name="note" 
                  rows={4} 
                  className="w-full p-5 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium hover:border-primary/50 text-sm"
                  placeholder="Penjelasan tambahan mengenai anggaran ini..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary text-primary-foreground px-12 py-4 rounded-full font-bold flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/30 active:scale-95 text-xs sm:text-sm tracking-widest uppercase"
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
