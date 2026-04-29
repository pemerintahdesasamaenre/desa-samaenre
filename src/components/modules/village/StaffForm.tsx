'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertStaffMember } from '@/actions/staff';
import type { StaffMemberInput } from '@/lib/validations';
import type { StaffMember } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import { ArrowLeft, Save, Loader2, Network, Eye } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { toast } from 'sonner';

interface StaffFormProps {
  staffList: StaffMember[];
  initialData?: StaffMember | null;
}

export default function StaffForm({ staffList, initialData }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States for Live Preview
  const [name, setName] = useState(initialData?.name || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || '');
  const [orgType, setOrgType] = useState<'pemdes' | 'bpd'>(initialData?.org_type || 'pemdes');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const toastId = toast.loading(initialData ? 'Memperbarui data aparatur...' : 'Menambahkan aparatur desa...')

    const formData = new FormData(e.currentTarget);
    const parent_id = formData.get('parent_id') as string;
    
    const data: StaffMemberInput = {
      name: name,
      position: position,
      photo_url: photoUrl,
      parent_id: parent_id ? parent_id : null,
      order_index: parseInt(formData.get('order_index') as string || '0'),
      org_type: orgType,
    };

    try {
      const result = await upsertStaffMember(data, initialData?.id);
      if (result.error) {
        const msg = typeof result.error === 'string' ? result.error : 'Gagal menyimpan.';
        setError(msg);
        toast.error('Kesalahan: ' + msg, { id: toastId });
        setLoading(false);
      } else {
        toast.success(initialData ? 'Data aparatur diperbarui!' : 'Aparatur berhasil terdaftar!', { id: toastId })
        setTimeout(() => {
          router.push('/admin/staff');
          router.refresh();
        }, 1500);
      }
    } catch {
      setError('Kesalahan koneksi.');
      toast.error('Kesalahan koneksi ke server', { id: toastId });
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6">
      <div className="mb-4 sm:mb-8">
        <Link 
          href="/admin/staff" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase leading-tight">
                {initialData ? 'Edit Aparatur' : 'Tambah Aparatur'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium italic">Konfigurasi data pejabat desa.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 sm:space-y-10">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}
            
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Network size={16} />
                  </div>
                  Informasi Utama
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Nama Lengkap</Label>
                    <Input 
                      name="name" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Andi Majjalekka"
                      className="h-12 text-sm font-medium rounded-xl border focus:border-primary transition-all" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Jabatan</Label>
                    <Input 
                      name="position" 
                      required 
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Contoh: Kepala Desa"
                      className="h-12 text-sm font-medium rounded-xl border focus:border-primary transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Urutan (Indeks)</Label>
                    <Input 
                      type="number" 
                      name="order_index" 
                      defaultValue={initialData?.order_index || 0}
                      className="h-12 text-sm font-medium rounded-xl border focus:border-primary transition-all" 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload 
                      label="Foto Profil" 
                      folder="staff" 
                      value={photoUrl} 
                      onChange={setPhotoUrl} 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Organisasi</Label>
                    <select 
                      name="org_type" 
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as 'pemdes' | 'bpd')}
                      className="w-full h-14 px-6 rounded-xl border border-border bg-background text-sm font-bold outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="pemdes">Pemerintah Desa (Pemdes)</option>
                      <option value="bpd">BPD</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Atasan Langsung (Satu Organisasi)</Label>
                    <select 
                      name="parent_id" 
                      defaultValue={initialData?.parent_id || ''} 
                      className="w-full h-14 px-6 rounded-xl border border-border bg-background text-sm font-bold outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Posisi Tertinggi / Root</option>
                      {staffList
                        .filter(s => s.id !== initialData?.id && s.org_type === orgType)
                        .map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.position}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 text-xs sm:text-sm tracking-widest uppercase"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {initialData ? 'Simpan Perubahan' : 'Tambah Aparatur'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3 mb-6 px-4">
              <Eye size={16} />
              Live Preview
            </h3>

            <div className="flex flex-col items-center p-6 bg-card rounded-3xl border-2 border-dashed border-primary/20 shadow-xl shadow-primary/5 min-h-[400px] justify-center relative overflow-hidden">
               {/* Decorative background for preview */}
               <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/5 to-transparent"></div>
               
               {/* Staff Card Preview — Matching OrgChartTree style */}
               <div className="relative flex flex-col items-center p-6 sm:p-8 bg-background rounded-3xl shadow-xl border border-border w-full max-w-[280px] z-10">
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-full overflow-hidden bg-muted mb-4 sm:mb-6 border-4 border-background shadow-xl">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 sm:w-16 sm:h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-center text-base sm:text-lg tracking-tight uppercase leading-tight min-h-[1.5em]">
                  {name || 'NAMA PEJABAT'}
                </h3>
                <p className="text-primary text-[9px] sm:text-[10px] font-bold text-center uppercase tracking-widest mt-3 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                  {position || 'JABATAN'}
                </p>
                
                <div className="mt-6 pt-6 border-t border-border/50 w-full flex justify-center">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 py-1 bg-muted rounded-lg">
                     {orgType === 'pemdes' ? 'Pemdes' : 'BPD'}
                   </span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground mt-8 text-center font-medium italic opacity-60">
                Preview tampilan kartu di bagan organisasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
