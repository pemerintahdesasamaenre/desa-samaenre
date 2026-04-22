'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident, deleteResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, User, Contact, MapPin, Calendar, Briefcase, Users, Eye, EyeOff, Trash2, Heart, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Resident } from '@/types';

interface ResidentFormProps {
  initialData?: Partial<Resident> & { id?: string };
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
  const [error, setError] = useState<string | null>(null);
  
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const TARGET_SAVE_PHRASE = "SAYA BERTANGGUNG JAWAB";

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
      const result = await upsertResident(data, isEditing ? initialData?.id : undefined);
      if (result.error) {
        setError(result.error as string);
      } else {
        router.push('/admin/residents');
        router.refresh();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan data.');
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
      alert('Terjadi kesalahan sistem.');
    } finally {
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

        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10 font-black text-[9px] sm:text-[10px] uppercase tracking-widest bg-destructive/5 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-destructive/20 active:scale-95"
          >
            <Trash2 size={14} />
            Hapus Record
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl sm:rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-border bg-muted/30">
          <h2 className="text-xl sm:text-3xl font-black text-foreground tracking-tighter uppercase">
            {isEditing ? 'Update Data Penduduk' : 'Input Penduduk Baru'}
          </h2>
          <p className="text-[10px] sm:text-base text-muted-foreground mt-1 font-medium italic">
            Seluruh perubahan akan tervalidasi dan tercatat dalam sistem audit desa.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleOpenSaveConfirm} className="p-6 sm:p-10 space-y-10 sm:space-y-12">
          {typeof error === 'string' && (
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold">
              {error}
            </div>
          )}

          {/* Section 1: Identitas Utama */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Contact size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground">Identitas Utama</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>NIK (16 Digit)</Label>
                <div className="relative">
                  <Input 
                    name="nik" 
                    type={showNik ? "text" : "password"}
                    defaultValue={initialData?.nik || ''}
                    required
                    maxLength={16}
                    placeholder="Masukkan NIK 16 Digit"
                    className="font-mono tracking-widest h-11 sm:h-12 text-sm"
                  />
                  <button type="button" onClick={() => setShowNik(!showNik)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showNik ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>No. Kartu Keluarga (16 Digit)</Label>
                <div className="relative">
                  <Input 
                    name="kk" 
                    type={showKk ? "text" : "password"}
                    defaultValue={initialData?.kk || ''}
                    required
                    maxLength={16}
                    placeholder="Masukkan No. KK 16 Digit"
                    className="font-mono tracking-widest h-11 sm:h-12 text-sm"
                  />
                  <button type="button" onClick={() => setShowKk(!showKk)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showKk ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Nama Lengkap (Sesuai KTP)</Label>
                <Input 
                  name="name" 
                  defaultValue={initialData?.name || ''} 
                  required 
                  placeholder="NAMA LENGKAP"
                  className="uppercase font-black h-11 sm:h-12 tracking-tight text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kelahiran & Gender */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Calendar size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground">Kelahiran & Gender</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>Tempat Lahir</Label>
                <Input name="birth_place" defaultValue={initialData?.birth_place || ''} placeholder="KOTA / KABUPATEN" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Lahir</Label>
                <Input name="birth_date" type="date" defaultValue={initialData?.birth_date || ''} required className="h-11 sm:h-12 text-sm" />
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

          {/* Section 3: Domisili */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <MapPin size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground">Domisili (Alamat)</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
              <div className="space-y-2 sm:col-span-1">
                <Label>Nama Dusun</Label>
                <Input name="dusun" defaultValue={initialData?.dusun || ''} placeholder="NAMA DUSUN" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>RT</Label>
                <Input name="rt" defaultValue={initialData?.rt || ''} placeholder="000" className="font-mono h-11 sm:h-12 text-sm text-center" />
              </div>
              <div className="space-y-2">
                <Label>RW</Label>
                <Input name="rw" defaultValue={initialData?.rw || ''} placeholder="000" className="font-mono h-11 sm:h-12 text-sm text-center" />
              </div>
            </div>
          </div>

          {/* Section 4: Sosial & Ekonomi */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Briefcase size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground">Sosial & Ekonomi</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>Pendidikan Terakhir</Label>
                <div className="relative">
                   <Input name="education" defaultValue={initialData?.education || ''} required placeholder="CONTOH: SMA / SARJANA" className="uppercase h-11 sm:h-12 pl-10 text-sm" />
                   <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pekerjaan Utama</Label>
                <div className="relative">
                   <Input name="occupation" defaultValue={initialData?.occupation || ''} required placeholder="CONTOH: PETANI / PEGAWAI" className="uppercase h-11 sm:h-12 pl-10 text-sm" />
                   <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Perkawinan</Label>
                <div className="relative">
                   <Input name="marital_status" defaultValue={initialData?.marital_status || ''} required placeholder="KAWIN / BELUM KAWIN" className="uppercase h-11 sm:h-12 pl-10 text-sm" />
                   <Heart size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tahun Pendataan</Label>
                <Input name="data_year" type="number" defaultValue={initialData?.data_year || new Date().getFullYear()} required className="font-mono h-11 sm:h-12 text-sm" />
              </div>
            </div>
          </div>

          {/* Section 5: Orang Tua */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Users size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-foreground">Data Orang Tua</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>Nama Lengkap Ayah</Label>
                <Input name="father_name" defaultValue={initialData?.father_name || ''} placeholder="AYAH KANDUNG" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap Ibu</Label>
                <Input name="mother_name" defaultValue={initialData?.mother_name || ''} placeholder="IBU KANDUNG" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-border flex flex-col sm:flex-row justify-end gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 sm:px-12 sm:py-5 rounded-full font-black flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 text-[10px] sm:text-xs tracking-widest uppercase active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
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
