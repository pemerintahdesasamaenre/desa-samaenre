'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addFinanceEntry } from '@/actions/finances';
import type { FinanceInput } from '@/lib/validations';
import { Save, Loader2, ArrowLeft, TrendingUp, Tag, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import CustomSelect from '@/components/ui/CustomSelect';

interface FinanceFormProps {
  categories: { id: string; name: string }[];
}

export default function FinanceForm({ categories }: FinanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense' | 'financing',
    category_id: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const toastId = toast.loading('Menyimpan data anggaran...');

    const form = e.currentTarget;
    const rawData = new FormData(form);
    
    const selectedCategory = categories.find(c => c.id === formData.category_id);

    const data: FinanceInput = {
      year: parseInt(rawData.get('year') as string),
      type: formData.type,
      category_name: selectedCategory ? selectedCategory.name : '',
      amount: parseInt(rawData.get('amount') as string),
      note: rawData.get('note') as string,
    };

    if (!data.category_name) {
      toast.error('Silakan pilih kategori anggaran', { id: toastId });
      setLoading(false);
      return;
    }

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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase">
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
          
          <div className="space-y-8 sm:space-y-10">
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
              
              <CustomSelect
                label="Tipe Anggaran"
                icon={Wallet}
                options={[
                  { id: 'income', name: 'Pendapatan' },
                  { id: 'expense', name: 'Pengeluaran' },
                  { id: 'financing', name: 'Pembiayaan' }
                ]}
                value={formData.type}
                onChange={(val) => setFormData(prev => ({ ...prev, type: val as any }))}
                required
              />

              <div className="md:col-span-2">
                <CustomSelect
                  label="Kategori / Nama Akun"
                  placeholder="Pilih Kategori Anggaran..."
                  icon={Tag}
                  options={categories}
                  value={formData.category_id}
                  onChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                  required
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
              type="submit" 
              disabled={loading} 
              className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-4 rounded-full font-bold flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/30 active:scale-95 text-xs sm:text-sm tracking-widest uppercase"
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
