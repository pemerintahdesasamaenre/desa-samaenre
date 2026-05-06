'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident, deleteResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Resident } from '@/types';
import { toast } from 'sonner';

// Form Sections
import IdentitySection from './form-sections/IdentitySection';
import BirthGenderSection from './form-sections/BirthGenderSection';
import DomicileSection from './form-sections/DomicileSection';
import SocioEconomicSection from './form-sections/SocioEconomicSection';
import ParentSection from './form-sections/ParentSection';

interface ResidentFormProps {
  initialData?: Partial<Resident> & { id?: string };
  isEditing?: boolean;
}

const TARGET_SAVE_PHRASE = "SAYA BERTANGGUNG JAWAB";

export default function ResidentForm({ initialData, isEditing }: ResidentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleOpenSaveConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    setShowSaveConfirm(true);
  };

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowSaveConfirm(false);

    const formData = new FormData(formRef.current!);
    
    // Construct data directly from FormData
    // The sub-components use the same 'name' attributes as before
    const data = {
      nik: formData.get('nik') as string,
      kk: formData.get('kk') as string,
      name: formData.get('name') as string,
      birth_place: formData.get('birth_place') as string || '',
      birth_date: formData.get('birth_date') as string || null,
      gender: formData.get('gender') as 'L' | 'P',
      education: formData.get('education') as string,
      occupation: formData.get('occupation') as string,
      marital_status: formData.get('marital_status') as string,
      family_relationship: formData.get('family_relationship') as string,
      father_name: formData.get('father_name') as string || '',
      mother_name: formData.get('mother_name') as string || '',
      dusun: formData.get('dusun') as string,
      rt: formData.get('rt') as string || '',
      rw: formData.get('rw') as string || '',
      data_year: parseInt(formData.get('data_year') as string, 10) || new Date().getFullYear(),
    };

    const toastId = toast.loading('Menyimpan data penduduk...');
    try {
      const result = await upsertResident(data, isEditing ? initialData?.id : undefined);
      if (result.error) {
        setError(result.error as string);
        toast.error('Gagal menyimpan: ' + result.error, { id: toastId });
        setLoading(false);
      } else {
        const successMsg = isEditing ? 'Data penduduk diperbarui!' : 'Penduduk baru ditambahkan!';
        setSuccess(successMsg);
        toast.success(successMsg, { id: toastId });
        
        setTimeout(() => {
          router.push('/admin/residents');
          router.refresh();
        }, 1500);
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Gagal menyimpan data.';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    const toastId = toast.loading(`Menghapus data "${initialData.name}"...`);
    try {
      const result = await deleteResident(initialData.id);
      if (result.success) {
        toast.success(`Data "${initialData.name}" berhasil dihapus`, { id: toastId });
        setSuccess('Data penduduk telah dihapus permanen.');
        setTimeout(() => {
          router.push('/admin/residents');
          router.refresh();
        }, 1500);
      } else {
        toast.error('Gagal menghapus: ' + result.error, { id: toastId });
        setIsDeleting(false);
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.', { id: toastId });
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <Link
          href="/admin/residents"
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[9px] sm:text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar
        </Link>

        {isEditing && !success && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest bg-destructive/5 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-destructive/20 active:scale-95"
          >
            <Trash2 size={14} />
            Hapus Record
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border bg-muted/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase">
            {isEditing ? 'Update Data Penduduk' : 'Input Penduduk Baru'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium italic">
            Seluruh perubahan akan tervalidasi dan tercatat dalam sistem audit desa.
          </p>
        </div>

        <div className="px-6 sm:px-10 pt-6 sm:pt-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={18} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}
        </div>

        <form 
          ref={formRef} 
          onSubmit={handleOpenSaveConfirm} 
          className={`p-6 sm:p-10 space-y-10 sm:space-y-12 transition-opacity duration-500 ${success ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
        >
          <IdentitySection defaultValues={initialData} />
          <BirthGenderSection defaultValues={initialData} />
          <DomicileSection defaultValues={initialData} />
          <SocioEconomicSection defaultValues={initialData} />
          <ParentSection defaultValues={initialData} />

          <div className="pt-8 sm:pt-10 border-t border-border flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 sm:px-12 sm:py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 text-[10px] sm:text-xs tracking-widest uppercase active:scale-95"
            >
              {loading && !success ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isEditing ? 'Simpan Seluruh Perubahan' : 'Simpan Data Penduduk'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title="Validasi Data"
        description="Apakah Anda yakin data kependudukan ini sudah sesuai dengan dokumen resmi kependudukan yang berlaku?"
        requirePhrase={TARGET_SAVE_PHRASE}
        confirmLabel="Ya, Saya Bertanggung Jawab"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Data Permanen"
        description={`Anda akan menghapus data penduduk atas nama "${initialData?.name}". Seluruh history kependudukan untuk orang ini akan hilang.`}
        variant="danger"
        requirePhrase={initialData?.name}
        confirmLabel="Hapus Sekarang"
        loading={isDeleting}
      />
    </div>
  );
}