'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident, deleteResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, User, Contact, MapPin, Calendar, Heart, Briefcase, GraduationCap, Users, Eye, EyeOff, Trash2 } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ResidentFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const GENDER_OPTIONS = [
  { id: 'L', name: 'Laki-laki' },
  { id: 'P', name: 'Perempuan' }
];

export default function ResidentForm({ initialData, isEditing }: ResidentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<any>(null);
  
  // State untuk visibilitas input
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);
  
  // State untuk modal konfirmasi
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const TARGET_SAVE_PHRASE = "SAYA BERTANGGUNG JAWAB ATAS PERUBAHAN DATA INI";

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
    setShowSaveConfirm(false);

    const formData = new FormData(formRef.current!);
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
      father_name: formData.get('father_name') as string || '',
      mother_name: formData.get('mother_name') as string || '',
      dusun: formData.get('dusun') as string || '',
      rt: formData.get('rt') as string || '',
      rw: formData.get('rw') as string || '',
      data_year: parseInt(formData.get('data_year') as string, 10) || new Date().getFullYear(),
    };

    try {
      const result = await upsertResident(data, isEditing ? initialData.id : undefined);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/residents');
        router.refresh();
      }
    } catch {
      setError('Gagal menyimpan data penduduk.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    
    try {
      const result = await deleteResident(initialData.id);
      if (result.success) {
        router.push('/admin/residents');
        router.refresh();
      } else {
        alert('Gagal menghapus: ' + result.error);
      }
    } catch {
      alert('Terjadi kesalahan sistem saat menghapus.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/admin/residents" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>

        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl transition-all border border-red-100 dark:border-red-900/30 shadow-sm"
          >
            <Trash2 size={16} />
            Hapus Record
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
            Setiap perubahan data kependudukan resmi akan dicatat secara otomatis dalam sistem audit log.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleOpenSaveConfirm} className="p-8 space-y-8">
          {typeof error === 'string' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Identitas Utama */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Contact size={18} />
              Identitas Utama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">NIK (16 Digit)</label>
                <div className="relative">
                  <input 
                    name="nik" 
                    type={showNik ? "text" : "password"}
                    defaultValue={initialData?.nik}
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 font-mono tracking-[0.2em]" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNik(!showNik)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showNik ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error?.nik && <p className="text-xs text-red-500 mt-1">{error.nik[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">No. Kartu Keluarga (16 Digit)</label>
                <div className="relative">
                  <input 
                    name="kk" 
                    type={showKk ? "text" : "password"}
                    defaultValue={initialData?.kk}
                    placeholder="16 digit Nomor KK"
                    required
                    maxLength={16}
                    className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 font-mono tracking-[0.2em]" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKk(!showKk)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showKk ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error?.kk && <p className="text-xs text-red-500 mt-1">{error.kk[0]}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Nama Lengkap Sesuai KTP</label>
                <input 
                  name="name" 
                  defaultValue={initialData?.name}
                  placeholder="NAMA LENGKAP"
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase font-black tracking-tight" 
                />
                {error?.name && <p className="text-xs text-red-500 mt-1">{error.name[0]}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Kelahiran & Gender */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Calendar size={18} />
              Kelahiran & Gender
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Tempat Lahir</label>
                <input 
                  name="birth_place" 
                  defaultValue={initialData?.birth_place}
                  placeholder="KABUPATEN / KOTA"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Tanggal Lahir</label>
                <input 
                  name="birth_date" 
                  type="date"
                  defaultValue={initialData?.birth_date}
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400" 
                />
              </div>

              <div className="space-y-2">
                <CustomSelect 
                  label="Jenis Kelamin"
                  name="gender"
                  options={GENDER_OPTIONS}
                  defaultValue={initialData?.gender || 'L'}
                  icon={User}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Alamat Domisili */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <MapPin size={18} />
              Alamat Domisili
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Dusun / Lingkungan</label>
                <input 
                  name="dusun" 
                  defaultValue={initialData?.dusun}
                  placeholder="NAMA DUSUN"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">RT</label>
                <input 
                  name="rt" 
                  defaultValue={initialData?.rt}
                  placeholder="000"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 font-mono" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">RW</label>
                <input 
                  name="rw" 
                  defaultValue={initialData?.rw}
                  placeholder="000"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Section 4: Sosial & Ekonomi */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Briefcase size={18} />
              Sosial & Ekonomi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1 flex items-center gap-2">
                  <GraduationCap size={16} /> Pendidikan Terakhir
                </label>
                <input 
                  name="education" 
                  defaultValue={initialData?.education}
                  placeholder="CONTOH: SMA / SEDERAJAT"
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1 flex items-center gap-2">
                  <Briefcase size={16} /> Pekerjaan Utama
                </label>
                <input 
                  name="occupation" 
                  defaultValue={initialData?.occupation}
                  placeholder="CONTOH: PETANI / PEKEBUN"
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1 flex items-center gap-2">
                  <Heart size={16} /> Status Perkawinan
                </label>
                <input 
                  name="marital_status" 
                  defaultValue={initialData?.marital_status}
                  placeholder="CONTOH: KAWIN"
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Tahun Pendataan</label>
                <input 
                  name="data_year" 
                  type="number"
                  defaultValue={initialData?.data_year || new Date().getFullYear()}
                  required
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Section 5: Orang Tua */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Users size={18} />
              Data Orang Tua
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Nama Ayah Kandung</label>
                <input 
                  name="father_name" 
                  defaultValue={initialData?.father_name}
                  placeholder="NAMA AYAH"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/60 dark:text-foreground/40 ml-1">Nama Ibu Kandung</label>
                <input 
                  name="mother_name" 
                  defaultValue={initialData?.mother_name}
                  placeholder="NAMA IBU"
                  className="flex h-12 w-full border border-border bg-muted/30 text-foreground shadow-sm rounded-full px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition duration-400 uppercase" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-black flex items-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/25 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'SIMPAN PERUBAHAN' : 'TAMBAH PENDUDUK'}
            </button>
          </div>
        </form>
      </div>

      {/* REUSABLE DIALOGS */}
      <ConfirmDialog 
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title="Konfirmasi Integritas Data"
        description="Anda sedang mencoba mengubah data kependudukan resmi. Kesalahan penginputan data dapat berakibat pada validitas statistik desa."
        requirePhrase={TARGET_SAVE_PHRASE}
        confirmLabel="Saya Yakin & Simpan"
        loading={loading}
      />

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Record Penduduk"
        description={`Apakah Anda benar-benar yakin ingin menghapus data penduduk atas nama "${initialData?.name}"? Record ini akan hilang selamanya dari database desa.`}
        variant="danger"
        requirePhrase={initialData?.name}
        confirmLabel="Hapus Permanen"
        loading={isDeleting}
      />
    </div>
  );
}
